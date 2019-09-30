import { useState, useCallback, useRef } from 'react';
import { Select, Spin } from 'antd'
import debounce from 'lodash/debounce'

import { request } from '../lib/request'
const { Option } = Select

function SearchUser({onChange, value}) {
  const lastFetchIdRef = useRef(0)
  const[fetching, setFectching] = useState(false)
  const[options, setOptions] = useState([])

  const fetchUser = useCallback(
    debounce(async(value) => {
    if(!value) return 
    setFectching(true)
    setOptions([])
    lastFetchIdRef.current +=1
    const fetchId = lastFetchIdRef.current
    try {
      const resp = await request({
        url:`/search/users?q=${value}`
      })

      if(fetchId !== lastFetchIdRef.current ) return
      const data = resp.data.items.map(v =>({
        text: v.login,
        value: v.login
      }))

      setFectching(false)
      setOptions(data)
    } catch (error) {
      setFectching(false)
      setOptions([])
    }
    
  }, 1000),[])

  const handleChange = (value) => {
    setOptions([])
    setFectching(false)
    onChange(value)
  }


  return (
    <Select
      style={{width: 200}}
      value={value}
      showSearch={true}
      filterOption={false}
      allowClear={true}
      onSearch={fetchUser}
      onChange={handleChange}
      placeholder="Creator"
      notFoundContent={fetching ? <Spin size="small" /> : <span>Empty</span>}
    >
      {options.map(v => (
          <Option key={v.value} value={v.value}>
            {v.text}
          </Option>
        ))}
    </Select>
  )
}
export default SearchUser