import Link from 'next/link'
import { Icon } from 'antd';

import { getLastUpdate } from '../lib/util'

function getLicense(license) {
  return license ?`${license.spdx_id} license` : ''
}

export default ({repo}) => {
  if (!repo) {
    return null
  }
  return (
    <div className="root">
      <div className="basic-info">
        <h3 className="repo-title">
          <Link href={`/detail?owner=${repo.owner.login}&name=${repo.name}`}>
            <a>{repo.full_name}</a>
          </Link>
        </h3>
        <p className="repo-desc">{repo.description}</p>
        <p className="other-info">
          {repo.license ? <span className="license">{getLicense(repo.license)}</span>: null}
          <span className="last-updated">{getLastUpdate(repo.updated_at)}</span>
          <span className="open-issues">{repo.open_issues_count} open issues</span>
        </p>
      </div>
      <div className="lang-star">
        <span className="lang">{repo.language}</span>
        <span className="stars">
          {repo.stargazers_count} <Icon type="star" theme="filled"/>
        </span>
      </div>
      <style jsx>{`
        .root {
          display: flex;
          justify-content: space-between;
        }
        .root + .root{
          border-top: 1px solid #eee;
          padding-top: 20px
        }
        .repo-title{
          font-size: 20px
        }
        .lang-star{
          display: flex;
          font-size: 14px
        }     
        .license {
          margin-right: 10px
        }
        .open-issues {
          margin-left: 10px
        }
        .other-info {
          font-size: 16px
        }
        .other-info > span + span {
          font-size: 16px
          margin-left: 10px
        }
        .lang-star>span {
          width: 120px;
          text-align: right;
        }
        .repo-desc{
          width: 400px;
          font-size: 16px
        }
      `}</style>
    </div>
  )
}