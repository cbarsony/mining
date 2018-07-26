import React, {Component} from 'react'
import {connect} from 'react-redux'
import _ from 'lodash'
import makeBem from 'bem-cx'

import {uploadFile, updateEquipmentFile, updateUnit} from 'actions'
import {FileUpload} from 'cmp/FileUpload'
import {Tree, TreeNode, TreeLeaf} from 'cmp/Tree'

import './UploaderPage.css'

const cn = makeBem('UploadPage')

class UploaderPageComponent extends Component {
  state = {
    openedFileIndex: null,
  }

  render() {
    const props = this.props
    const state = this.state

    const plan = (
      <div className={cn.el('plan')}>
        {(!!props.plan && !!props.plan.length) && (
          <Tree>
            {props.plan.map((equipment, equipmentIndex) => (
              <TreeNode
                key={equipmentIndex}
                label={equipment.type + ` (${equipmentIndex + 1})`}
              >
                {equipment.userData.fields.map((field, fieldIndex) => (
                  <TreeLeaf key={fieldIndex}>
                    <div className={cn.el('equipment')}>
                      <span>{field.name}</span>
                      {field.file ? (
                        <span>
                          <span>file: {field.file.name}, field: {field.file.headerField}</span>
                          <select
                            value={field.selectedUnitIndex}
                            onChange={e => this.onUnitChange(e, equipmentIndex, fieldIndex)}
                          >
                            <option
                              style={{display: 'inline-block'}}
                              key={-1}
                              value={-1}>choose unit</option>
                            {field.units.map((unit, index) => (
                              <option key={index} value={index}>{unit}</option>
                            ))}
                          </select>
                        </span>
                      ) : (
                        <span
                          className={cn.el('dropZone')}
                          onDrop={e => this.onDrop(e, equipmentIndex, fieldIndex)}
                          onDragOver={e => e.preventDefault()}
                        >drop zone</span>
                      )}
                    </div>
                  </TreeLeaf>
                ))}
              </TreeNode>
            ))}
          </Tree>
        )}
      </div>
    )

    const fileUpload = (
      <div className={cn.el('fileUpload')}>
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
                      e.dataTransfer.setData('fileName', file.name)
                      e.dataTransfer.setData('field', field)
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

      </div>
    )

    return (
      <div className={cn}>
        {plan}
        {fileUpload}
      </div>
    )
  }

  onUpload = file => {
    this.props.uploadFile(file)
  }

  onDrop = (e, equipmentIndex, fieldIndex) => {
    const fileName = e.dataTransfer.getData('fileName')
    const headerField = e.dataTransfer.getData('field')
    this.props.updateEquipmentFile(equipmentIndex, fieldIndex, fileName, headerField)
  }

  onUnitChange = (e, equipmentIndex, fieldIndex) => {
    const unitIndex = Number(e.target.value)
    this.props.updateUnit(equipmentIndex, fieldIndex, unitIndex)
  }
}

export const UploaderPage = connect(
  state => state,
  dispatch => ({
    uploadFile: file => dispatch(uploadFile(file)),
    updateEquipmentFile: (equipmentIndex, fieldIndex, fileName, headerField) => dispatch(updateEquipmentFile(
      equipmentIndex,
      fieldIndex,
      fileName,
      headerField,
    )),
    updateUnit: (equipmentIndex, fieldIndex, unitIndex) => dispatch(updateUnit(
      equipmentIndex,
      fieldIndex,
      unitIndex,
    )),
  }),
)(UploaderPageComponent)
