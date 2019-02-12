import PersonService from '../../app/services/person-service'
import Person from '../../app/models/person'
import Constants from '../../app/constants'

describe('PersonService', function() {
  var personData
  var service

  beforeEach(() => {
    personData = {}
    service = new PersonService(personData)
  })

  describe('getListenerInput', () => {
    var constant = 'SOME CONSTANT'
    var constantValue = 10

    beforeEach(() => {
      personData[constant] = constantValue
    })

    it('queries the listener with the constant', () => {

      expect(service.getInput(constant)).toEqual(constantValue)
    })
  })

  describe('buildPerson', () => {
    var ageValue = 30

    beforeEach(() => {
      personData[Constants.AGE] = ageValue
    })

    it('builds a person with the listeners age', () => {
      var person = service.buildPerson()
      expect(person.age).toEqual(ageValue)
    })

    describe('with employment', () => {
      var wages = 50000
      var careerLength
      var age = 30
      var retirementLength = 20
      var roth401kContributions = 2000
      var traditional401kContributions = 3000
      var retirementSpending = 10000

      beforeEach(() => {
        personData[Constants.WAGES_AND_COMPENSATION] = wages
        personData[Constants.CAREER_LENGTH] = careerLength
        personData[Constants.AGE] = age
        personData[Constants.RETIREMENT_LENGTH] = retirementLength
        personData[Constants.ROTH_401K_CONTRIBUTIONS] = roth401kContributions
        personData[Constants.TRADITIONAL_401K_CONTRIBUTIONS] = traditional401kContributions
        personData[Constants.RETIREMENT_SPENDING] = retirementSpending
      })

      it('creates a person with the specified age, career length and retirement length', () => {
        spyOn(Person.prototype, 'createEmploymentIncome')
        var person = service.buildPerson()
        expect(person.age).toEqual(age)
        expect(person.careerLength).toEqual(careerLength)
        expect(person.retirementLength).toEqual(retirementLength)
      })

      it('creates a working period with the specified wages and contributions', () => {
        spyOn(Person.prototype, 'createWorkingPeriod')
        service.buildPerson()
        expect(
          Person.prototype.createWorkingPeriod
        ).toHaveBeenCalledWith({
          wagesAndCompensation: wages,
          roth401kContributions: roth401kContributions,
          traditional401kContributions: traditional401kContributions
        })
      })

      it('creates a spend down period with the specified retirement spending', () => {
        spyOn(Person.prototype, 'createSpendDownPeriod')
        service.buildPerson()
        expect(
          Person.prototype.createSpendDownPeriod
        ).toHaveBeenCalledWith({
          retirementLength: retirementLength,
          retirementSpending: retirementSpending
        })
      })
    })
  })
})
