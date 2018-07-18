import React, {Component} from 'react'

import {Tree, TreeNode, TreeLeaf} from 'cmp/Tree'
import {Equipment} from 'cmp/Equipment'
import {type as equipmentType} from 'cmp/Equipment/type'

import './App.css'

const draw2d = window.draw2d
const $ = window.$

export class App extends Component {
  componentDidMount() {
    const canvas = new draw2d.Canvas("canvas")
    canvas.onDrop = (node, x, y) => {
      const equipment = new equipmentType[node.data().type]()

      const portTop = equipment.createPort('hybrid', new draw2d.layout.locator.TopLocator())
      portTop.on('connect', (c, target) => {
        target.connection.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
      })

      const portRight = equipment.createPort('hybrid', new draw2d.layout.locator.RightLocator())
      portRight.on('connect', (c, target) => {
        target.connection.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
      })

      const portBottom = equipment.createPort('hybrid', new draw2d.layout.locator.BottomLocator())
      portBottom.on('connect', (c, target) => {
        target.connection.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
      })

      const portLeft = equipment.createPort('hybrid', new draw2d.layout.locator.LeftLocator())
      portLeft.on('connect', (c, target) => {
        target.connection.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
      })

      canvas.add(equipment, x, y)
    }

    const writer = new draw2d.io.json.Writer()
    $('#readyButton').on('click', () => {
      writer.marshal(canvas, function(json) {
        console.log(json)
      })
    })
  }

  render() {
    return (
      <div className="App">

        <div className="App__Header">
          <div className="App__Header_Heading">Minealytics</div>
        </div>

        <div className="App__Sidebar">
          <Tree>
            <TreeNode label="Size Reduction">
              <TreeNode label="Crushing"></TreeNode>
              <TreeNode label="Grinding"></TreeNode>
            </TreeNode>
            <TreeNode label="Size Control">
              <TreeNode label="Screening"></TreeNode>
              <TreeNode label="Classification"></TreeNode>
            </TreeNode>
            <TreeNode label="Enrichment"></TreeNode>
            <TreeNode label="Upgrading"></TreeNode>
            <TreeNode label="Materials Handling">
              <TreeNode label="Splitters"></TreeNode>
              <TreeNode label="Storage">
                <TreeLeaf>
                  <Equipment
                    label="Bin"
                    type="bin"
                  />
                </TreeLeaf>
              </TreeNode>
              <TreeNode label="Discharging"></TreeNode>
              <TreeNode label="Conveying">
                <TreeLeaf>
                  <Equipment
                    label="Belt"
                    type="belt"
                  />
                </TreeLeaf>
              </TreeNode>
              <TreeNode label="Stacking"></TreeNode>
            </TreeNode>
          </Tree>

          <hr/>

          <button id="readyButton">Ready</button>

        </div>

        <div className="App__Content">
          <div id="canvas"></div>
        </div>

      </div>
    )
  }
}
