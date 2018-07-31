import React, {Component} from 'react'
import makeBem from 'bem-cx'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {savePlan, createPlan, deletePlan} from 'actions'
import {Tree, TreeNode, TreeLeaf} from 'cmp/Tree'
import {Equipment} from 'cmp/Equipment'
import {type as equipmentType} from 'cmp/Equipment/type'
import {Modal} from 'cmp/Modal'
import {PlanLoader} from 'cmp/PlanLoader'

import './PlannerPage.css'

const cn = makeBem('PlannerPage')
const draw2d = window.draw2d
const reader = new draw2d.io.json.Reader()
const writer = new draw2d.io.json.Writer()

class PlannerPageComponent extends Component {
  state = {
    plan: {
      name: 'New Plan',
      data: [],
    },
    selectedPlanIndex: -1,
    isPlanUnsaved: false,
    isOpenPlanModalVisible: false,
  }

  componentDidMount() {
    this.canvas = new draw2d.Canvas("canvas")

    this.canvas.onDrop = (node, x, y) => {
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

      this.canvas.add(equipment, x, y)
      this.setState({isPlanUnsaved: true})
    }
  }

  render() {
    const props = this.props
    const state = this.state

    return (
      <div className={cn}>

        <Modal
          isVisible={state.isOpenPlanModalVisible}
          onClose={() => this.setState({isOpenPlanModalVisible: false})}
        >
          <PlanLoader
            selectedPlanIndex={state.selectedPlanIndex}
            isPlanUnsaved={state.isPlanUnsaved}
            openPlan={selectedPlanIndex => {
              window.Bin = equipmentType.bin
              window.Belt = equipmentType.belt
              this.canvas.clear()
              reader.unmarshal(this.canvas, props.planList[selectedPlanIndex].data)
              this.setState({
                selectedPlanIndex,
                isOpenPlanModalVisible: false,
              })
            }}
          />
        </Modal>

        <div className={cn.el('Sidebar')}>

          <div>{state.plan.name}</div>

          <div>
            <button
              onClick={this.onSavePlan}
            >Save plan</button>
          </div>

          {props.planList.length > 0 && (
            <div>
              <button onClick={() => this.setState({isOpenPlanModalVisible: true})}>Open plan</button>
            </div>
          )}

          <hr/>

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

          <button
            onClick={() => {
              const writer = new draw2d.io.json.Writer()
              writer.marshal(this.canvas, plan => {
                this.props.savePlan(plan)
              })
            }}
          >Save</button>

          <button
            onClick={() => {
              const reader = new draw2d.io.json.Reader()
              window.Bin = equipmentType.bin
              window.Belt = equipmentType.belt
              reader.unmarshal(this.canvas, this.props.plan)
            }}
          >Read</button>
        </div>

        <div className={cn.el('Planner')}>
          <div id="canvas"></div>
        </div>

      </div>
    )
  }

  /**
   * docs/PlannerPage/onSavePlan.puml
   */
  onSavePlan = () => {
    let plan = this.props.planList[this.state.selectedPlanIndex]
    let planIndex = this.state.selectedPlanIndex

    if(!plan) {
      const planName = window.prompt('Enter Plan\'s name', this.state.plan.name)

      if(!planName) {
        return
      }

      planIndex = this.props.planList.findIndex(plan => plan.name === planName)
      plan = this.props.planList[planIndex]

      if(!plan) {
        writer.marshal(this.canvas, data => {
          this.props.createPlan({
            name: planName,
            data,
          })
          this.setState({isPlanUnsaved: false})
        })
        return
      }
    }

    if(window.confirm(`Overwrite ${plan.name}?`)) {
      writer.marshal(this.canvas, data => {
        this.props.savePlan(
          planIndex,
          {
            name: plan.name,
            data,
          },
        )
        this.setState({isPlanUnsaved: false})
      })
    }
  }
}

PlannerPageComponent.propTypes = {
  planList: PropTypes.array.isRequired,
  savePlan: PropTypes.func.isRequired,
  createPlan: PropTypes.func.isRequired,
  deletePlan: PropTypes.func.isRequired,
}

export const PlannerPage = connect(
  state => ({planList: state.planList}),
  dispatch => ({
    savePlan: (planIndex, plan) => dispatch(savePlan(planIndex, plan)),
    createPlan: plan => dispatch(createPlan(plan)),
    deletePlan: planIndex => dispatch(deletePlan(planIndex)),
  }),
)(PlannerPageComponent)
