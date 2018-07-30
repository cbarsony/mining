export const uploadFile = file => ({
  type: 'UPLOAD_FILE',
  file,
})

export const selectEquipment = equipmentId => ({
  type: 'SELECT_EQUIPMENT',
  equipmentId,
})

export const openPlan = planIndex => ({
  type: 'OPEN_PLAN',
  planIndex,
})

export const savePlan = plan => ({
  type: 'SAVE_PLAN',
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
