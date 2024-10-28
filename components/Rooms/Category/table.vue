<template>
  <div>
    <TablesTableUtil :headers="headers" :apiURL="api_url" :store="categoryStore"></TablesTableUtil>
  </div>
</template>

<script setup>
import { useModalStore } from '@/stores/cetegory'
const categoryStore = useModalStore()
console.log(typeof categoryStore, 'categoryStore')
// function addCategory() {
//   categoryStore.toggleModal()
// }
const api_url = '/api/rooms/category'
const headers = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'facility', label: 'Facility' },
  { key: 'description', label: 'Description' },
  { key: 'normalRent', label: 'Normal Rent' },
  { key: 'patientRent', label: 'Patient Rent' },
  { key: 'actions', label: ['edit', 'delete'] }
]
</script>
