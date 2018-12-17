import Account from './account'
import _ from '../../node_modules/lodash/lodash.js'

export default class AccumulatingAccount extends Account {
  constructor(label) {
    super(label)
    this.interestFlows = {}
  }

  getValueAtTime(time) {
    return _.reduce(this.timeIndices(time), (value, index) =>  {
      return value + this.getFlowBalanceAtTime(index)
    }, 0)
  }

  getPositiveFlowList() {
    return [this.contributions, this.interestFlows]
  }
}
