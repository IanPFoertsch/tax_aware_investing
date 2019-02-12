import _ from '../../node_modules/lodash/lodash.js'

class ValueCalculator {
  static singlePeriodCompounding(startingBalance, interestRate) {
    return startingBalance * (1 + interestRate)
  }


  static projectInvestmentGrowth(
    startingBalance,
    lengthOfTime,
    interestRate,
    contributionPerPeriod = 0
  ) {
  //assumes contributions and interest accrue at end of period
    return _.reduce(_.range(1, lengthOfTime + 1), (memo) => {
      var runningBalance = memo[memo.length - 1]
      var growthFromInterest = runningBalance * interestRate
      runningBalance = runningBalance + growthFromInterest + contributionPerPeriod
      memo.push(runningBalance)
      return memo
    }, [startingBalance])
  }
}

export default ValueCalculator
