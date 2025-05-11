import { defineStore } from 'pinia';
// import { ref } from 'vue';
var records = {
  booking_receipt_number: '',
  patientType: '',
  bookingType: '',
  checkInTime: getFormattedDateWithTime(16, 30),
  category: '',
  room: '',
  payment: 1000,
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
  remark: '',
  amenities: 0
};
function getFormattedDateWithTime(hour, minute) {
  // Get today's date
  const now = new Date();

  // Set the specific hour and minute
  now.setHours(hour);
  now.setMinutes(minute);
  now.setSeconds(0);
  now.setMilliseconds(0);

  // Format the date in YYYY-MM-DDTHH:mm
  const formattedDate = now.toISOString().slice(0, 16);
  // console.log(formattedDate);
  return formattedDate;
}
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
