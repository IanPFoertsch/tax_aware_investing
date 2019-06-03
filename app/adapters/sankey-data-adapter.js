import Constants from '../constants'

class SankeyDataAdapter {
  static getSankeyLifetimeFlowSummary(person) {
    var incomes = [
      Constants.WAGES_AND_COMPENSATION
    ]

    var taxCategories = [
      Constants.TOTAL_INCOME
    ]
    person.getLifetimeIncomeFromSource(Constants.WAGES_AND_COMPENSATION)
    var expenses = [
      Constants.MEDICARE,
      Constants.SOCIAL_SECURITY,
      Constants.FEDERAL_INCOME_TAX
    ]
    var nodes = []
    var nodeIndexes = {}

    var allAccountLabels = expenses.concat(taxCategories).concat(incomes)
    allAccountLabels.forEach((label, index) => {
      nodes.push({name: label})
      nodeIndexes[label] = index
    })

    var links = expenses.map((expenseLabel) => {
      return {
        source: nodeIndexes[Constants.TOTAL_INCOME],
        target: nodeIndexes[expenseLabel],
        value: person.getLifetimeContributionsToExpense(expenseLabel)
      }
    })
    links.push({
      source: nodeIndexes[Constants.WAGES_AND_COMPENSATION],
      target: nodeIndexes[Constants.TOTAL_INCOME],
      value: person.getLifetimeIncomeFromSource(Constants.WAGES_AND_COMPENSATION)
    })
    
    return { nodes: nodes, links: links }
  }
}

export default SankeyDataAdapter
