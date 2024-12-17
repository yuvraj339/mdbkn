import { defineStore } from 'pinia';
var records = { selectedDate: '', staffSalary: 0, lightBill: 0, waterBill: 0, voucher: 0, extraExpenditure: '' };
export const useExpencesModalStore = defineStore('ExpencesModal', {
  state: () => ({
    showModal: false,
    editMode: false,
    record: ref(records),
    editId: null
  }),
  actions: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
    closeModel() {
      this.showModal = false;
      this.editMode = false;
      // let data = records;
      // let data = records.push({ id: null });
      this.record = ref(records);
      // this.setRecord(data);
    },
    setRecord(data) {
      const { id, ...otherData } = data;
      this.editId = id;
      this.record = otherData;
    },
    setEditMode(mode) {
      this.editMode = mode;
    }
  }
});
