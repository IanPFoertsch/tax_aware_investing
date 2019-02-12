import _ from '../../node_modules/lodash/lodash.js'

class AccountDataAdapter {
  static accountValueData(account, maxTime) {
    //line chart conversion
    //  [ {x:0 y:val}, {x:index y:val}, ... ],
    return _.reduce(_.range(0, maxTime + 1), (memo, timeIndex) => {
      var value = account.getValueAtTime(timeIndex)
      memo.push({ x: timeIndex,  y: value })
      return memo
    }, [])
  }
}

export default AccountDataAdapter
