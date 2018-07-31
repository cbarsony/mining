export const uploadFile = file => ({
  type: 'UPLOAD_FILE',
  file,
})

export const savePlan = (planIndex, plan) => ({
  type: 'SAVE_PLAN',
  planIndex,
  plan,
})

export const createPlan = plan => ({
  type: 'CREATE_PLAN',
  plan,
})

export const deletePlan = planIndex => ({
  type: 'DELETE_PLAN',
  planIndex,
})

export const updateEquipmentFile = (equipmentIndex, fieldIndex, fileName, headerField) => ({
  type: 'UPDATE_EQUIPMENT_FILE',
  equipmentIndex,
  fieldIndex,
  fileName,
  headerField,
})

export const updateUnit = (equipmentIndex, fieldIndex, unitIndex) => ({
  type: 'UPDATE_UNIT',
  equipmentIndex,
  fieldIndex,
  unitIndex,
})
