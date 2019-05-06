import CashFlow from './cash-flow'
import Constants from '../constants'
//Abstract SuperClass
export default class Account {
  constructor(label) {
    this.label = label
    this.contributions = {}
    this.expenses = {}
  }

  getLabel() {
    return this.label
  }

  flows() {
    return this.getPositiveFlowList().concat(this.getNegativeFlowList())
  }

  getFlowBalanceAtTime(time) {
    var positiveValue = _.reduce(this.getPositiveFlowList(), (value, flowList) => {
      return value + this.sumFlow(flowList[time])
    }, 0)

    var negativeValue = _.reduce(this.getNegativeFlowList(), (value, flowList) => {
      return this.sumFlow(flowList[time])
    }, 0)

    return positiveValue - negativeValue
  }

  getPositiveFlowList() {
    return [this.contributions]
  }

  getNegativeFlowList() {
    return [this.expenses]
  }

  getInFlowValueAtTime(time) {
    var flows = this.contributions[time]

    return _.reduce(flows, (memo, flow) => {
      return memo + flow.getValue()
    }, 0) || 0
  }

  getOutflowValueToExpense(time, targetAccountLabel) {
    return this.expenses[time].find((cashflow) => {
      return cashflow.target.label === targetAccountLabel
    }).value
  }

  //private
  registerInFlow(cashFlow) {
    var time = cashFlow.time
    this.contributions[time] = this.contributions[time] || []
    this.contributions[time].push(cashFlow)
  }

  //private
  registerOutFlow(cashFlow) {
    var time = cashFlow.time
    this.expenses[time] = this.expenses[time] || []
    this.expenses[time].push(cashFlow)
  }

  createInFlow(timeIndex, value, fromAccount) {
    var flow = new CashFlow(timeIndex, value, fromAccount, this)
    this.registerInFlow(flow)
    fromAccount.registerOutFlow(flow)
  }

  createExpense(timeIndex, value, toAccount) {
    var flow = new CashFlow(timeIndex, value, this, toAccount)
    this.registerOutFlow(flow)
    toAccount.registerInFlow(flow)
  }

  createInterestFlow(timeIndex, value) {

    this.interestSource = this.interestSource || new Account('Interest')
    this.interestFlows[timeIndex] = this.interestFlows[timeIndex] || []
    this.interestFlows[timeIndex].push(new CashFlow(timeIndex, value, this, this.interestSource))
  }

  timeIndices(maxTime) {
    var indices = _.reduce(this.flows(), (memo, flow) => {
      return memo.concat(Object.keys(flow))
    }, [])

    indices = _.map(indices, (index) => {
      return parseInt(index)
    })

    var sorted = Array.from(new Set(indices)).sort(( function(a,b) { return a - b } ))
    if (maxTime != undefined) {
      return _.filter(sorted, (index) => {
        return parseInt(index) <= maxTime
      })
    } else {
      return sorted
    }
  }

  sumFlow(flows) {
    return _.reduce(flows, (value, flow) => {
      return value + flow.getValue()
    }, 0) || 0
  }

  calculateInterest(endTime) {
    //reset the state
    this.interestFlows = {}
    //TODO: this is "stateful"... which is bad, figure out a way to calculate
    //and track this statelessly

    _.forEach(_.range(0, endTime), (time) => {
      var interestGain = this.singlePeriodCompounding(time)
      this.createInterestFlow(time + 1, interestGain, this.interestSource)
    })
  }

  singlePeriodCompounding(timeStep) {
    var value = this.getValueAtTime(timeStep)
    return value * Constants.DEFAULT_GROWTH_RATE
  }
}
