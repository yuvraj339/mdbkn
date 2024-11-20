<template>
  <div>
    <RoomsAdd />
    <TablesTableUtil :headers="headers" :apiURL="api_url" :store="roomStore"></TablesTableUtil>
  </div>
</template>

<script setup>
import { useRoomModalStore } from '@/stores/room';
const roomStore = useRoomModalStore();
// console.log(typeof categoryStore, 'categoryStore')
// function addCategory() {
//   categoryStore.toggleModal()
// }
const props = defineProps({
  api_url: {
    type: String,
    default: '/api/rooms/room' // Set your default URL here
  }
});
// const api_url = '/api/rooms/room';
const headers = [
  { key: 'id', label: 'ID' },
  { key: 'floorNumber', label: 'Floor Number' },
  { key: 'roomNumber', label: 'Room Number' },
  { key: 'name', label: 'Room Category' },
  // { key: 'bookedDate', label: 'Booked Date' },
  // { key: 'isBooked', label: 'Is Booked' },
  { key: 'guestCapacity', label: 'Guest Capacity' },
  { key: 'roomStatus', label: 'Room Status' },
  // { key: 'remarks', label: 'Remarks' },
  { key: 'actions', label: ['edit', 'delete'] }
];
</script>
<!-- , , , amenities, , , remarks -->
