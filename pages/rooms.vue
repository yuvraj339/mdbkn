<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <!-- Header and Actions -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Rooms</h1>
      <div class="flex space-x-4">
        <!-- <button @click="exportData('pdf')" class="btn btn-primary">Export PDF</button>
          <button @click="exportData('excel')" class="btn btn-primary">Export Excel</button> -->
        <button @click="roomStore.toggleModal()" class="btn btn-primary">Add Room +</button>
      </div>
    </div>

    <RoomTable />
  </div>
</template>

<script setup lang="ts">
import RoomTable from '@/components/Rooms/table.vue';
import { useRoomModalStore } from '@/stores/room';
const roomStore = useRoomModalStore();

// function add() {
//   Store.toggleModal();
// }

// function exportData(format) {
//     alert(`Exporting as ${format}`)
// }
</script>

<style>
.btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition;
}
</style>
