import React, {Component} from 'react'
import _ from 'lodash'
import makeBem from 'bem-cx'
import update from 'immutability-helper'

import {
  Equipment,
  EquipmentType,
  PlantCell as CPlantCell,
  CellIndex,
  NeighbourDirection,
} from 'api/classes'
import {Modal} from 'cmp/App/Modal'

import {PlantCell} from './PlantCell'
import {AddEquipment} from './AddEquipment'
import './PlantGrid.css'

const cn = makeBem('PlantGrid')

const rows = _.range(3).map(y => _.range(4).map(x => new CPlantCell(new CellIndex(x, y))))

rows[1][1].equipment = new Equipment(EquipmentType.BELT)
rows[1][2].equipment = new Equipment(EquipmentType.BIN)

export class PlantGrid extends Component {
  state = {
    rows,
    isAddEquipmentModalVisible: false,
    cellIndexToAddEquipment: null,
  }

  render() {
    const state = this.state

    return (
      <div className={cn}>
        <Modal
          isVisible={state.isAddEquipmentModalVisible}
          onClose={() => this.setState({
            isAddEquipmentModalVisible: false,
            cellIndexToAddEquipment: null,
          })}
        >
          <AddEquipment addEquipment={type => {
            console.log(type)
          }}/>
        </Modal>
        {state.rows.map((row, y) => (
          <div
            key={y}
            data-row-index={y}
            className={cn.el('row')}
          >
            {row.map((cell, x) => {
              const cellIndex = new CellIndex(x, y)

              return (
                <div
                  key={x}
                  data-cell-index={x}
                  className={cn.el('cell')}
                >
                  <PlantCell
                    cellIndex={cellIndex}
                    emptyNeighbours={this._getEmptyNeighbours(cellIndex)}
                    equipment={cell.equipment}
                    addEquipment={this.onAddEquipment}
                    removeEquipment={this.onRemoveEquipment}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  /* Actions */

  onAddEquipment = (cellIndex, direction) => {
    let cellIndexToAddEquipment

    if(direction === NeighbourDirection.UP) {
      cellIndexToAddEquipment = update(cellIndex, {y: {$set: cellIndex.y - 1}})
    }
    else if(direction === NeighbourDirection.RIGHT) {
      cellIndexToAddEquipment = update(cellIndex, {x: {$set: cellIndex.x + 1}})
    }
    else if(direction === NeighbourDirection.DOWN) {
      cellIndexToAddEquipment = update(cellIndex, {y: {$set: cellIndex.y + 1}})
    }
    else if(direction === NeighbourDirection.LEFT) {
      cellIndexToAddEquipment = update(cellIndex, {x: {$set: cellIndex.x - 1}})
    }

    this.setState({
      isAddEquipmentModalVisible: true,
      cellIndexToAddEquipment,
    })
  }

  onRemoveEquipment = cellIndex => {
    console.log(cellIndex)
  }

  /* Methods */

  _getEmptyNeighbours = cellIndex => {
    const rowIndex = cellIndex.y
    const ownRow = this.state.rows[rowIndex]
    const upperRow = this.state.rows[rowIndex - 1]
    const lowerRow = this.state.rows[rowIndex + 1]

    const rightNeighbour = ownRow[cellIndex.x + 1]
    const hasRight = !!rightNeighbour && !!rightNeighbour.equipment

    const leftNeighbour = ownRow[cellIndex.x - 1]
    const hasLeft = !!leftNeighbour && !!leftNeighbour.equipment

    const hasUp = upperRow && !!upperRow[cellIndex.x].equipment

    const hasDown = lowerRow && !!lowerRow[cellIndex.x].equipment

    return {
      up: !hasUp,
      right: !hasRight,
      down: !hasDown,
      left: !hasLeft,
    }
  }
}
