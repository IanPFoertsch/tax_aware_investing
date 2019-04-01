class Constants {
  static get ROTH_IRA() { return 'Roth IRA'}
  static get TRADITIONAL_IRA() { return 'Traditional IRA' }
  static get TRADITIONAL_401K() { return'Traditional 401k' }
  static get ROTH_401K() { return'Roth 401k' }
  static get BROKERAGE() { return'Brokerage' }

  static get TRADITIONAL_IRA_CONTRIBUTIONS() { return'Traditional IRA Contributions' }
  static get ROTH_IRA_CONTRIBUTIONS() { return'Roth IRA Contributions' }

  static get TRADITIONAL_401K_CONTRIBUTIONS() { return'Traditional 401k Contributions' }
  static get ROTH_401K_CONTRIBUTIONS() { return'Roth 401k Contributions' }

  static get TRADITIONAL_WITHDRAWAL() { return 'Traditional Withdrawals' }
  static get ROTH_WITHDRAWAL() { return 'Roth Withdrawals' }

  static get WAGES_AND_COMPENSATION() { return 'Wages and Compensation' }
  static get CAREER_LENGTH() { return'Career Length' }
  static get RETIREMENT_LENGTH() { return'Retirement Length' }
  static get RETIREMENT_SPENDING() { return'Retirement Spending' }

  static get EMPLOYER() { return'Employer' }

  static get NET_INCOME() { return'Net Income' }
  static get ADJUSTED_GROSS_INCOME() { return'WAGES_AND_COMPENSATION' }
  static get MODIFIED_ADJUSTED_GROSS_INCOME() { return'WAGES_AND_COMPENSATION' }

  static get TAXABLE_INCOME() { return'Taxable Income' }
  static get POST_TAX_INCOME() { return'Post Tax Income' }
  static get TOTAL_INCOME() { return'Total Income' }
  static get FEDERAL_INCOME_TAX() { return'Federal Income Tax' }
  static get MEDICARE() { return'Medicare' }
  static get SOCIAL_SECURITY() { return'Social Security' }
  static get PRE_TAX_BENEFITS() { return'Pre Tax Benefits' }
  static get SOCIAL_SECURITY_WAGES() { return'Social Security Wages' }

  //TODO: Assume for now that the user is not self-employed
  static get MEDICARE_RATE() { return 0.0145 }
  static get SOCIAL_SECURITY_RATE() { return 0.062 }
  //TODO: update these values for 2018
  static get SOCIAL_SECURITY_MAXIMUM() { return 118500 }
  static get STANDARD_DEDUCTION() { return 12000 }

  static get DEFAULT_GROWTH_RATE() { return 0.03 }
  static get AGE() { return'Age' }

  static get FEDERAL_INCOME_BRACKETS() {
    return {
      '9275': 0.10,
      '37650': 0.15,
      '91150': 0.25,
      '190150': 0.28,
      '413350': 0.33,
      '415050': 0.35,
      '1000000000': 0.396
    }
  }
}

export default Constants
