import React, {Component} from 'react'
import makeBem from 'bem-cx'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'
import update from 'immutability-helper'

import {openPlan, savePlan, deletePlan} from 'actions'
import {Tree, TreeNode, TreeLeaf} from 'cmp/Tree'
import {Equipment} from 'cmp/Equipment'
import {type as equipmentType} from 'cmp/Equipment/type'
import {Modal} from 'cmp/Modal'

import './PlannerPage.css'

const cn = makeBem('PlannerPage')
const draw2d = window.draw2d

class PlannerPageComponent extends Component {
  state = {
    plan: this.props.planList[this.props.selectedPlanIndex],
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
          <table>
            <tbody>
              {props.planList.map((plan, index) => (
                <tr key={index}>
                  <td>{plan.name}</td>
                  {index === props.selectedPlanIndex ?
                    <td colSpan="2">(opened)</td> :
                    ([
                      <td key="1">
                        <button onClick={() => {
                          const reader = new draw2d.io.json.Reader()
                          window.Bin = equipmentType.bin
                          window.Belt = equipmentType.belt
                          reader.unmarshal(this.canvas, plan.data)

                          props.openPlan(index)
                          this.setState({
                            plan,
                            isOpenPlanModalVisible: false,
                          })
                        }}>Open</button>
                      </td>,
                      <td key="2">
                        <button onClick={() => {
                          if(window.confirm(`Delete "${props.planList[index].name}" ?`)) {
                            props.deletePlan(index)
                          }
                        }}>Delete</button>
                      </td>,
                    ])}
                </tr>
              ))}
            </tbody>
          </table>
        </Modal>

        <div className={cn.el('Sidebar')}>

          <div>
            <span>Plan name: {state.plan.name}</span>
            <button
              onClick={this._onEditButtonClick}
              style={{float: 'right'}}
            >Edit</button>
          </div>

          {state.isPlanUnsaved && (
            <div>
              <button
                onClick={this._onSavePlanClick}
              >Save plan</button>
            </div>
          )}

          <div>
            <button onClick={() => this.setState({isOpenPlanModalVisible: true})}>Open plan</button>
          </div>

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

  _onEditButtonClick = () => {
    const planName = window.prompt('Please enter new Plan name', this.state.plan.name)

    if(planName) {
      this.setState(state => update(state, {
        plan: {
          name: {
            $set: planName,
          },
        },
        isPlanUnsaved: {
          $set: true,
        },
      }))
    }
  }

  _onSavePlanClick = () => {
    const writer = new draw2d.io.json.Writer()

    writer.marshal(this.canvas, data => {
      this.props.savePlan({
        name: this.state.plan.name,
        data,
      })
      this.setState({isPlanUnsaved: false})
    })
  }

  _getPlanListElementCommand = index => {
    if(index === this.state.selectedPlanIndex) {
      if(this.state.isSelectedPlanUnsaved) {
        return (
          <button
            onClick={() => {
              const writer = new draw2d.io.json.Writer()
              writer.marshal(this.canvas, plan => {
                this.props.savePlan(index, plan)
                this.setState({isSelectedPlanUnsaved: false})
              })
            }}
          >Save</button>
        )
      }
      else {
        return <span>(saved)</span>
      }
    }
    else {
      return <button onClick={() => {
        if(this.state.isSelectedPlanUnsaved) {
          if(window.confirm('Plan is unsaved. Proceed anyways?')) {
            this.setState({selectedPlanIndex: index})
          }
        }
        else {
          this.setState({selectedPlanIndex: index})
        }
      }}>Load</button>
    }
  }
}

PlannerPageComponent.propTypes = {
  planList: PropTypes.array.isRequired,
  selectedPlanIndex: PropTypes.number.isRequired,
  openPlan: PropTypes.func.isRequired,
  savePlan: PropTypes.func.isRequired,
  deletePlan: PropTypes.func.isRequired,
}

export const PlannerPage = connect(
  state => ({
    planList: state.planList,
    selectedPlanIndex: state.selectedPlanIndex,
  }),
  dispatch => ({
    openPlan: (planIndex) => dispatch(openPlan(planIndex)),
    savePlan: (planIndex, data) => dispatch(savePlan(planIndex, data)),
    deletePlan: (planIndex, data) => dispatch(deletePlan(planIndex)),
  }),
)(PlannerPageComponent)
