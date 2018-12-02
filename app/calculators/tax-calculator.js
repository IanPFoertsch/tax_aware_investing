import Constants from '../constants'

class TaxCalculator {
  static federalIncomeTax(taxableIncome) {
    // console.trace()
    if (taxableIncome <= 0) {
      return 0
    }

    var remainingIncome = taxableIncome
    var previousBracket = 0
    //TODO: Refine this iterative approach to make it more maintainable
    var totalTax = _.reduce(Constants.FEDERAL_INCOME_BRACKETS, function(totalTax, rate, bracket) {
      var currentBracket = parseInt(bracket)
      var bracketMagnitude = currentBracket - previousBracket

      var affectedIncome = TaxCalculator.minimum(remainingIncome, bracketMagnitude)
      var taxesOwed = affectedIncome * rate

      totalTax += taxesOwed

      remainingIncome -= affectedIncome
      previousBracket = currentBracket

      return totalTax
    }, 0)
    return totalTax
  }

  static socialSecurityWithholding(income) {
    //TODO: Assume for now that the user is not self-employed
    var applicableIncome = TaxCalculator.minimum(income, Constants.SOCIAL_SECURITY_MAXIMUM)
    return applicableIncome * Constants.SOCIAL_SECURITY_RATE
  }

  static medicareWithholding(income) {
    //TODO: Assume for now that the user is not self-employed
    return income * Constants.MEDICARE_RATE
  }

  static netIncome(grossIncome, deductableContributions) {
    var medicaid = TaxCalculator.medicareWithholding(grossIncome)
    var socialSecurity = TaxCalculator.socialSecurityWithholding(grossIncome)

    var taxableIncome = TaxCalculator.lessDeductions(grossIncome, deductableContributions)
    var federalIncomeTax = TaxCalculator.federalIncomeTax(taxableIncome)

    return grossIncome - (medicaid + socialSecurity + federalIncomeTax + deductableContributions)
  }

  static minimum(first, second) {
    return Math.min.apply(Math, [first, second])
  }

  static numberToCurrencyString(number) {
    var currencyPrefix = '$'
    return currencyPrefix + number.toString()
  }
}



export default TaxCalculator
