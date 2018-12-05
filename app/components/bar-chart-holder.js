var React = require('react')
var BarChart = require('react-chartjs-2').Bar

class BarChartHolder extends React.Component {
  constructor(props) {
    super(props)
    var defaultConfig = stackedBarChartConfig()
    this.state = {
      data: defaultConfig.data,
      options: defaultConfig.options
    }
  }

  render() {
    return (
      <BarChart data={this.state.data}
        options={this.state.options}
        width={300}
        height = {200}
      />
    )
  }
}

function stackedBarChartConfig() {
  return {
    type: 'bar',
    data: { datasets: [{}] },
    options: { scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [{
        stacked: true
      }] }
    }
  }
}

export default BarChartHolder
