import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import update from 'immutability-helper'

import {Modal} from 'cmp/Modal'

export class EquipmentSettings extends Component {
  state = {
    isModalVisible: false,
    isAddFileVisible: false,
    connectedFileList: [],
    fieldList: this.props.equipment._fields.map(field => {
      return {
        name: field.name,
        file: null,
        fileField: null,
        unit: null,
      }
    })
  }

  render() {
    const props = this.props
    const state = this.state

    return ReactDOM.createPortal(
      <div>
        <Modal
          isVisible={state.isModalVisible}
          onClose={() => this.setState({isModalVisible: false})}
        >
          <form onSubmit={e => e.preventDefault()}>
            <div>
              <label htmlFor="equipmentId">name</label>
              <input type="text" id="equipmentId"/>
            </div>
            {state.fieldList.map((field, index) => (
              <div key={index}>
                <span>{field.name}</span>
              </div>
            ))}
            <hr/>
            <div>
              <select
                onChange={e => {
                  const selectedFile = props.fileList[Number(e.target.value)]

                  this.setState(state => update(state, {
                    connectedFileList: {
                      $push: [selectedFile],
                    },
                  }))
                }}
              >
                <option
                  key={-1}
                >choose a file</option>
                {props.fileList.map((file, index) => (
                  <option
                    key={index}
                    value={index}
                  >{file.name}</option>
                ))}
              </select>
            </div>
              {state.connectedFileList.map((file, index) => (
                <div key={index}>{file.name}</div>
              ))}
            <div>
              <button>Save</button>
            </div>
          </form>
        </Modal>
        <button onClick={() => this.setState({isModalVisible: true})}>settings</button>
      </div>,
      document.getElementById('my_overlay'),
    )
  }
}

EquipmentSettings.propTypes = {
  fileList: PropTypes.array.isRequired,
  equipment: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
}
