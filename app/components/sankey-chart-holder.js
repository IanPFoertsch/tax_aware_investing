var React = require('react')
import {Sankey} from 'react-vis'

class SankeyChartHolder extends React.Component {
  constructor(props) {
    super(props)
    this.nodes = [{name: 'a'}, {name: 'b'}, {name: 'c'}]
    this.links = [
      {source: 0, target: 1, value: 10},
      {source: 0, target: 2, value: 20},
      {source: 1, target: 2, value: 20}
    ]
  }

  render() {
    //TODO: cover with unit tests
    var data = this.props.person.getYearlyFlowData()


    return (
      <Sankey nodes={data.nodes}
        links={data.links}
        width={500}
        height={500}
      />
    )
  }
}
export default SankeyChartHolder
