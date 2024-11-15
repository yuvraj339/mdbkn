import { defineStore } from 'pinia';
var records = { floorNumber: '', roomNumber: '', roomCategory: 1, price: '', amenities: '', guestCapacity: '', roomStatus: '', remarks: '' };
export const useRoomModalStore = defineStore('roomModal', {
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
