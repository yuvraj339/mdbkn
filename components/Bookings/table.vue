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

const headers = ref([]);

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
    { key: 'roomNumber', label: 'Room Number' }
  ];
  //  Checkin, checkout, room number, guestName, address, receipt, amount (if checking only advance amount else final amount), date
  let queryString = props.api_url.split('?');

  let type = 'currentBookings'; // Default
  let status = 'both'; // Default
  if (queryString.length > 1) {
    const params = new URLSearchParams(queryString[1]);
    type = params.get('type') || type;
    status = params.get('status') || status;
  }
  if (type == 'dueBalance') {
    headers.value.push(
      { key: 'mobile', label: 'Mobile' },
      { key: 'totalDays', label: 'Days' },
      { key: 'totalRent', label: 'Rent' },
      { key: 'totalAdvance', label: 'Paid' },
      { key: 'payment', label: 'Due Amount' }
    );
  } else if (type == 'cashBook') {
    headers.value.push(
      { key: 'checkOutTime', label: 'Check Out' },
      { key: 'booking_receipt_number', label: 'Receipt' },
      { key: 'address', label: 'Address' },
      { key: 'totalAdvance', label: 'Advance' }
    );
    if (status == 'both' || status == 'Available') {
      headers.value.push({ key: 'received', label: 'Received' });
    } else if (status == 'both' || status == 'Available' || status == 'advance') {
      headers.value.push({ key: 'initAdvance', label: 'Init Adv' });
    } else {
      headers.value = headers.value.filter((header) => header.key !== 'received');
    }
    if (status == 'advance') {
      headers.value.push({ key: 'todayAdvance', label: 'Today Adv' });
    }
  } else {
    headers.value.push(
      { key: 'mobile', label: 'Mobile' },
      { key: 'city', label: 'City' },
      { key: 'roomStatus', label: 'Room Status' },
      { key: 'checkOutTime', label: 'Check Out' },
      { key: 'actions', label: ['edit', 'delete'] }
    );
  }
}
</script>
