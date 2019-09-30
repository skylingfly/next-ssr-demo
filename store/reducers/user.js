import { LOG_OUT } from "../constants/user"

const userState = {
  
}

export default function userReducer(state = userState, action) {
  // 策略模式 [key]: funciton  调用 map[k]()
  switch (action.type){
    case LOG_OUT:
      return {}
    default:
      return state
  }
}
