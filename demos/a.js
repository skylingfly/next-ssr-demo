import Head from 'next/head'
import { withRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styled from 'styled-components'

const Title = styled.h1`
  color: green;
  font-size: 20px
`
const Comp = dynamic(import('../components/Comp'))

const A =  (props) => {
  const {name, router, time} = props
  
  const { id } = router.query
  const color = '#ccc'
  return (
    <>
      <Title>this is styled H1 {time}</Title>
      <Comp />
      <Link href="#aaa">
        <a className="link"> jump index {id} ，姓名{name}</a>
      </Link>
      <style jsx>{
        `
        a{
          color: blue
        }
        .link{
          color: ${color}
        }
        `
      } </style> 
    </>
    
)}

A.getInitialProps = async (ctx) => {
  const moment = await import('moment')
  const promise = new Promise((resolve) => {
    setTimeout(()=> {
      resolve({
        name: 'sky',
        time: moment.default(Date.now()- 60*1000).fromNow()
      }) 
    },2000)
  })

  return await promise
  
};
export default withRouter(A)