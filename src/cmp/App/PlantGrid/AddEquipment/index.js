import React, {Component} from 'react'
import PropTypes from 'prop-types'
import makeBem from 'bem-cx'

import {EquipmentType} from 'api/classes'

import './AddEquipment.css'

const cn = makeBem('AddEquipment')

export class AddEquipment extends Component {
  state = {equipmentType: ''}

  render() {
    const props = this.props
    const state = this.state

    return (
      <form
        className={cn}
        onSubmit={e => e.preventDefault()}
      >
        <div>
          <input
            type="radio"
            name={EquipmentType.BIN}
            id={cn.el(EquipmentType.BIN)}
            checked={state.equipmentType === EquipmentType.BIN}
            onChange={this.onInputChange}
          />
          <label htmlFor={cn.el(EquipmentType.BIN)}>bin</label>
        </div>

        <div>
          <input
            type="radio"
            name={EquipmentType.BELT}
            id={cn.el(EquipmentType.BELT)}
            checked={state.equipmentType === EquipmentType.BELT}
            onChange={this.onInputChange}
          />
          <label htmlFor={cn.el(EquipmentType.BELT)}>belt</label>
        </div>

        <button
          onClick={() => props.addEquipment(state.equipmentType)}
          disabled={state.equipmentType === ''}
        >done</button>

      </form>
    )
  }

  onInputChange = e => {
    const name = e.target.name

    if(this.state.equipmentType === name) {
      this.setState({equipmentType: ''})
    }
    else {
      this.setState({equipmentType: e.target.name})
    }
  }
}

AddEquipment.propTypes = {addEquipment: PropTypes.func.isRequired}
