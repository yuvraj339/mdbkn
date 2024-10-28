import { defineStore } from 'pinia'

export const useModalStore = defineStore('modal', {
  state: () => ({
    showModal: false,
    editMode: false,
    record: { name: '', facility: '', description: '', normalRent: null, patientRent: null },
    editId: null
  }),
  actions: {
    toggleModal() {
      this.showModal = !this.showModal
    },
    closeModel() {
      this.showModal = false
      this.editMode = false
      let data = { id: null, name: '', facility: '', description: '', normalRent: null, patientRent: null }
      this.setRecord(data)
    },
    setRecord(data) {
      const { id, ...otherData } = data
      this.editId = id
      this.record = otherData
    },
    setEditMode(mode) {
      this.editMode = mode
    }
  }
})
