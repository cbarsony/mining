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
        <h2>Equipments</h2>
        {(!!props.plan && !!props.plan.length) && (
          <Tree>
            {props.plan.map((equipment, equipmentIndex) => {
              if(equipment.type !== 'Bin' || equipment.type !== 'Belt') {
                return null
              }

              return (
                <TreeNode
                  key={equipmentIndex}
                  label={equipment.type + ` (${equipmentIndex + 1})`}
                >
                  <TreeLeaf>
                    <table className={cn.el('fields')}>
                      <tbody>
                      {equipment.userData.fields.map((field, fieldIndex) => (
                        <tr
                          key={fieldIndex}
                          className={cn.el('equipment')}
                        >
                          <td>{field.name}</td>
                          {field.file ? [
                            <td key="1">
                              <div>
                                <i className="far fa-file fa-fw"></i>
                                {field.file.name}
                              </div>
                              <div>
                                <i className="fas fa-database fa-fw"></i>
                                {field.file.headerField}
                              </div>
                            </td>,
                            <td key="2">
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
                            </td>,
                          ] : [
                            <td
                              key="1"
                              className={cn.el('dropZone')}
                              onDrop={e => this.onDrop(e, equipmentIndex, fieldIndex)}
                              onDragOver={e => e.preventDefault()}
                            >empty header field</td>,
                            <td key="2"></td>
                          ]}
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </TreeLeaf>
                </TreeNode>
              )
            })}
          </Tree>
        )}
        {props.plan && (
          <button
            style={{marginTop: '16px'}}
            onClick={() => console.log(props.plan)}
          >Save</button>
        )}
      </div>
    )

    const fileUpload = (
      <div className={cn.el('fileUpload')}>
        <h2>Uploaded files</h2>
        <FileUpload
          onUpload={this.onUpload}
        />

        {props.fileList.map((file, fileIndex) => (
          <div key={fileIndex}>
            <hr/>
            <div>
              <i className="far fa-file fa-fw"></i>
              {file.name}
            </div>
            <div>
              <div>
                {file.fields.map((field, index) => (
                  <div
                    key={index}
                    className={cn.el('draggable')}
                    data-field-id={file.name + '.' + field}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('fileName', file.name)
                      e.dataTransfer.setData('field', field)
                    }}
                  >
                    <i className="fas fa-grip-vertical"></i>
                    {field}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div
                className={cn.el('toggleRows')}
                onClick={() => this.setState({openedFileIndex: state.openedFileIndex === fileIndex ? null : fileIndex})}
              >
                {state.openedFileIndex === fileIndex ?
                  <i className="fas fa-angle-down fa-fw"></i> :
                  <i className="fas fa-angle-right fa-fw"></i>
                }
                {state.openedFileIndex === fileIndex ? 'hide first rows' : 'show first rows'}
              </div>
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
