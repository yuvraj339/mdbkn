<template>
  <div>
    <!-- Add Room Category Modal -->
    <div v-if="categoryStore.showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg w-96 modal">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">{{ categoryStore.editMode ? 'Edit Room Category' : 'Add Room Category' }}</h2>
          <button @click="categoryStore.closeModel()">✖️</button>
        </div>
        <!-- {{ categoryStore.record }} -->
        <div class="space-y-4">
          <div>
            <label class="block">Name:</label>
            <input v-model="categoryStore.record.name" type="text" class="w-full border rounded px-3 py-1" />
          </div>
          <div>
            <label class="block">Facility:</label>
            <input v-model="categoryStore.record.facility" type="text" class="w-full border rounded px-3 py-1" />
          </div>
          <div>
            <label class="block">Description:</label>
            <input v-model="categoryStore.record.description" type="text" class="w-full border rounded px-3 py-1" />
          </div>
          <div>
            <label class="block">Normal Rent:</label>
            <input v-model="categoryStore.record.normalRent" type="number" class="w-full border rounded px-3 py-1" />
          </div>
          <div>
            <label class="block">Patient Rent:</label>
            <input v-model="categoryStore.record.patientRent" type="number" class="w-full border rounded px-3 py-1" />
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button @click="categoryStore.closeModel()" class="btn btn-secondary mr-2">Close</button>
          <button v-if="!categoryStore.editMode" @click="saveRoomCategory" class="btn btn-primary"> Save</button>
          <button v-else @click="updateRoomCategory" class="btn btn-primary">Update</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useFetch } from '#app'
import { useModalStore } from '@/stores/cetegory'

const categoryStore = useModalStore()

// let newRoom = reactive(categoryStore.record)

async function saveRoomCategory() {
  const { name, facility, description, normalRent, patientRent } = categoryStore.record
  categoryStore.editMode = false
  // Call the backend to save data
  const { data, error } = await useFetch('/api/rooms/category', {
    method: 'POST',
    body: { name, facility, description, normalRent, patientRent }
  })

  if (error.value) {
    alert('Failed to save category')
  } else {
    alert('Room category added successfully!')
    categoryStore.closeModel()
    // Reset form fields
    // newRoom = {
    //   name: '',
    //   facility: '',
    //   description: '',
    //   normalRent: null,
    //   patientRent: null
    // }
  }
}

async function updateRoomCategory() {
  const { error } = await useFetch(`/api/rooms/category/${categoryStore.editId}`, {
    method: 'PUT',
    body: JSON.stringify(categoryStore.record),
    headers: { 'Content-Type': 'application/json' }
  })

  if (error.value) {
    alert('Failed to update record')
  } else {
    alert('Record updated successfully')
  }

  categoryStore.setEditMode(false)
  categoryStore.closeModel()
}
</script>

<style>
.btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition;
}
</style>
