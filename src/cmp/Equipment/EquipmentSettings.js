import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {Modal} from 'cmp/Modal'

class EquipmentSettingsComponent extends Component {
  state = {
    isModalVisible: false,
  }

  render() {
    const props = this.props
    const state = this.state
    const equipmentContainer = document.getElementById('equipment_settings')
    const equipmentId = equipmentContainer.dataset.equipmentId

    if(!equipmentId) {
      return null
    }

    const equipment = props.planList[props.selectedPlanIndex].data.find(plan => plan.data.id === equipmentId)

    return equipment ? ReactDOM.createPortal(
      <div className="EquipmentSettings">

        <div>{equipment.type}</div>
        <button onClick={() => this.setState({isModalVisible: true})}>settings</button>

        <Modal
          isVisible={state.isModalVisible}
          onClose={() => this.setState({isModalVisible: false})}
        >
          <div>modal content...</div>
        </Modal>

      </div>,
      document.getElementById('equipment_settings'),
    ) : null
  }
}

EquipmentSettingsComponent.propTypes = {
  planList: PropTypes.array.isRequired,
  selectedPlanIndex: PropTypes.number.isRequired,
}

export const EquipmentSettings = connect(
  state => ({planList: state.planList})
)(EquipmentSettingsComponent)
