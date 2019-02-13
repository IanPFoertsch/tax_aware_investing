import {NonAccumulatingAccount, TaxCategory, Expense} from '../../app/models/non-accumulating-account'
import AccumulatingAccount from '../../app/models/accumulating-account'
import _ from 'lodash'
import PersonDataAdapter from '../../app/adapters/person-data-adapter'
import TaxCalculator from '../../app/calculators/tax-calculator'
import WithdrawalCalculator from '../../app/calculators/withdrawal-calculator'
import Constants from '../../app/constants'
import Person from '../../app/models/person'
import CashFlow from '../../app/models/cash-flow'

describe('Person', function() {
  var person

  beforeEach(() => {
    person = new Person()
  })

  describe('timeIndices', () => {
    var account

    beforeEach(() => {
      person.createEmploymentIncome(1000, 0, 10)
      account = person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
    })

    it('queries the accounts for their timeIndices', () => {
      spyOn(account, 'timeIndices')
      person.timeIndices()
      expect(account.timeIndices).toHaveBeenCalledWith()
    })

    it('returns a list of time indexes from the longest account projection', () => {
      var indexes = person.timeIndices()
      expect(indexes).toEqual(account.timeIndices())
    })

    describe('with multiple account projection maximum times', () => {
      beforeEach(() => {
        person.createTraditionalIRAContribution(1000, 5, 17)
      })

      it('includes indexes stretching from the minimum to the maximum', () => {
        var indexes = person.timeIndices()

        expect(indexes).toEqual(
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
        )
      })
    })
  })

  var accountCreationAndMemoization = function(functionName, accountsIdentifier, clazz) {
    var accountType = 'SomeAccountType'

    it('creates an account if one does not exist', () => {
      expect(person[accountsIdentifier][accountType]).toEqual(undefined)
      person[functionName](accountType)
      expect(person[accountsIdentifier][accountType]).toEqual(jasmine.any(clazz))
    })

    it('uses the pre-existing account of that name if one exists', () => {
      var preExistingAccount = person[functionName](accountType)
      expect(person[functionName](accountType)).toBe(preExistingAccount)
    })
  }

  describe('getAccumulatingAccount', () => {
    accountCreationAndMemoization('getAccumulatingAccount', 'accounts', AccumulatingAccount)
  })

  describe('getThirdPartyAccount', () => {
    accountCreationAndMemoization('getThirdPartyAccount', 'thirdPartyAccounts', NonAccumulatingAccount)
  })

  describe('getTaxCategory', () => {
    accountCreationAndMemoization('getTaxCategory', 'taxCategories', TaxCategory)
  })

  describe('getExpense', () => {
    accountCreationAndMemoization('getExpense', 'expenses', Expense)
  })

  describe('createFlows delegator methods', () => {
    var value = 10000
    var startYear = 0
    var endYear = 30

    var expectCreateFlowsDelegationFromMethod = function(
      functionName,
      sourceClazz,
      sourceMethod,
      sourceConstant,
      targetClazz,
      targetMethod,
      targetConstant
    ) {

      beforeEach(() => {
        // updateService.getUpdate = jasmine.createSpy().and.returnValue(etc)
        person.createFlows = jasmine.createSpy()
        // spyOn(person, 'createFlows')
      })

      it('should call createFlows with the expected arguments and account types', () => {
        person[functionName](value, startYear, endYear)

        expect(
          person.createFlows
        ).toHaveBeenCalledWith(
          value,
          startYear,
          endYear,
          jasmine.any(sourceClazz),
          jasmine.any(targetClazz)
        )
      })

      describe('find or create account method', () => {
        beforeEach(() => {
          spyOn(person, sourceMethod)
          if (sourceMethod != targetMethod) {
            spyOn(person, targetMethod)
          }
        })

        it('should call the source account method with the expected constant', () => {
          person[functionName](value, startYear, endYear)

          expect(
            person[sourceMethod]
          ).toHaveBeenCalledWith(sourceConstant)
        })

        it('should call the target account method with the expected constant', () => {
          person[functionName](value, startYear, endYear)

          expect(
            person[targetMethod]
          ).toHaveBeenCalledWith(targetConstant)
        })
      })
    }

    describe('createTraditionalWithdrawal', () => {
      expectCreateFlowsDelegationFromMethod(
        'createTraditionalWithdrawal',
        AccumulatingAccount,
        'getAccumulatingAccount',
        Constants.TRADITIONAL_401K,
        TaxCategory,
        'getTaxCategory',
        Constants.TRADITIONAL_WITHDRAWAL
      )

      expectCreateFlowsDelegationFromMethod(
        'createTraditionalWithdrawal',
        TaxCategory,
        'getTaxCategory',
        Constants.TRADITIONAL_WITHDRAWAL,
        TaxCategory,
        'getTaxCategory',
        Constants.TOTAL_INCOME
      )
    })

    describe('createRothWithdrawal', () => {
      expectCreateFlowsDelegationFromMethod(
        'createRothWithdrawal',
        AccumulatingAccount,
        'getAccumulatingAccount',
        Constants.ROTH_401K,
        TaxCategory,
        'getTaxCategory',
        Constants.ROTH_WITHDRAWALS
      )

      expectCreateFlowsDelegationFromMethod(
        'createRothWithdrawal',
        TaxCategory,
        'getTaxCategory',
        Constants.ROTH_WITHDRAWALS,
        TaxCategory,
        'getTaxCategory',
        Constants.TOTAL_INCOME
      )
    })

    describe('createEmploymentIncome', () => {
      expectCreateFlowsDelegationFromMethod(
        'createEmploymentIncome',
        NonAccumulatingAccount,
        'getThirdPartyAccount',
        Constants.EMPLOYER,
        TaxCategory,
        'getTaxCategory',
        Constants.WAGES_AND_COMPENSATION
      )

      expectCreateFlowsDelegationFromMethod(
        'createEmploymentIncome',
        TaxCategory,
        'getTaxCategory',
        Constants.WAGES_AND_COMPENSATION,
        TaxCategory,
        'getTaxCategory',
        Constants.TOTAL_INCOME
      )
    })

    describe('createTraditionalIRAContribution', () => {
      expectCreateFlowsDelegationFromMethod(
        'createTraditionalIRAContribution',
        TaxCategory,
        'getTaxCategory',
        Constants.WAGES_AND_COMPENSATION,
        AccumulatingAccount,
        'getAccumulatingAccount',
        Constants.TRADITIONAL_IRA
      )
    })

    describe('createRothIRAContribution', () => {
      expectCreateFlowsDelegationFromMethod(
        'createRothIRAContribution',
        TaxCategory,
        'getTaxCategory',
        Constants.POST_TAX_INCOME,
        AccumulatingAccount,
        'getAccumulatingAccount',
        Constants.ROTH_IRA
      )
    })

    describe('createTraditional401kContribution', () => {
      expectCreateFlowsDelegationFromMethod(
        'createTraditional401kContribution',
        TaxCategory,
        'getTaxCategory',
        Constants.WAGES_AND_COMPENSATION,
        AccumulatingAccount,
        'getAccumulatingAccount',
        Constants.TRADITIONAL_401K
      )
    })

    describe('createRoth401kContribution', () => {
      expectCreateFlowsDelegationFromMethod(
        'createRoth401kContribution',
        TaxCategory,
        'getTaxCategory',
        Constants.POST_TAX_INCOME,
        AccumulatingAccount,
        'getAccumulatingAccount',
        Constants.ROTH_401K
      )
    })

    describe('createMedicareContributions', () => {
      expectCreateFlowsDelegationFromMethod(
        'createMedicareContributions',
        TaxCategory,
        'getTaxCategory',
        Constants.WAGES_AND_COMPENSATION,
        Expense,
        'getExpense',
        Constants.MEDICARE
      )
    })

    describe('createFederalIncomeTaxFlows', () => {
      expectCreateFlowsDelegationFromMethod(
        'createFederalIncomeTaxFlows',
        TaxCategory,
        'getTaxCategory',
        Constants.TOTAL_INCOME,
        Expense,
        'getExpense',
        Constants.FEDERAL_INCOME_TAX
      )
    })

    describe('createPreTaxBenefits', () => {
      expectCreateFlowsDelegationFromMethod(
        'createPreTaxBenefits',
        TaxCategory,
        'getTaxCategory',
        Constants.WAGES_AND_COMPENSATION,
        Expense,
        'getExpense',
        Constants.PRE_TAX_BENEFITS
      )
    })
  })

  var setupExpenseContribution = function(functionName, expenseIdentifier, expectedExpense, maxTime) {
    it('creates in income tax contribution for each year with income', () => {
      person[functionName]()

      var expense = person.getExpense(expenseIdentifier)

      _.forEach(_.range(0, maxTime + 1), (index) => {
        var contribution = expense.contributions[index][0]
        expect(contribution.value).toEqual(expectedExpense)
      })
    })
  }

  var createsFlowsForEachYearOfIncome = function(methodUnderTest, flowMethod, maxTime, testAmount) {
    it('creates a flow for each year of income', () => {
      spyOn(person, flowMethod)
      person[methodUnderTest]()
      _.forEach(_.range(0, maxTime + 1), (index) => {
        expect(person[flowMethod]).toHaveBeenCalledWith(testAmount, index, index)
      })
    })
  }

  describe('taxableIncomeForIndex', () => {
    //TODO: Fill in with test cases
  })

  describe('createFederalIncomeWithHolding', () => {
    var maxTime = 10
    var federalIncomeTax = 20000
    let traditionalWithdrawals = new TaxCategory(Constants.TRADITIONAL_WITHDRAWAL)
    let wagesAndCompensation = new TaxCategory(Constants.WAGES_AND_COMPENSATION)
    let totalIncomeAccount = new TaxCategory(Constants.TOTAL_INCOME)
    let traditional401k = new AccumulatingAccount(Constants.TRADITIONAL_401K)

    let traditionalWithdrawalIncome = 10000
    let wagesAndCompensationIncome = 20000
    let traditional401kWithdrawal = 5000

    let taxCategories = {
      [Constants.WAGES_AND_COMPENSATION]: wagesAndCompensation,
      [Constants.TRADITIONAL_WITHDRAWAL]: traditionalWithdrawals,
      [Constants.TOTAL_INCOME]: totalIncomeAccount
    }

    let deductions = {
      [Constants.TRADITIONAL_401K]: traditional401k,
    }

    beforeEach(()=> {
      spyOn(TaxCalculator, 'federalIncomeTax').and.returnValue(federalIncomeTax)
      spyOn(traditionalWithdrawals, 'getInFlowValueAtTime').and.returnValue(traditionalWithdrawalIncome)
      spyOn(wagesAndCompensation, 'getInFlowValueAtTime').and.returnValue(wagesAndCompensationIncome)
      spyOn(traditional401k, 'getInFlowValueAtTime').and.returnValue(traditional401kWithdrawal)
      spyOn(person, 'getTaxCategory')
        .and
        .callFake((arg) => {
          return taxCategories[arg]
        })
      spyOn(person, 'getAccumulatingAccount')
        .and
        .callFake((arg) => {
          return deductions[arg]
        })
    })

    describe('for a single year', () => {
      var timeIndex = 0
      it('calculates the total income by querying the incoming accounts', () => {
        person.createFederalIncomeWithHolding(timeIndex, timeIndex)
        expect(wagesAndCompensation.getInFlowValueAtTime).toHaveBeenCalledWith(timeIndex)
        expect(traditionalWithdrawals.getInFlowValueAtTime).toHaveBeenCalledWith(timeIndex)
        expect(TaxCalculator.federalIncomeTax).toHaveBeenCalledWith(
          (wagesAndCompensationIncome + traditionalWithdrawalIncome) -
          (traditional401kWithdrawal + Constants.STANDARD_DEDUCTION)
        )
        var federalIncomeTaxAccount = person.getExpense(Constants.FEDERAL_INCOME_TAX)
        expect(federalIncomeTaxAccount.getInFlowValueAtTime(timeIndex)).toEqual(federalIncomeTax)
      })
    })

    describe('for multiple years', () => {
      it('creates in income tax contribution for each specified year', () => {
        person.createFederalIncomeWithHolding(0, maxTime)

        var expense = person.getExpense(Constants.FEDERAL_INCOME_TAX)

        _.forEach(_.range(0, maxTime + 1), (index) => {
          var contribution = expense.contributions[index][0]

          expect(contribution.value).toEqual(federalIncomeTax)
        })
      })
    })
  })

  describe('createFederalInsuranceContributions', () => {
    var income = 100000
    var maxTime = 10
    var medicareWithholding = 5000
    var socialSecurityWithholding = 6000

    var calculatesWithholdingFromWagesMinusBenefits = function(functionName, taxCategoryName, delegatedMethod) {
      it('delegates to the tax calculator based on the incoming value of wages minus pre-tax benefits', () => {
        var wagesInflow = 99999
        var benefitsOutflow = 11111

        var wagesAccount = person.getTaxCategory(taxCategoryName)
        var benefitsAccount = person.getExpense(Constants.PRE_TAX_BENEFITS)

        spyOn(wagesAccount, 'getInFlowValueAtTime').and.returnValue(wagesInflow)
        spyOn(benefitsAccount, 'getInFlowValueAtTime').and.returnValue(benefitsOutflow)

        person[functionName]()

        expect(TaxCalculator[delegatedMethod]).toHaveBeenCalledWith(wagesInflow - benefitsOutflow)
      })
    }

    beforeEach(()=> {
      person.createEmploymentIncome(income, 0, maxTime)
      spyOn(TaxCalculator, 'medicareWithholding').and.returnValue(medicareWithholding)
      spyOn(TaxCalculator, 'socialSecurityWithholding').and.returnValue(socialSecurityWithholding)
    })

    calculatesWithholdingFromWagesMinusBenefits(
      'createFederalInsuranceContributions',
      Constants.WAGES_AND_COMPENSATION,
      'medicareWithholding'
    )

    calculatesWithholdingFromWagesMinusBenefits(
      'createFederalInsuranceContributions',
      Constants.WAGES_AND_COMPENSATION,
      'socialSecurityWithholding'
    )

    setupExpenseContribution(
      'createFederalInsuranceContributions',
      Constants.MEDICARE,
      medicareWithholding,
      maxTime
    )

    setupExpenseContribution(
      'createFederalInsuranceContributions',
      Constants.SOCIAL_SECURITY,
      socialSecurityWithholding,
      maxTime
    )

    createsFlowsForEachYearOfIncome(
      'createFederalInsuranceContributions',
      'createMedicareContributions',
      maxTime,
      medicareWithholding
    )

    createsFlowsForEachYearOfIncome(
      'createFederalInsuranceContributions',
      'createSocialSecurityContributions',
      maxTime,
      socialSecurityWithholding
    )
  })

  describe('createWorkingPeriod', () => {

  })

  describe('createFlows', () => {
    var start = 0
    var end
    var value = 100

    it('should register a flow from the source to the target', () => {
      end = 0
      person.createFlows(
        value,
        start,
        end,
        person.getThirdPartyAccount(Constants.EMPLOYER),
        person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
      )

      var account = person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
      var cashFlow = account.contributions[start][0]
      expect(cashFlow).toEqual(jasmine.any(CashFlow))
      expect(cashFlow.getValue()).toEqual(value)
    })

    it('should register flows for each requested time period', () => {
      end = 2
      person.createFlows(
        value,
        start,
        end,
        person.getThirdPartyAccount(Constants.EMPLOYER),
        person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
      )

      var account = person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
      _.forEach(_.range(start, end + 1), (time) => {
        var cashFlow = account.contributions[time][0]
        expect(cashFlow).toEqual(jasmine.any(CashFlow))
        expect(cashFlow.getValue()).toEqual(value)
      })
    })

    describe('for years starting not at 0', () => {
      it('should begin the flows at the specified start year', () => {
        start = 10
        end = 20
        person.createFlows(
          value,
          start,
          end,
          person.getThirdPartyAccount(Constants.EMPLOYER),
          person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
        )

        var account = person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
        var keys = Object.keys(account.contributions)

        expect(parseInt(keys[0])).toEqual(start)
        expect(parseInt(keys[10])).toEqual(end)
      })
    })
  })

  describe('getAccountFlowBalanceByTime', () => {
    var value = 10000
    var start = 0
    var end = 10
    beforeEach(() => {
      person.createEmploymentIncome(value, start, end)
      person.createFederalInsuranceContributions()
    })

    it('queries the PersonDataAdapter for the flowBalanceByTimeData with the accumulating accounts and expenses', () =>{
      spyOn(PersonDataAdapter, 'flowBalanceByTimeData')
      person.getAccountFlowBalanceByTime()
      var graphableAccounts = _.assign({}, person.accounts, person.expenses)
      expect(PersonDataAdapter.flowBalanceByTimeData).toHaveBeenCalledWith(graphableAccounts, end)
    })
  })

  describe('getNetWorthData', () => {
    let timeIndices
    let accounts
    beforeEach(() => {
      timeIndices = [0, 1, 2, 3]
      accounts = {}
      spyOn(PersonDataAdapter, 'lineChartData')
      spyOn(person, 'timeIndices').and.returnValue(timeIndices)
    })

    it('queries the time indices', () => {
      person.getNetWorthData()
      expect(person.timeIndices).toHaveBeenCalledWith()
    })

    it('queries the PersonDataAdapter', () => {
      person.accounts = accounts
      person.getNetWorthData()
      expect(PersonDataAdapter.lineChartData).toHaveBeenCalledWith(accounts, 3)
    })
  })

  describe('createSpendDownPeriod', () => {
    let buildAccountValues = function(age, workingPeriod, retirementLength, value) {
      return _.reduce(_.range(age + workingPeriod, retirementLength), (accumulator, index) => {
        accumulator[index + 1] = value
        return accumulator
      }, {})
    }

    let createTestCase = function(
      age,
      workingPeriod,
      retirementLength,
      retirementSpending,
      traditional401kValue,
      roth401kValue,
      expectedTraditionalSpending,
      expectedRothSpending
    ) {
      beforeEach(()=> {
        constructSpies(
          age,
          workingPeriod,
          retirementLength,
          traditional401kValue,
          roth401kValue
        )
      })

      it('withdraws the expected funds', () => {
        person.createSpendDownPeriod({
          retirementSpending: retirementSpending,
          retirementLength: retirementLength
        })
        createsTraditionalWithdrawal(expectedTraditionalSpending)
        createsRothWithdrawal(expectedRothSpending)
      })
    }

    let createsTraditionalWithdrawal = function(expectedSpending) {
      expect(
        person.createTraditionalWithdrawal.calls.allArgs()
      ).toEqual([
        [expectedSpending, 1, 1],
        [expectedSpending, 2, 2],
        [expectedSpending, 3, 3],
        [expectedSpending, 4, 4],
        [expectedSpending, 5, 5]
      ])
    }

    let createsRothWithdrawal = function(expectedSpending) {
      expect(
        person.createRothWithdrawal.calls.allArgs()
      ).toEqual([
        [expectedSpending, 1, 1],
        [expectedSpending, 2, 2],
        [expectedSpending, 3, 3],
        [expectedSpending, 4, 4],
        [expectedSpending, 5, 5]
      ])
    }

    let constructSpies = function(
      age,
      workingPeriod,
      retirementLength,
      traditional401kValue,
      roth401kValue
    ) {
      var traditional401kValues = buildAccountValues(
        age,
        workingPeriod,
        retirementLength,
        traditional401kValue
      )
      var roth401kValues = buildAccountValues(
        age,
        workingPeriod,
        retirementLength,
        roth401kValue
      )

      spyOn(person, 'getAccumulatingAccount')
        .and
        .callFake((arg) => {
          return accumulatingAccounts[arg]
        })

      spyOn(traditional401k, 'getValueAtTime')
        .and
        .callFake((index) => {
          return traditional401kValues[index]
        })

      spyOn(roth401k, 'getValueAtTime')
        .and
        .callFake((index) => {
          return roth401kValues[index]
        })
    }
    let retirementSpending
    let age = 0
    let workingPeriod = 0
    let retirementLength = 5
    let traditional401k = new AccumulatingAccount(Constants.TRADITIONAL_401K)
    let roth401k = new AccumulatingAccount(Constants.ROTH_401K)
    let traditional401kValue
    let roth401kValue
    let accumulatingAccounts = {
      [Constants.TRADITIONAL_401K]: traditional401k,
      [Constants.ROTH_401K]: roth401k
    }

    beforeEach(() => {
      person = new Person(age, workingPeriod, retirementLength)
      spyOn(person, 'createTraditionalWithdrawal')
      spyOn(person, 'createRothWithdrawal')
    })

    it('subtracts the total income from the spending goal when calculating retirement account withdrawals', () => {

    })

    describe('with available traditional funds', () => {
      it('accounts for federal income tax withholding when calculating the withdrawal from traditional funds', () => {

      })

      describe('and a spending goal less than the standard deduction', () => {
        let traditional401kValue = 11000

        beforeEach(() => {
          constructSpies(
            age,
            workingPeriod,
            retirementLength,
            traditional401kValue,
            0
          )
        })

        describe('and less than the available funds', () => {
          beforeEach(()=> {
            retirementSpending = traditional401kValue - 1000
          })

          it('creates a traditional funds withdrawal up to the available spending goal', () => {
            person.createSpendDownPeriod({
              retirementSpending: retirementSpending,
              retirementLength: retirementLength
            })

            createsTraditionalWithdrawal(retirementSpending)
          })
        })

        describe('but more than the available traditional funds', () => {
          beforeEach(()=> {
            retirementSpending = traditional401kValue + 1000
          })

          it('creates a traditional funds withdrawal up to the available traditional funds', () => {
            person.createSpendDownPeriod({
              retirementSpending: retirementSpending,
              retirementLength: retirementLength
            })

            createsTraditionalWithdrawal(traditional401kValue)
          })
        })
      })


      describe('with a spending goal more than the standard deduction', () => {
        beforeEach(()=> {
          traditional401kValue = Constants.STANDARD_DEDUCTION + 2000
        })

        describe('and more than the available traditional funds', () => {
          beforeEach(()=> {
            retirementSpending = traditional401kValue + 1000

            constructSpies(
              age,
              workingPeriod,
              retirementLength,
              traditional401kValue,
              0
            )
          })

          it('a creates a traditional funds withdrawal up to the available traditional funds', () => {
            person.createSpendDownPeriod({
              retirementSpending: retirementSpending,
              retirementLength: retirementLength
            })

            createsTraditionalWithdrawal(traditional401kValue)
          })
        })

        describe('and less than the available traditional funds', () => {
          let traditionalWithdrawalsToGoal

          beforeEach(()=> {
            retirementSpending = traditional401kValue - 1000
            traditionalWithdrawalsToGoal = traditional401kValue - Constants.STANDARD_DEDUCTION - 500

            constructSpies(
              age,
              workingPeriod,
              retirementLength,
              traditional401kValue,
              0
            )

            spyOn(WithdrawalCalculator, 'proportionalWithdrawals')
              .and
              .returnValue(retirementSpending - Constants.STANDARD_DEDUCTION)

            spyOn(WithdrawalCalculator, 'traditionalWithdrawalsToGoal')
              .and
              .returnValue(traditionalWithdrawalsToGoal)
          })

          it('queries the withdrawal calculator and creates a withdrawal accounting for income tax', () => {
            person.createSpendDownPeriod({
              retirementSpending: retirementSpending,
              retirementLength: retirementLength
            })

            createsTraditionalWithdrawal(Constants.STANDARD_DEDUCTION + traditionalWithdrawalsToGoal)
          })
        })
      })

      describe('and available roth funds', () => {
        describe('when the spending goal is less than the standard deduction', () => {
          describe('and the available traditional funds are less than the spending goal', () => {
            var traditionalWithdrawalsToGoal

            beforeEach(()=> {
              traditionalWithdrawalsToGoal = 4000

              spyOn(WithdrawalCalculator, 'traditionalWithdrawalsToGoal').and.returnValue(traditionalWithdrawalsToGoal)
              spyOn(person, 'taxableIncomeForIndex').and.returnValue(0)
            })

            describe('and the roth balance exceeds the income gap', () => {
              beforeEach(()=> {
                retirementSpending = 10000
                traditional401kValue = 4000
                roth401kValue = 7000

                constructSpies(
                  age,
                  workingPeriod,
                  retirementLength,
                  traditional401kValue,
                  roth401kValue
                )
              })

              it('withdraws up to the available balance from traditional funds', () => {
                person.createSpendDownPeriod({
                  retirementSpending: retirementSpending,
                  retirementLength: retirementLength
                })

                createsTraditionalWithdrawal(traditional401kValue)
              })

              it('withdraws from roth to fill the remaining spending goal', () => {
                person.createSpendDownPeriod({
                  retirementSpending: retirementSpending,
                  retirementLength: retirementLength
                })

                createsRothWithdrawal(retirementSpending - traditional401kValue)
              })
            })

            describe('and the roth balance is insufficient to fill the gap', () => {

              beforeEach(()=> {
                retirementSpending = 10000
                traditional401kValue = 4000
                roth401kValue = 5000
                traditionalWithdrawalsToGoal = traditional401kValue

                constructSpies(
                  age,
                  workingPeriod,
                  retirementLength,
                  traditional401kValue,
                  roth401kValue
                )
              })

              it('withdraws from traditional funds to fill the gap', () => {
                person.createSpendDownPeriod({
                  retirementSpending: retirementSpending,
                  retirementLength: retirementLength
                })

                createsTraditionalWithdrawal(traditional401kValue)
              })

              it('withdraws up to the available roth funds', () => {
                person.createSpendDownPeriod({
                  retirementSpending: retirementSpending,
                  retirementLength: retirementLength
                })

                createsRothWithdrawal(roth401kValue)
              })
            })
          })
        })

        describe('and the spending goal is more than the standard deduction', () => {
          describe('and there are sufficient funds to meet the spending goal', () => {
            describe('and traditional funds exceed the standard deduction ', () => {
              var federalIncomeTax
              var traditionalTaxableIncome
              beforeEach(()=> {
                retirementSpending = Constants.STANDARD_DEDUCTION + 4000
                traditional401kValue = retirementSpending
                roth401kValue = retirementSpending

                traditionalTaxableIncome = 900
                federalIncomeTax = 100

                constructSpies(
                  age,
                  workingPeriod,
                  retirementLength,
                  traditional401kValue,
                  roth401kValue
                )

                spyOn(person, 'taxableIncomeForIndex').and.returnValues(0, traditionalTaxableIncome, 0, traditionalTaxableIncome, 0, traditionalTaxableIncome, 0, traditionalTaxableIncome, 0, traditionalTaxableIncome)
                spyOn(TaxCalculator, 'federalIncomeTax').and.returnValue(federalIncomeTax)
                spyOn(WithdrawalCalculator, 'traditionalWithdrawalsToGoal').and.returnValue(traditionalTaxableIncome)
              })

              it('withdraws up to standard deduction from traditional funds, and the divides the remainder from both basis types', () => {
                person.createSpendDownPeriod({
                  retirementSpending: retirementSpending,
                  retirementLength: retirementLength
                })

                //magic numbers representing spending up to the standard deduction from
                //traditional funds, then withdrawing proportionally between roth and traditional
                let traditionalSpending = 12900
                let rothSpending = 3200

                createsTraditionalWithdrawal(traditionalSpending)
                createsRothWithdrawal(rothSpending)
              })
            })

            describe('and traditional funds do not exceed the standard deduction', () => {
              describe('and are insufficent to split proportionally', () => {
                beforeEach(()=> {
                  retirementSpending = Constants.STANDARD_DEDUCTION + 500
                  traditional401kValue = 7000
                  roth401kValue = retirementSpending

                  constructSpies(
                    age,
                    workingPeriod,
                    retirementLength,
                    traditional401kValue,
                    roth401kValue
                  )
                })

                it('withdraws the maximum traditional funds available and uses roth funds to fill the remainder', () => {
                  person.createSpendDownPeriod({
                    retirementSpending: retirementSpending,
                    retirementLength: retirementLength
                  })

                  createsTraditionalWithdrawal(traditional401kValue)
                  createsRothWithdrawal(retirementSpending - traditional401kValue)
                })
              })
            })
          })

          describe('and there are insufficient total funds to meet the goal', () => {
            describe('it withdraws the maximum available from each basis type', () => {
              retirementSpending = Constants.STANDARD_DEDUCTION + 10000
              traditional401kValue = 13000
              roth401kValue = 6000
              createTestCase(
                age,
                workingPeriod,
                retirementLength,
                retirementSpending,
                traditional401kValue,
                roth401kValue,
                traditional401kValue,
                roth401kValue
              )
            })
          })
        })
      })
    })
  })
})
