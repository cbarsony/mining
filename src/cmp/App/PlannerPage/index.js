import React, {Component} from 'react'
import makeBem from 'bem-cx'
import {connect} from 'react-redux'

import {addEquipment, savePlan} from 'actions'
import {Tree, TreeNode, TreeLeaf} from 'cmp/Tree'
import {Equipment} from 'cmp/Equipment'
import {type as equipmentType} from 'cmp/Equipment/type'
import {EquipmentSettings} from 'cmp/Equipment/EquipmentSettings'

import './PlannerPage.css'

const cn = makeBem('PlannerPage')
const draw2d = window.draw2d
const $ = window.$

class PlannerPageComponent extends Component {
  componentDidMount() {
    const canvas = new draw2d.Canvas("canvas")
    const writer = new draw2d.io.json.Writer()

    canvas.onDrop = (node, x, y) => {
      const nodeType = node.data().type
      const equipment = new equipmentType[nodeType]()

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

      if(nodeType === 'bin') {
        equipment.setUserData({
          fields: [
            {
              name: 'volume',
              units: [
                'm3',
                'barrel',
              ],
              file: null,
            },
            {
              name: 'mass',
              units: [
                'kg',
                'pound',
              ],
              file: null,
            },
          ],
        })
      }
      else if(nodeType === 'belt') {
        equipment.setUserData({
          fields: [
            {
              name: 'speed',
              units: [
                'm/s',
                'km/h',
              ],
            },
            {
              name: 'temperature',
              units: [
                'celsius',
                'fahrenheit',
              ],
            },
          ],
        })
      }

      canvas.add(equipment, x, y)

      writer.marshal(canvas, plan => this.props.savePlan(plan))

      // this.props.addEquipment(equipment)
    }

    $('#readyButton').on('click', () => {
      writer.marshal(canvas, function(json) {
        console.log(json)
      })
    })
  }

  render() {
    const props = this.props
    const selectedEquipment = props.equipmentList.find(equipment => equipment.id === props.selectedEquipmentId)

    return (
      <div className={cn}>

        <div className={cn.el('Sidebar')}>
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

          <button id="readyButton">Save</button>
        </div>

        <div className={cn.el('Planner')}>
          <div id="canvas"></div>
        </div>

        {selectedEquipment && (
          <EquipmentSettings
            fileList={props.fileList}
            equipment={selectedEquipment}
            save={settings => {
              console.log(settings)
            }}
          />
        )}

      </div>
    )
  }
}

export const PlannerPage = connect(
  state => state,
  dispatch => ({
    addEquipment: equipment => dispatch(addEquipment(equipment)),
    savePlan: plan => dispatch(savePlan(plan)),
  }),
)(PlannerPageComponent)
