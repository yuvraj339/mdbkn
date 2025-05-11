<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <!-- Header and Actions -->
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Bookings</h1>
      <div class="flex space-x-4">
        <!-- <button @click="exportData('pdf')" class="btn btn-primary">Export PDF</button>
          <button @click="exportData('excel')" class="btn btn-primary">Export Excel</button> -->
        <BookingsAdvancePaymentModal />
        <button @click="add" class="btn btn-primary">Add Booking +</button>
      </div>
    </div>

    <BookingsTable />
  </div>
</template>

<script setup lang="ts">
// import RoomTable from '@/components/Bookings/table.vue'
import { useBookingModalStore } from '@/stores/booking';
const Store = useBookingModalStore();

function add() {
  Store.toggleModal();
}

// function exportData(format) {
//     alert(`Exporting as ${format}`)
// }
</script>

<style>
.btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition;
}
</style>
