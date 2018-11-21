var React = require('react')
import Constants from '../constants/constants'
import InputTable from './input-table'
import LineChartHolder from './line-chart-holder'
import BarChartHolder from './bar-chart-holder'
import PersonListener from '../document-listeners/person-listener'

import {connect} from 'react-redux'

class App extends React.Component {

  handleChange(event) {
    this.state.inputRows[event.target.name] = event.target.value
    var action = {
      type: 'UPDATE_PROJECTION',
      input: event.target.name,
      value: event.target.value
    }
    dispatch(this.state.inputRows)
    // var labelKeys = Object.keys(this.state.inputRows)

    //
    // labelKeys.forEach((key) => {
    //   action.inputs[key] = this.state.inputRows[key].value
    // })
    // console.log(action)
    // dispatch(action)
  }

  constructor(props) {
    super(props)
    this.state = {
      person: {},
      inputRows: {
        [Constants.WAGES_AND_COMPENSATION]: {type: 'number', value: 70000 },
        [Constants.TRADITIONAL_IRA_CONTRIBUTIONS]: {type: 'number', value: 5000 },
        [Constants.ROTH_IRA_CONTRIBUTIONS]: {type: 'number', value: 2000 },
        [Constants.ROTH_401K_CONTRIBUTIONS]: {type: 'number', value: 4000 },
        [Constants.TRADITIONAL_401K_CONTRIBUTIONS]: {type: 'number', value: 14000 },
        [Constants.BROKERAGE]: {type: 'number', value: 4000 },
        [Constants.CAREER_LENGTH]: {type: 'number', value: 30 },
        [Constants.AGE]: {type: 'number', value: 30 },
        [Constants.RETIREMENT_SPENDING]: {type: 'number', value: 50000 },
        [Constants.RETIREMENT_LENGTH]: {type: 'number', value: 50000 },
      },
      netWorthChart: {
        cssClasses: ['chart-holder'],
        canvas: { type: 'line'},
      },
    }
    this.handleChange = this.handleChange.bind(this)
  }


  render() {
    return (
      <div>
        <div>
          <form onSubmit={event => {
            event.preventDefault()
            // console.log(event.target)
            var listener = new PersonListener()
          }}>
            <InputTable
              rows={this.state.inputRows}
              onChange={this.handleChange}
            />
            <button type="submit">
              Project Income
            </button>
          </form>
        </div>
        <div>
          <LineChartHolder />
          <BarChartHolder />
        </div>
      </div>
    )
  }
}
// TODO: Make me work - https://stackoverflow.com/questions/35526940/how-to-get-dispatch-redux
// function mapStateToProps(state) {
//   return { stuff: state }
// }
//
// export default connect(mapStateToProps)(App)

export default App
