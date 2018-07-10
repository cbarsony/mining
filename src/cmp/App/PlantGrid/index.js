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

export class PlantGrid extends Component {
  state = {
    equipmentCellList: [
      {
        cellIndex: new CellIndex(1, 1),
        equipment: new Equipment(EquipmentType.BELT),
      },
      {
        cellIndex: new CellIndex(2, 1),
        equipment: new Equipment(EquipmentType.BIN),
      },
    ],
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
            this.setState(state => update(state, {
              equipmentCellList: {
                $push: [{
                  cellIndex: state.cellIndexToAddEquipment,
                  equipment: new Equipment(type),
                }],
              },
              isAddEquipmentModalVisible: {
                $set: false,
              },
              cellIndexToAddEquipment: {
                $set: null,
              },
            }))
          }}/>
        </Modal>
        {this._getRows().map((row, y) => (
          <div
            key={y}
            data-row-index={y}
            className={cn.el('row')}
          >
            {row.map((cell, x) => {
              const cellIndex = new CellIndex(x, y)
              let equipment = null

              state.equipmentCellList.forEach(cell => {
                if(cell.cellIndex.x === x && cell.cellIndex.y === y) {
                  equipment = cell.equipment
                }
              })

              return (
                <div
                  key={x}
                  data-cell-index={x}
                  className={cn.el('cell')}
                >
                  <PlantCell
                    cellIndex={cellIndex}
                    emptyNeighbours={this._getEmptyNeighbours(cellIndex)}
                    equipment={equipment}
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
    const rows = this._getRows()
    const rowIndex = cellIndex.y
    const ownRow = rows[rowIndex]
    const upperRow = rows[rowIndex - 1]
    const lowerRow = rows[rowIndex + 1]

    const rightNeighbour = ownRow[cellIndex.x + 1]
    const hasRight = !!rightNeighbour && !!this.state.equipmentCellList.find(cell => cell.cellIndex.x === rightNeighbour.cellIndex.x && cell.cellIndex.y === rightNeighbour.cellIndex.y)

    const leftNeighbour = ownRow[cellIndex.x - 1]
    const hasLeft = !!leftNeighbour && !!this.state.equipmentCellList.find(cell => cell.cellIndex.x === leftNeighbour.cellIndex.x && cell.cellIndex.y === leftNeighbour.cellIndex.y)

    const hasUp = upperRow && !!this.state.equipmentCellList.find(cell => cell.cellIndex.x === upperRow[cellIndex.x].cellIndex.x && cell.cellIndex.y === upperRow[cellIndex.x].cellIndex.y)

    const hasDown = lowerRow && !!this.state.equipmentCellList.find(cell => cell.cellIndex.x === lowerRow[cellIndex.x].cellIndex.x && cell.cellIndex.y === lowerRow[cellIndex.x].cellIndex.y)

    return {
      up:    !hasUp,
      right: !hasRight,
      down:  !hasDown,
      left:  !hasLeft,
    }
  }

  _getRows = () => {
    const boundaries = {
      up:    Math.min(...this.state.equipmentCellList.map(cell => cell.cellIndex.y)) - 1,
      right: Math.max(...this.state.equipmentCellList.map(cell => cell.cellIndex.x)) + 1,
      down:  Math.max(...this.state.equipmentCellList.map(cell => cell.cellIndex.y)) + 1,
      left:  Math.min(...this.state.equipmentCellList.map(cell => cell.cellIndex.x)) - 1,
    }

    return _.range(boundaries.up, boundaries.down + 1).map(y => _.range(boundaries.left, boundaries.right + 1).map(x => new CPlantCell(new CellIndex(x, y))))
  }
}
