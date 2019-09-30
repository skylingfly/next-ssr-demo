import Router, { withRouter } from 'next/router'
import { Row, Col, List, Pagination } from 'antd'
import Link from 'next/link'
import { memo, isValidElement, useEffect } from 'react';

import { request } from '../lib/request'
import Repo from '../components/Repo';
import { cacheArray } from '../lib/repo-basic-cache'

const isServer = typeof window === 'undefined'
const LANGUAGES = ['JavaScript', 'HTML', 'CSS', 'TypeScript', 'Java', 'Rust' ]
const SORT_TYPES = [
  {
    name: 'Best Match'
  },
  {
    name: 'Most Stars',
    value: 'stars',
    order: 'desc'
  },
  {
    name: 'Fewest Stars',
    value: 'stars',
    order: 'asc'
  },
  {
    name: 'Most Forks',
    value: 'forks',
    order: 'desc'
  },
  {
    name: 'Fewest Forks',
    value: 'forks',
    order: 'asc'
  }
]

const ActiveItemStyle = {
  borderRight: '4px solid #0093fb',
  backgroundColor: '#e6f7ff',
  fontWeight: 600,
  color: '#1890ff'
}

const per_page = 20

/**
 * sort: 排序方式
 * order: 排序顺序
 * lang: 仓库的项目开发主语言
 * page: 分页
 */



const FilterLink = memo(({ name, query, lang, sort, order, page }) => {
  let querystring = `?query=${query}`
  lang && (querystring+=`&lang=${lang}`)
  sort && (querystring+=`&sort=${sort}&order=${order|| 'desc'}`)
  page && (querystring+=`&page=${page}`)

  querystring+=`&per_page=${per_page}`

  return (
    <Link href={`/search${querystring}`}>
      {isValidElement(name) ? name : <a>{name}</a>}
    </Link>
  )
})

function Search({router, repos}) {

  const { ...querys } = router.query
  const {lang, sort, order, query, page } = querys

  useEffect(()=> {
    !isServer && cacheArray(repos.items)
  })

  return (
    <div className="root">
      <Row gutter={24}>
        <Col span={6}>
          <List 
            bordered
            header={<div className="list-header">Languages</div>}
            style={{marginBottom: 20}}
            dataSource={LANGUAGES}
            renderItem = {
              item => {
                const selected = lang === item
                return <List.Item style={selected ? ActiveItemStyle : null}>
                { selected ? <span>{item}</span> :<FilterLink {...querys} name={item} lang={item}/> }
                </List.Item>
              }
            }
            />
          <List 
            bordered
            header={<div className="list-header">Orders</div>}
            dataSource={SORT_TYPES}
            renderItem = {
              item => {
                let selected = false
                if (!sort && (item.name==='Best Match')) {
                  selected = true
                } else if(item.value === sort && item.order ===order) {
                  selected = true
                }

                return <List.Item style={selected ? ActiveItemStyle : null}>
                  {
                    selected ? <span>{item.name}</span> :<FilterLink  {...querys} name={item.name} sort={item.value} order={item.order}/>
                  }
                </List.Item>
              }
            }
            />
        </Col>
        <Col span={18}>
          
          <h3 className="repos-title">{repos && repos.total_count || ''} 个仓库</h3>
          {
            repos && repos.items.map( v => {
              return <Repo repo={v} key={v.id}/>
            })
          }
          <div className="pagination">
            <Pagination
              showSizeChanger
              pageSize={per_page}
              defaultCurrent={Number(page) || 1}
              total={(repos && (repos.total_count> 1000 ? 1000: repos.total_count)) || 0}
              itemRender={(current, type, oel)=> {
                const p = type === 'page'? current : type==='prev'? current-1: current+1
                const name = type === 'page'? current : oel
                return <FilterLink {...querys} page={p} name={name}/>
              }}
              onChange={()=>{}}
              />
          </div>
        </Col>
      </Row>
      <style jsx>{`
          .list-header{
            text-align: center;
            font-size: 16px;
            font-weight: 700;
          }
          .root{
            padding: 20px 0;
          }
          .repos-title {
            font-size: 24px;
            border-bottom: 1px solid #eee
          }
          .pagination {
            padding: 20px;
            text-align: center;
          }
        `}</style>
    </div>
  )
}

Search.getInitialProps = async(ctx) => {
  const { query, sort, lang, order, page } = ctx.ctx.query
  if(!query) {
    return {
      repos: {
        total_count: 0
      }
    }
  }
  // format :?q=react+language:javascript&sort=stars&order=desc&page=1
  let querystring = `?q=${query}`
  lang && (querystring+=`+language:${lang}`)
  sort && (querystring+=`&sort=${sort}&order=${order|| 'desc'}`)
  page && (querystring+=`&page=${page}`)

  querystring+=`&per_page=${per_page}`

  try {
    const result = await request({
      url: `/search/repositories${querystring}`
    },ctx.req, ctx.res, ctx)
    if (result.status !== 200) return {}
    
    return {
      repos: result.data
    }
  } catch (error) {
    console.log(error)
  }
}

export default withRouter(Search)