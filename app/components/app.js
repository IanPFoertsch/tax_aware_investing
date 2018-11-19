var React = require('react')
import Constants from '../constants/constants'
import InputTable from './input-table'
import LineChartHolder from './line-chart-holder'
import BarChartHolder from './bar-chart-holder'
import PersonListener from '../document-listeners/person-listener'

class App extends React.Component {

  handleChange(event) {
    this.state.inputRows[event.target.name] = event.target.value
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

export default App
