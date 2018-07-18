import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {uuid} from 'utils/uuid'

import './Tree.css'

export const TreeLeaf = props => <li className="Tree__Leaf">{props.children}</li>

TreeLeaf.propTypes = {children: PropTypes.node}

export class TreeNode extends Component {
  render() {
    const props = this.props
    const id = uuid()

    return (
      <li>
        <label htmlFor={id}>{props.label}</label>
        <input
          id={id}
          type="checkbox"
        />
        <ol>{props.children}</ol>
      </li>
    )
  }
}

// TODO: Find solution with more specific validator than "node" (e.g.: TreeLeaf)
TreeNode.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export const Tree = props => <ol className="Tree">{props.children}</ol>

Tree.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
}
