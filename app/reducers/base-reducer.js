import Constants from '../constants'
import { combineReducers } from 'redux'

const initialState = {
  [Constants.WAGES_AND_COMPENSATION]: 70000,
  [Constants.TRADITIONAL_IRA_CONTRIBUTIONS]: 5000,
  [Constants.ROTH_IRA_CONTRIBUTIONS]: 2000,
  [Constants.ROTH_401K_CONTRIBUTIONS]: 4000,
  [Constants.TRADITIONAL_401K_CONTRIBUTIONS]: 14000,
  [Constants.BROKERAGE]: 4000,
  [Constants.CAREER_LENGTH]: 30,
  [Constants.AGE]: 30,
  [Constants.RETIREMENT_SPENDING]: 50000,
  [Constants.RETIREMENT_LENGTH]: 30,
}

function taxApplication(state, action) {
  if ((typeof state) === 'undefined') {
    return initialState
  } else if (action.type == 'UPDATE_PROJECTION') {
    //make a copy of the state and return it, updated by the action

    var newState = Object.assign({}, state, {
      [action.input]: action.value
    })
    return newState
  }
}
export default combineReducers({
  taxApplication
})
