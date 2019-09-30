import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from './reducers'

const userState = {}

export default function initializeStore(initState) {
  const Store = createStore(rootReducer, 
    Object.assign({},{
      user: userState,
    }, initState)
    , 
    composeWithDevTools(applyMiddleware(ReduxThunk))
    )

  return Store
}