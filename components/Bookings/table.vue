<template>
  <div>
    <TablesTableUtil :headers="headers" :apiURL="api_url" :store="bookingStore" ref="tableChild"></TablesTableUtil>
  </div>
</template>

<script setup>
import { useBookingModalStore } from '@/stores/booking';
const bookingStore = useBookingModalStore();
// console.log(typeof categoryStore, 'categoryStore')
// function addCategory() {
//   categoryStore.toggleModal()
// }

const tableChild = ref(null);

const refreshTableChildren = () => {
  alert(1);
  tableChild.value.fetchData();
};
const props = defineProps({
  api_url: {
    type: String,
    default: '/api/bookings/booking' // Set your default URL here
  }
});
// const api_url = ;
const headers = [
  { key: 'id', label: 'ID' },
  { key: 'guestName', label: 'Guest Name' },
  { key: 'patientName', label: 'Patient Name' },
  { key: 'checkInTime', label: 'Check In' },
  { key: 'checkOutTime', label: 'Check Out' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'city', label: 'City' },
  { key: 'roomStatus', label: 'Room Status' },
  { key: 'roomNumber', label: 'Room Number' },
  { key: 'payment', label: 'Payment' },
  { key: 'actions', label: ['edit', 'delete'] }
];
</script>
