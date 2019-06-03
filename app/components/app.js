var React = require('react')
import Constants from '../constants'
import InputTable from './input-table'
import LineChartHolder from './line-chart-holder'
import SankeyChartHolder from './sankey-chart-holder'
import PersonService from '../services/person-service'
import { connect } from 'react-redux'

class App extends React.Component {

  handleChange(event) {
    // this.state.inputRows[event.target.name] = event.target.value
    var action = {
      type: 'UPDATE_PROJECTION',
      input: event.target.name,
      value: parseInt(event.target.value)
    }

    this.store.dispatch(action)
  }

  buildPerson(personData) {
    var personService = new PersonService(personData)
    console.log(personData)
    return personService.buildPerson()
  }

  constructor(props) {
    super(props)
    this.store = props.store
    this.state = {
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
        [Constants.RETIREMENT_LENGTH]: {type: 'number', value: 30},
      },
      netWorthChart: {
        cssClasses: ['chart-holder'],
        canvas: { type: 'line'},
      },
    }
    this.handleChange = this.handleChange.bind(this)
  }

  render() {
    var person = this.buildPerson(this.props.person)

    return (
      <div>
        <div>
          <form>
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
          <LineChartHolder
            person={person}
          />
          <SankeyChartHolder
            person={person}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  //note: 'state' here is the new state returned by our reducers
  return {person: state.taxApplication}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
