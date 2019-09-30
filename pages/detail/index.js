import RepoBasic from '../../components/repo-basic.jsx'
import { request } from '../../lib/request';
import dynamic from 'next/dynamic'

const WithMD = dynamic(
  ()=>import('../../components/with-markdown'),
  { loading: () => <p>loading...</p> }
)

function Detail({readme}) {

  return <WithMD content={readme.content} isBase64={true}/>
}

Detail.getInitialProps = async({ctx}) => {

  const {name, owner} = ctx.query
  try {
    const readmeRes = await request({
      url:`/repos/${owner}/${name}/readme`
    },ctx.req, ctx.res)

    return {
      readme: readmeRes.data
    }

  } catch (error) {
    console.log(error)
  }
  
}

export default RepoBasic(Detail, 'index')