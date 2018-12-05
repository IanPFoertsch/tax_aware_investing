import Person from '../models/person'
import Constants from '../constants'

class PersonService {
  constructor(personData) {
    this.personData = personData
  }

  getInput(constant) {
    return this.personData[constant]
  }

  createEmploymentIncome(person) {
    const wages = this.getInput(Constants.WAGES_AND_COMPENSATION)
    const careerLength = this.getInput(Constants.CAREER_LENGTH)
    person.createEmploymentIncome(wages, 0, careerLength)
  }

  createPreTaxRetirementContributions(person) {
    const careerLength = this.getInput(Constants.CAREER_LENGTH)
    const iraContributions = this.getInput(Constants.TRADITIONAL_IRA_CONTRIBUTIONS)

    const _401kContributions = this.getInput(Constants.TRADITIONAL_401K_CONTRIBUTIONS)

    person.createTraditionalIRAContribution(iraContributions, 0, careerLength)
    person.createTraditional401kContribution(_401kContributions, 0, careerLength)
  }

  createRothRetirementContributions(person) {
    const contributions = this.getInput(Constants.ROTH_IRA_CONTRIBUTIONS)
    const _401kContributions = this.getInput(Constants.ROTH_401K_CONTRIBUTIONS)

    const careerLength = this.getInput(Constants.CAREER_LENGTH)
    person.createRothIRAContribution(contributions, 0, careerLength)
    person.createRoth401kContribution(_401kContributions, 0, careerLength)
  }

  createPreTaxBenefits(person) {
    // const benefits = this.getInput(Constants.PRE_TAX_BENEFITS)
    // const careerLength = this.getInput(Constants.CAREER_LENGTH)
    // person.createPreTaxBenefits(benefits, 0, careerLength)
  }

  buildPerson() {
    var person = new Person(
      this.getInput(Constants.AGE),
      this.getInput(Constants.CAREER_LENGTH),
      this.getInput(Constants.RETIREMENT_LENGTH)
    )
    // Tax deferred contributions
    // federal income tax
    // state income tax
    // whatever other taxes
    // flow remainder from wages and compensation to "net post tax income"
    // Roth Contributions
    // After-tax contributions
    // Expenses
    // Brokerage
    person.createWorkingPeriod({
      wagesAndCompensation: this.getInput(Constants.WAGES_AND_COMPENSATION),
      roth401kContributions: this.getInput(Constants.ROTH_401K_CONTRIBUTIONS),
      traditional401kContributions: this.getInput(Constants.TRADITIONAL_401K_CONTRIBUTIONS),
    })

    person.createSpendDownPeriod({
      retirementLength: this.getInput(Constants.RETIREMENT_LENGTH),
      retirementSpending: this.getInput(Constants.RETIREMENT_SPENDING)
    })
    // this.createEmploymentIncome(person)
    // this.createTaxableWithdrawals(person)
    // this.createPreTaxBenefits()
    //FICA EXEMPT HSA CONTRIBUTIONS
    //spend-down strategies
    //build person's working career and retirement period
    //build contributions to retirement accounts
    //calculate interest to accounts
    //build withdrawals from accounts
    //calculate taxes
    // person.createFederalInsuranceContributions()
    // this.createPreTaxRetirementContributions(person)
    // person.createFederalIncomeWithHolding()
    // this.createRothRetirementContributions(person)
    return person
  }
}


export default PersonService
