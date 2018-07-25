import React, {Component} from 'react'
import {connect} from 'react-redux'

import {uploadFile} from 'actions'

import {FileUpload} from 'cmp/FileUpload'

class UploaderPageComponent extends Component {
  render() {
    const props = this.props

    return (
      <div>
        <FileUpload
          onUpload={this.onUpload}
        />
        {props.fileList.map((file, index) => (
          <div key={index}>name: {file.name}, data length: {file.data.length}</div>
        ))}
      </div>
    )
  }

  onUpload = file => {
    this.props.uploadFile(file)
  }
}

export const UploaderPage = connect(
  state => state,
  dispatch => ({uploadFile: file => dispatch(uploadFile(file))}),
)(UploaderPageComponent)
