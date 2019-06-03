import SankeyDataAdapter from '../../app/adapters/sankey-data-adapter'
import Account from '../../app/models/account'
import Person from '../../app/models/person'
import PersonService from '../../app/services/person-service.js'
import Constants from '../../app/constants.js'

fdescribe('SankeyDataAdapter', function() {
  let firstLabel
  let lastLabel
  var person
  var personData

  var expectedIncomes


  beforeEach(()=> {
    personData = {
      [Constants.AGE]: 30,
      [Constants.BROKERAGE]: 4000,
      [Constants.CAREER_LENGTH]: 30,
      [Constants.RETIREMENT_LENGTH]: 30,
      [Constants.RETIREMENT_SPENDING]: 50000,
      [Constants.ROTH_401K_CONTRIBUTIONS]: 4000,
      [Constants.TRADITIONAL_401K_CONTRIBUTIONS]: 5000,
      [Constants.WAGES_AND_COMPENSATION]: 70000
    }

    expectedIncomes = [
      Constants.WAGES_AND_COMPENSATION,
    ]
    person = new PersonService(personData).buildPerson()
  })

  const expectNodeNames = ((data, expectedNames) => {
    var nodeNames = data.nodes.map((node) => { return node.name })

  })

  it('has nodes for all tax expenses', () => {
    var data = SankeyDataAdapter.getSankeyLifetimeFlowSummary(person)

    var expectedTaxExpenses = [
      Constants.MEDICARE,
      Constants.SOCIAL_SECURITY,
      Constants.FEDERAL_INCOME_TAX
    ]

    expectNodeNames(data, expectedTaxExpenses)
  })

  it('has nodes for all income sources', () => {
    var data = SankeyDataAdapter.getSankeyLifetimeFlowSummary(person)

    expectNodeNames(data, expectedIncomes)
  })

  it('has nodes for all expected tax categories', () => {
    var data = SankeyDataAdapter.getSankeyLifetimeFlowSummary(person)

    var expectedTaxCategories = [
      Constants.TOTAL_INCOME,
    ]
    expectNodeNames(data, expectedTaxCategories)
  })

  it('has a link from all incomes to total income', () => {
    var data = SankeyDataAdapter.getSankeyLifetimeFlowSummary(person)
    var links = data.links
    var nodes = data.nodes

    expectedIncomes.forEach((incomeLabel) => {

      var incomeNodeIndex = nodes.findIndex((node) => {
        return node.name === incomeLabel
      })

      var totalIncomeNodeIndex = nodes.findIndex((node) => {
        return node.name === Constants.TOTAL_INCOME
      })

      var link = links.find((link) => {
        return link.target === totalIncomeNodeIndex &&
          link.source === incomeNodeIndex
      })

      expect(link).not.toBeUndefined()
    })

  })

  it('has a link from total income to each tax expense', () => {
    var data = SankeyDataAdapter.getSankeyLifetimeFlowSummary(person)
    var links = data.links
    var nodes = data.nodes

    expectedIncomes.forEach((incomeLabel) => {
      var incomeNodeIndex = nodes.findIndex((node) => {
        return node.name === incomeLabel
      })

      var totalIncomeNodeIndex = nodes.findIndex((node) => {
        return node.name === Constants.TOTAL_INCOME
      })

      var link = links.find((link) => {
        return link.target === totalIncomeNodeIndex &&
          link.source === incomeNodeIndex
      })

      expect(link).not.toBeUndefined()
    })
  })

  it('', () => {

  })

  it('', () => {

  })
})
