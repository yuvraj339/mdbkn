<template>
  <div>
    <TablesTableUtil :headers="headers" :apiURL="api_url" :store="checkoutStore" ref="tableChild"></TablesTableUtil>
  </div>
</template>

<script setup>
import { useCheckoutModalStore } from '@/stores/checkout';
const checkoutStore = useCheckoutModalStore();

const tableChild = ref(null);

// const refreshTableChildren = () => {
//   alert(1);
//   tableChild.value.fetchData();
// };
const props = defineProps({
  api_url: {
    type: String,
    default: '/api/bookings/checkout?status=Available&type=checkout' // Set your default URL here
  }
});
// const api_url = ;
const headers = [
  { key: 'id', label: 'ID' },
  { key: 'guestName', label: 'Guest Name' },
  { key: 'patientName', label: 'Patient Name' },
  { key: 'booking_receipt_number', label: 'Receipt' },
  { key: 'checkInTime', label: 'Check In' },
  { key: 'checkOutTime', label: 'Check Out' },
  { key: 'roomNumber', label: 'Room Number' },
  { key: 'actions', label: ['edit'] }
];
</script>
