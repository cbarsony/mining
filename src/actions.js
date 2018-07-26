export const uploadFile = file => ({
  type: 'UPLOAD_FILE',
  file,
})

export const addEquipment = equipment => ({
  type: 'ADD_EQUIPMENT',
  equipment,
})

export const selectEquipment = equipmentId => ({
  type: 'SELECT_EQUIPMENT',
  equipmentId,
})

export const savePlan = plan => ({
  type: 'SAVE_PLAN',
  plan,
})
