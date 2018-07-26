import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import {Modal} from 'cmp/Modal'

export class EquipmentSettings extends Component {
  state = {
    isModalVisible: false,
  }

  render() {
    // const props = this.props
    const state = this.state

    return ReactDOM.createPortal(
      <div>
        <Modal
          isVisible={state.isModalVisible}
          onClose={() => this.setState({isModalVisible: false})}
        >
          <div>modal content...</div>
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
