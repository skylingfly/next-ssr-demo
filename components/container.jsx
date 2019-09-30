import { cloneElement } from 'react'

const containerStyle = {
  width: '100%',
  minWidth: 800,
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 20,
  paddingRight: 20
}

export default ({children, renderr=<div />}) => {

  return cloneElement(renderr, {
    style: {...containerStyle, ...renderr.props.style},
    children
  })
}