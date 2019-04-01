var React = require('react')
var TestUtils = require('react-dom/test-utils')
import SankeyChartHolder from '../../app/components/sankey-chart-holder'

describe('SankeyChartHolder', function () {
  it('renders without problems', function () {
    var root = TestUtils.renderIntoDocument(<SankeyChartHolder/>)

  })
})
