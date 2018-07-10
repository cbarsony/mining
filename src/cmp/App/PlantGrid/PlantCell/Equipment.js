import React from 'react'
import PropTypes from 'prop-types'

import {EquipmentType} from 'api/classes'

export const Equipment = props => (
  <div>{props.type}</div>
)

Equipment.propTypes = {
  type: PropTypes.oneOf([
    EquipmentType.BIN,
    EquipmentType.BELT,
    EquipmentType.SPLITTER,
  ]).isRequired,
}
