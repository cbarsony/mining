import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Papa from 'papaparse'

export class FileUpload extends Component {
  render() {
    return (
      <input type="file" onChange={this.onUpload}/>
    )
  }

  onUpload = e => {
    const file = e.target.files[0]
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result, file) => this.props.onUpload({
        name: file.name,
        data: result.data,
        fields: result.meta.fields,
      })
    })
  }
}

FileUpload.propTypes = {onUpload: PropTypes.func.isRequired}
