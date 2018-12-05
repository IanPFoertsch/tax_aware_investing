import Account from './account'

class NonAccumulatingAccount extends Account {
  constructor(label) {
    super(label)
  }


  getValueAtTime(time) {
    return this.getFlowBalanceAtTime(time)
  }
}


class TaxCategory extends NonAccumulatingAccount {
  constructor(label) {
    super(label)
  }
}


class Expense extends NonAccumulatingAccount {
  constructor(label) {
    super(label)
  }
}


export { NonAccumulatingAccount, TaxCategory, Expense }
