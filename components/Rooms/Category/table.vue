<template>
  <div>
    <RoomsCategoryAdd />
    <TablesTableUtil :headers="headers" :apiURL="api_url" :store="categoryStore"></TablesTableUtil>
  </div>
</template>

<script setup>
import { useCatModalStore } from '@/stores/cetegory';
const categoryStore = useCatModalStore();
// console.log(typeof categoryStore, 'categoryStore');
// function addCategory() {
//   categoryStore.toggleModal()
// }
const api_url = '/api/rooms/category';
const headers = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'normalRent', label: 'Normal Rent' },
  { key: 'patientRent', label: 'Patient Rent' },
  { key: 'max_occupancy', label: 'Max Occupancy' },
  { key: 'actions', label: ['edit', 'delete'] }
];
</script>
