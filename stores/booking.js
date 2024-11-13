import { defineStore } from 'pinia';
// import { ref } from 'vue';
var records = {
  patientType: '',
  bookingType: '',
  checkInTime: '',
  category: '',
  room: '',
  payment: '',
  mobile: '',
  guestName: '',
  patientGuestRelation: '',
  document: File,
  gender: '',
  caste: '',
  age: '',
  state: '',
  city: '',
  tehsil: '',
  village: '',
  patientName: '',
  hospital: '',
  wardNo: '',
  guestFName: '',
  hospitalRoomNumber: '',
  hospitalBedNumber: '',
  doctorName: '',
  remark: ''
};
export const useBookingModalStore = defineStore('modalBooking', {
  state: () => ({
    showModal: false,
    editMode: false,
    record: records,
    editId: null
  }),
  actions: {
    toggleModal() {
      this.showModal = !this.showModal;
    },
    closeModel() {
      this.showModal = false;
      this.editMode = false;
      this.record = records;
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
