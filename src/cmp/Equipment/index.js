import React, {Component} from 'react'
import PropTypes from 'prop-types'

export class Equipment extends Component {
  render() {
    const props = this.props

    return (
      <div
        className="Equipment draw2d_droppable"
        data-type={props.type}
      >{props.label}</div>
    )
  }
}

Equipment.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'bin',
    'belt',
  ]).isRequired,
}
