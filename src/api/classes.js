/**
 * @readonly
 * @enum {string}
 */
export const EquipmentType = {
  BIN: 'BIN',
  BELT: 'BELT',
  SPLITTER: 'SPLITTER',
}

/**
 * @readonly
 * @enum {string}
 */
export const NeighbourDirection = {
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
}

export class Equipment {
  /**
   * @param type {EquipmentType}
   */
  constructor(type) {
    this.type = type
  }
}

export class CellIndex {
  /**
   * @param x {number}
   * @param y {number}
   */
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

export class PlantCell {
  /**
   * @param cellIndex {CellIndex}
   * @param equipment {Equipment=}
   */
  constructor(cellIndex, equipment) {
    this.cellIndex = cellIndex
    this.equipment = equipment
  }
}
