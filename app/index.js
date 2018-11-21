var React = require('react')
var ReactDOM = require('react-dom')
import App from './components/app.js'

import { createStore } from 'redux'
import { Provider } from 'react-redux'
import taxApplication from './reducers/base-reducer'
import './style.css'

const store = createStore(taxApplication)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
