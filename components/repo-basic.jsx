import { useEffect } from 'react'
import Link from "next/link";
import { withRouter } from "next/router";

import Repo from './Repo';
import { request } from '../lib/request'
import { cache, get } from '../lib/repo-basic-cache'

const isServer = typeof window === 'undefined'

function makeQuery(queryObj) {
  const query = Object.entries(queryObj)
    .reduce((pre, entry) => {
      pre.push(entry.join('='))
      return pre
    },[]).join('&')
  return query
}

export default (Comp, type='index') => {

  function WithDetail({repoBasic, router, ...rest}) {

    useEffect(()=> {
      !isServer && cache(repoBasic)
    })

    const query = makeQuery(router.query)
    return (
      <div className="root">
        <div className="repo-basic">
          <Repo repo={repoBasic}/>
          <div className="tabs">
            {
              type==='index' ? <span className="tab">Readme</span>:<Link href={`/detail?${query}`}>
              <a className="tab index">Readme</a>
            </Link>
            }
            
            {
              type==='issues' ? <span className="tab">Issues</span>:<Link href={`/detail/issues?${query}`}>
              <a className="tab issues">Issues</a>
            </Link>
            }
          </div>
        </div>
        <div><Comp {...rest}/></div>
        <style jsx>{`
            .root{
              padding-top: 20px;
            }
            .repo-basic{
              padding: 20px;
              border: 1px solid #eee;
              margin-bottom: 20px;
              border-radius: 5px;
            }
            .tab {
              font-size: 16px
            }
            .tab + .tab {
              margin-left: 20px;
            }
          `}</style>
      </div>
    )
  }
  
  WithDetail.getInitialProps = async (context) => {
    const { router, ctx } = context
    const { name, owner } = ctx.query
    const full_name = `${owner}/${name}`
    try {
      
      let pageData = {}
      if(Comp.getInitialProps) {
        pageData = await Comp.getInitialProps(context)
      }

      if(get(full_name)) {
        return {
          repoBasic: get(full_name),
          ...pageData
        }
      }

      const result = await request({
        url: `/repos/${owner}/${name}`
      },ctx.req, ctx.res)

      return {
        repoBasic: result.data,
        ...pageData
      }
    } catch (error) {
      console.log(error)
    }
  }

  return withRouter(WithDetail)

}