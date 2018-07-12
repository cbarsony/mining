import React, {Component} from 'react'

export class App extends Component {
  componentDidMount() {
    const draw2d = window.draw2d
    const $ = window.jQuery
    const dragme = $('#dragme').draggable()

    const canvas = new draw2d.Canvas("gfx_holder")

    canvas.add(new draw2d.shape.basic.Oval(), 100, 100)

    canvas.onDrop = function(node, x, y) {
      canvas.add(new draw2d.shape.basic.Oval(), x, y)
    }
  }

  render() {
    return (
      <div>majom</div>
    )
  }
}
