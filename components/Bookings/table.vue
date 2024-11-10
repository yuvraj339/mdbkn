<template>
  <div>
    <TablesTableUtil :headers="headers" :apiURL="api_url" :store="bookingStore"></TablesTableUtil>
  </div>
</template>

<script setup>
import { useBookingModalStore } from '@/stores/booking';
const bookingStore = useBookingModalStore();
// console.log(typeof categoryStore, 'categoryStore')
// function addCategory() {
//   categoryStore.toggleModal()
// }
const api_url = '/api/bookings/booking';
const headers = [
  { key: 'id', label: 'ID' },
  { key: 'patientName', label: 'Patient Name' },
  { key: 'guestName', label: 'Guest Name' },
  { key: 'checkInTime', label: 'Check In' },
  { key: 'checkOutTime', label: 'Check Out' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'city', label: 'City' },
  { key: 'room', label: 'Room Status' },
  { key: 'payment', label: 'Payment' },
  { key: 'actions', label: ['edit', 'delete'] }
];
</script>
