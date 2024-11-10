<template>
  <div>
    <!-- Add Room Modal -->
    <div v-if="roomStore.showModal" id="roomadd" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg w-100 modal">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">{{ roomStore.editMode ? 'Edit Room' : 'Add Room' }}</h2>
          <button @click="roomStore.closeModel()">✖️</button>
        </div>
        <!-- {{ roomStore.record }} -->
        <form @submit.prevent="void">
          <div class="grid grid-cols-3 gap-5">
            <div v-for="(field, index) in roomFields" :key="index" class="mb-4">
              <label :for="field.name" class="block font-semibold mb-1">{{ field.label }}</label>
              <input
                v-if="field.type !== 'select'"
                :type="field.type"
                :id="field.name"
                v-model="roomStore.record[field.name]"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                :placeholder="field.placeholder"
              />
              <select
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                required
                :id="field.name"
                v-model="roomStore.record[field.name]"
                v-if="field.type === 'select' && field.name === 'roomCategory'"
              >
                <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                <!-- <option v-for="option in field.options" :key="option.id" :value="option.id">{{ option.name }}</option> -->
              </select>
              <!-- {{ categories }} -->
              <select
                v-if="field.type === 'select' && field.name != 'roomCategory'"
                :id="field.name"
                v-model="roomStore.record[field.name]"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              >
                <option v-for="(option, index) in field.options" :key="option" :value="index">{{ option }}</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <button @click="roomStore.closeModel()" class="btn btn-secondary mr-2">Close</button>
            <button v-if="!roomStore.editMode" @click="save" class="btn btn-primary"> Save</button>
            <button v-else @click="update" class="btn btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
// import { reactive } from 'vue'
import { useFetch } from '#app';
import { useRoomModalStore } from '@/stores/room';

const roomStore = useRoomModalStore();

// const form = roomStore.record;
const categories = ref([]);
const error = ref('');

onMounted(async () => {
  try {
    const cat_response = await $fetch('/api/rooms/category/all_categories');
    categories.value = cat_response; // Adjust to match the response structure
  } catch (err) {
    error.value = err.message;
    console.log('Error fetching records:', err);
  }
});
// let newRoom = reactive(roomStore.record)

async function save() {
  // const { name, facility, description, normalRent, patientRent } = roomStore.record
  roomStore.editMode = false;
  // Call the backend to save data
  const { data, error } = await useFetch('/api/rooms/room', {
    method: 'POST',
    body: roomStore.record
  });

  if (error.value) {
    alert('Failed to save room');
  } else {
    alert('room category added successfully!');
    roomStore.closeModel();
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

async function update() {
  const { error } = await useFetch(`/api/rooms/room/${roomStore.editId}`, {
    method: 'PUT',
    body: JSON.stringify(roomStore.record),
    headers: { 'Content-Type': 'application/json' }
  });

  if (error.value) {
    alert('Failed to update record');
  } else {
    alert('Record updated successfully');
  }

  roomStore.setEditMode(false);
  roomStore.closeModel();
}

const roomFields = [
  // { name: 'name', label: 'Room Name', type: 'text', placeholder: 'Enter room name' },
  { name: 'roomCategory', label: 'Room Category', type: 'select', options: categories },
  { name: 'floorNumber', label: 'Floor', type: 'number', placeholder: 'Floor number' },
  { name: 'roomNumber', label: 'Room Number', type: 'number', placeholder: 'Room number' },
  { name: 'guestCapacity', label: 'Capacity', type: 'number', placeholder: 'Number of guests' },
  { name: 'amenities', label: 'Amenities', type: 'text', placeholder: 'E.g., WiFi, TV, AC' },
  // { name: 'isBooked', label: 'Room Status', type: 'select', options: { 0: 'Vacated', 1: 'Occupied' } },
  // { name: 'price', label: 'Price per Night', type: 'number', placeholder: 'Room price' },
  { name: 'roomStatus', label: 'Availability', type: 'select', options: { Available: 'Available', Unavailable: 'Unavailable' } },
  { name: 'remarks', label: 'Description', type: 'textarea', placeholder: 'Room description' }
];
</script>

<style>
.btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition;
}
</style>
