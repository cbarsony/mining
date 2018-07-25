import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import update from 'immutability-helper'

import {App} from 'cmp/App'

const initialState = {
  fileList: [],
  equipmentList: [],
  selectedEquipmentId: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPLOAD_FILE':
      return update(state, {
        fileList: {
          $push: [action.file],
        },
      })
    case 'ADD_EQUIPMENT':
      return update(state, {
        equipmentList: {
          $push: [action.equipment],
        },
      })
    case 'SELECT_EQUIPMENT':
      return update(state, {
        selectedEquipmentId: {
          $set: action.equipmentId,
        },
      })
    default:
      return state
  }
}

export const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
