<template>
  <!-- Add checkout Modal -->
  <div v-if="checkoutStore.showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg w-8/12 modal">
      <!-- {{ checkoutStore.record }} -->
      <div class="space-y-4">
        <BookingsCheckoutForm />

        <!-- <div class="flex justify-end mt-4">
          <button @click="checkoutStore.closeModel()" class="btn btn-secondary mr-2">Close</button>
          <button v-if="!checkoutStore.editMode" @click="save" class="btn btn-primary"> Save</button>
          <button v-else @click="update" class="btn btn-primary">Update</button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { reactive } from 'vue';
// import { useFetch } from '#app';
import { useCheckoutModalStore } from '@/stores/checkout';

const checkoutStore = useCheckoutModalStore();
</script>

<style>
.btn {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition;
}

.btn-secondary {
  @apply px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition;
}
</style>
