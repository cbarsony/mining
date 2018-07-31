import update from 'immutability-helper'

const initialState = {
  fileList: [],
  planList: JSON.parse(localStorage.getItem('planList')) || [],
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

    case 'SAVE_PLAN':
      newState = update(state, {
        planList: {
          [action.planIndex]: {
            $set: action.plan,
          },
        },
      })
      localStorage.setItem('planList', JSON.stringify(newState.planList))
      if(newState) {
        alert('Plan saved')
      }
      return newState

    case 'CREATE_PLAN':
      newState = update(state, {
        planList: {
          $push: [action.plan],
        },
      })
      localStorage.setItem('planList', JSON.stringify(newState.planList))
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
      localStorage.setItem('planList', JSON.stringify(newState.planList))
      if(newState) {
        alert(`Plan "${deletedPlanName}" deleted`)
      }
      return newState

    case 'UPDATE_EQUIPMENT_FILE':
      return update(state, {
        planList: {
          [action.planIndex]: {
            data: {
              [action.equipmentIndex]: {
                userData: {
                  fields: {
                    [action.fieldIndex]: {
                      file: {
                        $set: {
                          name: action.fileName,
                          headerField: action.headerField,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })

    case 'UPDATE_UNIT':
      return update(state, {
        planList: {
          [action.planIndex]: {
            data: {
              [action.equipmentIndex]: {
                userData: {
                  fields: {
                    [action.fieldIndex]: {
                      selectedUnitIndex: {
                        $set: action.unitIndex,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })

    default:
      return state
  }
}
