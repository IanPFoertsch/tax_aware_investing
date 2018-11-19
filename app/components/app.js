var React = require('react')
import Constants from '../constants/constants'
import InputTable from './input-table'
import Button from './button'

class App extends React.Component {
  render() {
    var inputRows = [
      { label: Constants.WAGES_AND_COMPENSATION, type: 'number', default: 50000 },
      { label: Constants.TRADITIONAL_IRA_CONTRIBUTIONS, type: 'number', default: 1000},
      { label: Constants.ROTH_IRA_CONTRIBUTIONS, type: 'number', default: 2000},
      { label: Constants.TRADITIONAL_401K_CONTRIBUTIONS, type: 'number', default: 5000},
      { label: Constants.ROTH_401K_CONTRIBUTIONS, type: 'number', default: 5000},
      { label: Constants.BROKERAGE, type: 'number', default: 1000},
      { label: Constants.CAREER_LENGTH, type: 'number', default: 20},
      { label: Constants.AGE, type: 'number', default: 30},
      { label: Constants.RETIREMENT_SPENDING, type: 'number', default: 7000},
      { label: Constants.RETIREMENT_LENGTH, type: 'number', default: 10},
    ]

    return (
      <div>
        <InputTable
          rows={inputRows}
        />
      </div>
    )
  }
}

export default App
