import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import makeBem from 'bem-cx'

import './Modal.css'

const cn = makeBem('Modal')
const modalRoot = document.getElementById('modalRoot')

export class Modal extends Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount() {
    modalRoot.appendChild(this.el)
    this.el.classList.add(cn.toString())
    this.keyDown = e => {
      if(e.key === 'Escape') {
        this.props.onClose()
      }
    }
    document.addEventListener('keydown', this.keyDown)
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el)
    document.removeEventListener('keydown', this.keyDown)
  }

  render() {
    const props = this.props

    if(!props.isVisible) return null

    return ReactDOM.createPortal(
      <div
        className={cn.el('overlay')}
        onClick={props.onClose}
      >
        <div
          className={cn.el('window')}
          onClick={e => e.stopPropagation()}
        >
          <div
            className={cn.el('close')}
            onClick={props.onClose}
          >
            <i className="fas fa-times"></i>
          </div>
          {props.children}
        </div>
      </div>,
      this.el,
    )
  }
}

Modal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
