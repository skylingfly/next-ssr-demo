import React, { 
  useState, 
  useEffect,
  useReducer, 
  useLayoutEffect, 
  useContext,
  useRef
  } from 'react'
import MyContext from '../../lib/MyContext'

function countReducer(state, action) {
  const rududerMap = {
    'add':state + 1,
    'minus': state -1,
  }
  return rududerMap[action.type] || state
}

function MycountFunciton() {
  // const [count, setCount] = useState(0) // 
  const [count, dispatchCount] = useReducer(countReducer, 0)
  const [name, setName] = useState('sky')

  const context = useContext(MyContext)

  const inputRef = useRef()

  // useEffect(() => {
  //   const interval = setInterval(()=> {
  //     // setCount(c => c + 1 ) //更新状态
  //     dispatchCount({type: 'add'})
  //   },1000)

  //   return () => clearInterval(interval) //卸载
  // }, [])

  useEffect(
    ()=> {
      console.log(inputRef.current.value, 'current')
      return () => {
        console.log('disappear')
      }
    },[name]
  )
  // 渲染dom之前执行
  useLayoutEffect(
    ()=> {
      console.log('Lay invoked')
      return () => {
        console.log('Lay disappear')
      }
    },[name]
  )


  return (
    <div>
      <input ref={inputRef} value={name} onChange={(e) => setName(e.target.value)}/>
      <button onClick={() => dispatchCount({type: 'add'})}>{count}</button>
      <div>{context}</div>
    </div>
  )
}

export default MycountFunciton