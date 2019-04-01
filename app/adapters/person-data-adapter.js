import AccountDataAdapter from './account-data-adapter'
import _ from '../../node_modules/lodash/lodash.js'

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

  static getYearlyFlowData(person, timeIndex) {
    var nodes = []
    var nodeKeys = Object.keys(person.accounts).concat(
      Object.keys(person.taxCategories),
      Object.keys(person.expenses),
      Object.keys(person.thirdPartyAccounts)
    )

    var allAccounts = {}

    Object.keys(person.accounts).forEach(key => {
      allAccounts[key] = person.accounts[key]
    })

    Object.keys(person.taxCategories).forEach(key => {
      allAccounts[key] = person.taxCategories[key]
    })

    Object.keys(person.expenses).forEach(key => {
      allAccounts[key] = person.expenses[key]
    })

    Object.keys(person.thirdPartyAccounts).forEach(key => {
      allAccounts[key] = person.thirdPartyAccounts[key]
    })


    var nodeIndexes = {}
    var links = []

    for (const [i, key] of nodeKeys.entries()) {

      nodes.push({name: key})
      nodeIndexes[key] = i
      //for each contribution, create a link targeting account node, from source

    }

    for (const [i, key] of nodeKeys.entries()) {
      var account = allAccounts[key]
      var contributions = account.contributions[timeIndex]
      //for each contribution, create a link targeting account node, from source
      if (contributions === undefined) {
        continue
      }

      contributions.forEach((cashFlow) => {
        links.push({
          source: nodeIndexes[cashFlow.source.label],
          target: nodeIndexes[cashFlow.target.label],
          value: cashFlow.value
        })

      })
    }


    return {links: links, nodes: nodes}
  }
}

export default PersonDataAdapter
