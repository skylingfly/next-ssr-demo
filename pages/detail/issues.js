import { useState, useCallback, useEffect } from 'react'
import { Avatar, Button, Select, Spin, Empty } from 'antd'
import dynamic from 'next/dynamic'

import { request, requestGithub } from '../../lib/request'
import { getLastUpdate } from '../../lib/util'
import RepoBasic from '../../components/repo-basic'
import SearchUser from '../../components/SearchUser'
const MdRender = dynamic(()=> import('../../components/with-markdown'))

const { Option } = Select 
const statusArr = [
  {text: 'all', value: 'all'},
  {text: 'open', value: 'open'},
  {text: 'closed', value: 'closed'},
]

const CACHE = {}

const isServer = typeof window === 'undefined'

function makeQuery(creator, status, labels) {
  const arr = []
  creator && (arr.push(`creator=${creator}`))
  status && (arr.push(`state=${status}`))
  labels && (labels.length > 0) && (arr.push(`labels=${labels.join(',')}`))

  return `?${arr.join('&')}`
}

function RenderLabel({label}) {

  return <>
    <span className="label" style={{backgroundColor: `#${label.color}`}}>{label.name}</span>
    <style jsx>{`
      .label {
        display: inline-block;
        font-size: 12px;
        margin-left: 15px;
        padding: 2px 6px;
        border-radius: 4px;
      }

    `}</style>
  </>

}

function IssueDetail({issue}) {

  return (
    <div className="root">
      <MdRender content={issue.body}/>
      <div className="actions">
        <Button href={issue.html_url} target="_blank">open issue discuss page</Button>
      </div>
      <style jsx>{`
        .root{
          padding: 20px;
          background-color: #fefefe;
        }
        .actions{
          text-align: right;
        }
        `}</style>
    </div>
  )
}

function IssueItem({issue}) {

  const [showDetail, setSshowDetail] = useState(false)
  
  const toggleShow = useCallback(()=> {
    setSshowDetail(detail => !detail)
  },[])

  return(
  <div>
    <div className="issue">
      <div className="avatar">
        <Avatar src={issue.user.avatar_url} shape="square" size={50}/>
      </div>
      <div className="main-info">
        <h6>
          <span>{issue.title}</span>
          {
            issue.labels.map(v => <RenderLabel label={v} key={v.id}/>)
          }
        </h6>
        <p className="sub-info">
          <span>updated at {getLastUpdate(issue.updated_at)}</span>
        </p>
      </div>
      <Button 
        type="primary" 
        size="small"
        onClick={toggleShow}
        className="checkbtn">
      { showDetail ? '隐藏' : '查看'}
      </Button>
      <style jsx>{`
        .issue  {
          display: flex;
          position: relative;
          padding: 10px
        }
        .issue:hover {
          background-color: #f2f2f2
        }
        .issue + .issue {
          border-top: 1px solid #eee
        }
        .main-info{
          flex-grow: 1;
          margin-right: 10px
        }
        .main-info > h6 {
          max-width: 600px;
          font-size: 16px;
        }
        .avatar {
          margin-right: 20px;
        }
        .checkbtn {
          padding-top: 30px;
        }
        .sub-info {
          font-size: 12px;
        }
        .sub-info> span + span {
          display: inline-block;
          margin-left: 10px;
        }
        `}</style>
    </div>
    {showDetail ?<IssueDetail issue={issue} />: null}
  </div>
  )
}

function Issues({initalissues, labels, owner, name}) {

  const [creator, setCreator] = useState()
  const [status, setStatus] = useState()
  const [label, setLabel] = useState()
  const [issues, setIssues] = useState(initalissues)
  const [fetching, setFetching] = useState(false)

  useEffect(()=> {
    !isServer && (CACHE[`${owner}/${name}`] = labels)
  },[labels, owner, name])

  const handleChange = useCallback((val) =>{
    setCreator(val)
  },[])

  const handleStatusChange = useCallback((val) =>{
    setStatus(val)
  },[])

  const handleLabelChange = useCallback((val) =>{
    setLabel(val)
  },[])

  const handleSearch = useCallback(async() => {
    try {
      setFetching(true)
      const resp = await request({
        url: `/repos/${owner}/${name}/issues${makeQuery(creator, status, label)}`
      })
      setIssues(resp.data)
    } catch (error) {
      console.log(error)
    } finally{
      setFetching(false)
    }
  },[owner, name, creator, status, label ])
  
  return (
    <div className="root">
      <div className="search">
        <SearchUser onChange={handleChange} value={creator}/>
        <Select
          placeholder="status"
          onChange={handleStatusChange}
          value={status}
          style={{width: 200, marginLeft: '20px'}}
        >
          {
            statusArr.map(v => (
              <Option value={v.value} key={v.value}>{v.text}</Option>
            ))
          }
        </Select>
        <Select
          mode="multiple"
          placeholder="Label"
          onChange={handleLabelChange}
          value={label}
          style={{flexGrow: 1, marginRight: 20, marginLeft: '20px'}}
        >
          {
            labels && labels.map(v => (
              <Option key={v.id} value={v.name}>{v.name}</Option>
            ))
          }
        </Select>
        <Button type="primary" disabled={fetching} onClick={handleSearch}> Search </Button>
      </div>
      
      {
        fetching?<div className="fetching"><Spin tip="Laoding ... "/></div> : issues.length === 0 ? <div className="fetching"><Empty description="暂无相关数据!"/></div> : <div className="issues">
        {
          issues.map(v=> <IssueItem issue={v} key={v.id}/>)
        }
      </div>
      }
     
      <style jsx>{`
        .issues {
          border: 1px solid #eee;
          boder-radius: 4px;
          margin: 20px 0;
        }
        .search {
          display: flex;
        }
        .fetching {
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        `}</style>
    </div>
  )
}

Issues.getInitialProps = async({ctx}) => {
  const { owner, name } = ctx.query
  const full_name = `${owner}/${name}`
  try {
    const [issueRsp, labelsRsp] = await Promise.all([
      request({
        url: `/repos/${owner}/${name}/issues`
      }, ctx.req, ctx.res),
      CACHE[full_name] ? Promise.resolve({data: CACHE[full_name]}) : requestGithub(
        'GET',
        `/repos/${owner}/${name}/labels`
      )
    ])
    return {
      initalissues: issueRsp.data || [],
      labels: labelsRsp.data || [],
      owner, 
      name
    }
  } catch (error) {
    console.log(error)
  }
}

export default RepoBasic(Issues, 'issues')