var React = require('react')
import {Sankey} from 'react-vis'

class SankeyChartHolder extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    //TODO: cover with unit tests
    var data = this.props.person.getSankeyLifetimeFlowSummary()
    return (
      <Sankey nodes={data.nodes}
        links={data.links}
        width={400}
        height={400}
      />
    )
  }
}
export default SankeyChartHolder
