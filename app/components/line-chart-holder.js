var React = require('react')
var LineChart = require('react-chartjs-2').Line

class LineChartHolder extends React.Component {
  constructor(props) {
    super(props)
    var defaultConfig = stackedLineChartConfig()
    this.state = {
      data: defaultConfig.data,
      options: defaultConfig.options
    }
  }

  render() {
    return (
      <LineChart data={this.state.data}
        options={this.state.options}
        width={300}
        height = {200}
      />
    )
  }
}

function stackedLineChartConfig() {
  return {
    type: 'line',
    data: { datasets: []},
    options: {
      scales: {
        xAxes: [{
          type: 'linear',
          position: 'bottom'
        }],
        yAxes: [{
          stacked: true,
        }]
      }
    }
  }
}

export default LineChartHolder
