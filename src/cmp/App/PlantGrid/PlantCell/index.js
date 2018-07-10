import React, {Component} from 'react'
import PropTypes from 'prop-types'
import makeBem from 'bem-cx'

import {
  Equipment as CEquipment,
  NeighbourDirection,
  CellIndex,
} from 'api/classes'

import './PlantCell.css'
import {Equipment} from './Equipment'

const cn = makeBem('PlantCell')

export class PlantCell extends Component {
  render() {
    const props = this.props

    return (
      <div className={cn.mod({hasEquipment: !!props.equipment})}>
        {(props.equipment && props.emptyNeighbours.up) && (
          <div
            className={`${cn.el('control')} ${cn.el('up')}`}
            onClick={() => props.addEquipment(props.cellIndex, NeighbourDirection.UP)}
          >
            <i className="fas fa-angle-up"></i>
          </div>
        )}

        {props.equipment && (
          <div
            className={`${cn.el('control')} ${cn.el('remove')}`}
            onClick={() => props.removeEquipment(props.cellIndex)}
          >
            <i className="fas fa-trash-alt"></i>
          </div>
        )}

        {(props.equipment && props.emptyNeighbours.left) && (
          <div
            className={`${cn.el('control')} ${cn.el('left')}`}
            onClick={() => props.addEquipment(props.cellIndex, NeighbourDirection.LEFT)}
          >
            <i className="fas fa-angle-left"></i>
          </div>
        )}

        <div className={cn.el('equipment')}>
          {props.equipment && <Equipment type={props.equipment.type}/>}
        </div>

        {(props.equipment && props.emptyNeighbours.right) && (
          <div
            className={`${cn.el('control')} ${cn.el('right')}`}
            onClick={() => props.addEquipment(props.cellIndex, NeighbourDirection.RIGHT)}
          >
            <i className="fas fa-angle-right"></i>
          </div>
        )}

        {(props.equipment && props.emptyNeighbours.down) && (
          <div
            className={`${cn.el('control')} ${cn.el('down')}`}
            onClick={() => props.addEquipment(props.cellIndex, NeighbourDirection.DOWN)}
          >
            <i className="fas fa-angle-down"></i>
          </div>
        )}
      </div>
    )
  }
}

PlantCell.propTypes = {
  cellIndex: PropTypes.instanceOf(CellIndex).isRequired,
  emptyNeighbours: PropTypes.shape({
    up: PropTypes.bool.isRequired,
    right: PropTypes.bool.isRequired,
    down: PropTypes.bool.isRequired,
    left: PropTypes.bool.isRequired,
  }),
  addEquipment: PropTypes.func.isRequired,
  removeEquipment: PropTypes.func.isRequired,
  equipment: PropTypes.instanceOf(CEquipment),
}
