
// function PersonListener(rows) {
//   this.listeners = _.reduce(rows, function(memo, config) {
//     if (config.type === 'number') {
//       memo[config.label] = new NumericInputListener(config)
//     } else {
//       memo[config.label] = new InputListener(config)
//     }
//     return memo
//   }, {})
// }

class PersonListener {
  //TODO: testme
  constructor() {
    this.inputs = {}
  }

  addInputElement(input) {
    this.inputs[input.name] = input
  }

  getInput(constant) {
    return this.listeners[constant].getInput()
  }

}
export default PersonListener
