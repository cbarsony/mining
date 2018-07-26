import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'

import {uploadFile} from 'actions'

import {FileUpload} from 'cmp/FileUpload'

class UploaderPageComponent extends Component {
  state = {
    openedFileIndex: null,
  }

  render() {
    const props = this.props
    const state = this.state

    return (
      <div>
        <FileUpload
          onUpload={this.onUpload}
        />

        {props.fileList.map((file, fileIndex) => (
          <div key={fileIndex}>
            <div>file name: {file.name}</div>
            <div>
              <div>fields: </div>
              <div>
                {file.fields.map((field, index) => (
                  <div
                    key={index}
                    data-field-id={file.name + '.' + field}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('id', file.name + '.' + field)
                    }}
                  >{field}</div>
                ))}
              </div>
            </div>
            <div>
              <div onClick={() => this.setState({openedFileIndex: state.openedFileIndex !== null ? null : fileIndex})}>toggle first rows</div>
              {fileIndex === state.openedFileIndex && (
                <table>
                  <thead>
                  <tr>
                    {file.fields.map((field, index) => (
                      <th key={index}>{field}</th>
                    ))}
                  </tr>
                  </thead>
                  <tbody>
                  {_.range(5).map(i => (
                    <tr key={i}>
                      {file.fields.map((field, index) => (
                        <td key={index}>{file.data[i][field]}</td>
                      ))}
                    </tr>
                  ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ))}

        <div
          style={{width: 300, height: 200, background: 'blue'}}
          onDragOver={e => e.preventDefault()}
          onDrop={e => {
            debugger
          }}
        >drop here</div>

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
