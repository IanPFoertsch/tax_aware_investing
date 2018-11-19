var React = require('react')

function InputRow(props) {
  return (
    <div className='input-row'>
      <label>{props.label}</label>
      <input type={props.type} defaultValue={props.default} ></input>
    </div>
  )
}

class InputTable extends React.Component {
  render() {
    return (
      <div>
        <div>{'The Table'}</div>
        {
          this.props.rows.map((row, key) => {
            return <InputRow
              key={key}
              type={row.type}
              label={row.label}
              default={row.default}
            />
          })
        }
      </div>
    )
  }
}

export default InputTable
