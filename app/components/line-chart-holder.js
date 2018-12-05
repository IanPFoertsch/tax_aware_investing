var React = require('react')
var LineChart = require('react-chartjs-2').Line

class LineChartHolder extends React.Component {
  constructor(props) {
    super(props)
    var defaultConfig = stackedLineChartConfig()
    this.chartReference = React.createRef()


    this.state = {
      data: defaultConfig.data,
      options: defaultConfig.options
    }
  }

  render() {
    //TODO: cover with unit tests
    var incomingData = this.props.person.getNetWorthData()
    var updateData = []
    var labels = Object.keys(incomingData)
    var currentChart = this.chartReference.current
    var currentLabels = []

    if (currentChart != null) {
      currentLabels = currentChart.props.data.datasets.reduce((memo, dataset) => {
        //filter out chartJS's metadata dataset
        if (dataset.label != undefined) {
          memo.push(dataset.label)
        }
        return memo
      }, [])
    }

    _.each(labels, (label) => {
      if (currentLabels.includes(label) && currentChart != null) {

        var series = _.find(currentChart.props.data.datasets, (set) => {
          return set.label === label
        })

        series.data =  incomingData[label]
        updateData.push(series)
      } else {
        var newData = {
          label: label,
          data: incomingData[label],
          fill: 'origin',
          backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16)
        }
        updateData.push(newData)
      }
    })

    return (
      <LineChart data={{ datasets: updateData, labels: labels} }
        options={this.state.options}
        width={300}
        height = {200}
        ref={this.chartReference}
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
