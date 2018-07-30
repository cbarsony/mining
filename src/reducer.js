import update from 'immutability-helper'

const planList = JSON.parse(localStorage.getItem('plan'))

planList.unshift({
  name: 'New plan',
  data: [],
})

const initialState = {
  fileList: [],
  planList,
  selectedPlanIndex: 0,
}

export const reducer = (state = initialState, action) => {
  let newState

  switch (action.type) {
    case 'UPLOAD_FILE':
      return update(state, {
        fileList: {
          $push: [action.file],
        },
      })
    case 'SELECT_EQUIPMENT':
      return update(state, {
        selectedEquipmentId: {
          $set: action.equipmentId,
        },
      })
    case 'OPEN_PLAN':
      return update(state, {
        selectedPlanIndex: {
          $set: action.planIndex,
        },
      })
    case 'SAVE_PLAN':
      newState = update(state, {
        planList: {
          [state.selectedPlanIndex]: {
            $set: action.plan,
          },
        },
      })
      localStorage.setItem('plan', JSON.stringify(newState.planList))
      if(newState) {
        alert('Plan saved')
      }
      return newState
    case 'DELETE_PLAN':
      const deletedPlanName = state.planList[action.planIndex].name

      newState = update(state, {
        planList: {
          $splice: [[action.planIndex, 1]],
        },
      })
      localStorage.setItem('plan', JSON.stringify(newState.planList))
      if(newState) {
        alert(`Plan "${deletedPlanName}" deleted`)
      }
      return newState
    case 'UPDATE_EQUIPMENT_FILE':
      return update(state, {
        plan: {
          [action.equipmentIndex]: {
            userData: {
              fields: {
                [action.fieldIndex]: {
                  file: {
                    $set: {
                      name: action.fileName,
                      headerField: action.headerField,
                    }
                  }
                }
              }
            }
          }
        }
      })
    case 'UPDATE_UNIT':
      return update(state, {
        plan: {
          [action.equipmentIndex]: {
            userData: {
              fields: {
                [action.fieldIndex]: {
                  selectedUnitIndex: {
                    $set: action.unitIndex,
                  }
                }
              }
            }
          }
        }
      })
    default:
      return state
  }
}
