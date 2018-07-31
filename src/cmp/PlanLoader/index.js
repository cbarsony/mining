import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import {deletePlan} from 'actions'

const PlanLoaderComponent = props => (
  <table className="PlanLoader">
    <tbody>
    {props.planList.map((plan, index) => (
      <tr key={index}>
        <td>Plan name: {plan.name}</td>
        {index === props.selectedPlanIndex ?
          <td colSpan="2">(opened)</td> :
          ([
            <td key="1">
              <button onClick={() => {
                if(props.isPlanUnsaved) {
                  if(!window.confirm(`Continue without saving?`)) {
                    return
                  }
                }

                props.openPlan(index)
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
)

PlanLoaderComponent.propTypes = {
  planList: PropTypes.array.isRequired,
  selectedPlanIndex: PropTypes.number,
  isPlanUnsaved: PropTypes.bool,
  openPlan: PropTypes.func.isRequired,
  deletePlan: PropTypes.func.isRequired,
}

export const PlanLoader = connect(
  state => ({planList: state.planList}),
  dispatch => ({deletePlan: planIndex => dispatch(deletePlan(planIndex))}),
)(PlanLoaderComponent)
