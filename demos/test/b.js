import React, { 
  useState, 
  useEffect,
  useReducer,
  memo,
  useMemo,
  useRef,
  useCallback
} from 'react'
import { Alert } from 'antd';

function countReducer(state, action) {
  const rududerMap = {
    'add':state + 1,
    'minus': state -1,
  }
  return rududerMap[action.type] || state
}

function MycountFunciton() {
  const [count, dispatchCount] = useReducer(countReducer, 0)
  const [name, setName] = useState('sky')

  const countref = useRef()
  countref.current = count

  const config = useMemo(()=> (
    {
      text: `count is ${count}`,
      color: count> 3 ? 'red': 'blue'
    }
  ),[count])

  const handleBtn = useCallback(() => dispatchCount({ type: 'add' }), [])
  const handleAlert = function(){
    setTimeout(() => {
      alert(countref.current)
    }, 2000)
  }

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)}/>
      <Child 
        config = {config}
        onButtonClick={handleBtn}
      />
      <button onClick={handleAlert}>Alert</button>
    </div>
  )
}

const Child = memo(
  function Child({ config, onButtonClick }) {
    const { color, text } = config
    console.log('child render')
    return (
      <button onClick={onButtonClick} style={{color}}>
        {text}
      </button>
    )
  }
)

export default MycountFunciton