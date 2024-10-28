<template>
  <div>
    <TablesTableUtil :headers="headers" :apiURL="api_url" :store="categoryStore"></TablesTableUtil>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/room'
const roomStore = useModalStore()
// console.log(typeof categoryStore, 'categoryStore')
// function addCategory() {
//   categoryStore.toggleModal()
// }
const api_url = '/api/rooms'
const headers = [
  { key: 'id', label: 'ID' },
  { key: 'floorNumber', label: 'Floor Number' },
  { key: 'roomNumber', label: 'Room Number' },
  { key: 'roomCategory', label: 'Room Category' },
  { key: 'bookedDate', label: 'Dooked Date' },
  { key: 'isBooked', label: 'Is Booked' },
  { key: 'guestCapacity', label: 'Guest Capacity' },
  { key: 'roomStatus', label: 'Room Status' },
  { key: 'guestName', label: 'Guest Name' },
  { key: 'remarks', label: 'Remarks' },
  { key: 'actions', label: ['edit', 'delete'] }
]
</script>
