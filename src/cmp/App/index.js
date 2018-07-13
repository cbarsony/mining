import React, {Component} from 'react'

export class App extends Component {
  componentDidMount() {
    const draw2d = window.draw2d
    const $ = window.jQuery
    $('#dragme').draggable()

    const canvas = new draw2d.Canvas("canvas")

    canvas.add(new draw2d.shape.basic.Oval(), 100, 100)

    canvas.onDrop = function(node, x, y) {
      canvas.add(new draw2d.shape.basic.Oval(), x, y)
    }
  }

  render() {
    return (
      <div className="App">

        <div className="App__Content">
          <div id="canvas"></div>
        </div>

        <div className="App__Sidebar">
          <div
            id="dragme"
            className="draw2d_droppable ui-draggable"
          >drag me!</div>
        </div>

        <div className="App__Header">
          <h1>Minealytics</h1>
        </div>

      </div>
    )
  }
}
