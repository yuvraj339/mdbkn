<template>
  <div>
    <TablesTableUtil :headers="headers" :apiURL="api_url" :store="bookingStore" ref="tableChild"></TablesTableUtil>
  </div>
</template>

<script setup>
import { useBookingModalStore } from '@/stores/booking';
const bookingStore = useBookingModalStore();

const tableChild = ref(null);

// const refreshTableChildren = () => {
//   tableChild.value.fetchData();
// };
const props = defineProps({
  api_url: {
    type: String,
    default: '/api/bookings/booking' // Set your default URL here
  }
});

const headers = ref([
  { key: 'id', label: 'ID' },
  { key: 'guestName', label: 'Guest Name' },
  { key: 'patientName', label: 'Patient Name' },
  { key: 'checkInTime', label: 'Check In' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'roomNumber', label: 'Room Number' },
  { key: 'payment', label: 'Payment' }
]);

watch(
  () => props.api_url,
  () => {
    updateHeader();
  },
  { immediate: true }
);

function updateHeader() {
  // Reset to default headers
  headers.value = [
    { key: 'id', label: 'ID' },
    { key: 'guestName', label: 'Guest Name' },
    { key: 'patientName', label: 'Patient Name' },
    { key: 'checkInTime', label: 'Check In' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'roomNumber', label: 'Room Number' }
  ];

  let queryString = props.api_url.split('?');

  let type = 'currentBookings'; // Default
  if (queryString.length > 1) {
    const params = new URLSearchParams(queryString[1]);
    type = params.get('type') || type;
  }

  if (type == 'dueBalance') {
    headers.value.push({ key: 'totalDays', label: 'Days' }, { key: 'totalRent', label: 'Rent' }, { key: 'totalAdvance', label: 'Paid' }, { key: 'payment', label: 'Due Amount' });
  } else {
    headers.value.push(
      { key: 'city', label: 'City' },
      { key: 'roomStatus', label: 'Room Status' },
      { key: 'checkOutTime', label: 'Check Out' },
      { key: 'actions', label: ['edit', 'delete'] }
    );
  }
}
</script>
