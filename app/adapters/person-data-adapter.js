import AccountDataAdapter from './account-data-adapter'
import _ from '../../node_modules/lodash/lodash.js'
import Constants from '../constants'

class PersonDataAdapter {
  //the data adapter is a tree crawler that outputs chart-formatted data
  //to the chartjsAdapter
  static lineChartData(accounts, maxTime) {
    return _.reduce(accounts, (memo, account) => {
      memo[account.getLabel()] = AccountDataAdapter.accountValueData(account, maxTime)
      return memo
    }, {})
  }

  static flowBalanceByTimeData(accounts, maxTime) {
    var data = _.reduce(accounts, (memo, account) => {
      memo[account.getLabel()] = _.map(_.range(0, maxTime + 1), (timeIndex) => {
        return account.getFlowBalanceAtTime(timeIndex)
      })

      return memo
    }, {})

    var labels = _.map(_.range(maxTime), (i) => {
      return 'Year ' + i
    })

    return { data: data, labels: labels}
  }
}

export default PersonDataAdapter
