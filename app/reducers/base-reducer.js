import Constants from '../constants/constants'

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
  [Constants.RETIREMENT_LENGTH]: 50000,
}

function taxApplication(state = initialState, action) {
  return initialState


  // this.state.inputRows[event.target.name] = event.target.value
  // var labelKeys = Object.keys(this.state.inputRows)
  // var action = {
  //   type: 'UPDATE_PROJECTION',
  //   inputs: {}
  // }
  //
  // labelKeys.forEach((key) => {
  //   action.inputs[key] = this.state.inputRows[key].value
  // })
  // console.log(action)
}
export default combineReducers({
  taxApplication
})
