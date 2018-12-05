var React = require('react')

function InputRow(props) {
  return (
    <div className='input-row'>
      <label>{props.label}</label>
      <input
        type={props.type}
        defaultValue={props.default}
        name={props.label}
        onChange={props.onChange}>
      </input>
    </div>
  )
}

class InputTable extends React.Component {
  render() {
    var rows = this.props.rows
    var labels = Object.keys(rows)

    return (
      <div>
        <div>{'The Table'}</div>
        {
          labels.map((label, key) => {
            var row = rows[label]

            return <InputRow
              key={key}
              type={row.type}
              label={label}
              default={row.value}
              onChange={this.props.onChange}
            />
          })
        }
      </div>
    )
  }
}

export default InputTable
