import { LOG_OUT } from "../constants/user"
import axios from 'axios'

export function logout() {
  return async dispatch => {
    axios.post('/logout')
    .then(res => {
      if(res.status!==200) {
        console.log('logout failed', res)
        return
      }
      dispatch({
        type: LOG_OUT
      })
    }).catch(err => console.log('logout failed', err))
  }
}