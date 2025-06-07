<template>
  <div class="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">Edit Checkout ( {{ form.roomNumber }} )</h2>

      <button @click="checkoutStore.closeModel()">✖️</button>
    </div>
    <!-- <h2 class="text-1xl font-bold mb-6">Add Checkout/Canteen</h2> -->

    <form @submit.prevent="createCheckout">
      <!-- Guest Information -->

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Receipt No </label>
          <input type="number" v-model="form.booking_receipt_number" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
          <input type="text" v-model="form.guestName" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
          <input type="datetime-local" v-model="form.checkInTime" class="input-field" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
          <input type="datetime-local" v-model="form.checkOutTime" class="input-field" required />
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <!-- <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
          <input type="number" v-model="form.roomNumber" class="input-field" />
        </div> -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Aminity +</label>
          <input type="number" v-model="form.amenities" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Payment </label>
          <input type="number" v-model="form.received" class="input-field" />
        </div>
      </div>

      <!-- <button type="submit" class="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Create Booking</button> -->
      <button @click="checkoutStore.closeModel()" class="btn btn-secondary mr-2 py-2">Close</button>
      <button @click="update" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Update Checkout</button>
    </form>
  </div>
</template>

<script setup>
import { useCheckoutModalStore } from '@/stores/checkout';

import { useRouter } from 'vue-router';

const router = useRouter();
const checkoutStore = useCheckoutModalStore();
const form = ref(checkoutStore.record);

async function update() {
  const formData = new FormData();

  // Append all form fields to FormData
  Object.keys(form.value).forEach((key) => {
    formData.append(key, form.value[key]);
  });

  const response = await $fetch(`/api/bookings/booking/${checkoutStore.editId}`, {
    method: 'POST',
    body: formData,
    headers: {}
  });
  console.log(response.success, 'response');

  if (response.success) {
    // Handle successful response
    alert(response.message); // Log the success message
    // Perform any necessary actions like updating the UI or redirecting
    checkoutStore.setEditMode(false);
    checkoutStore.closeModel();
    router.go(0);
  } else {
    // Handle unsuccessful response
    alert(response.message); // Log the error message
    // Display an error message to the user or take other appropriate actions
  }
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent;
}
.zoomable {
  width: 200px;
  transition: transform 0.5s ease;
}

#img1:target {
  transform: scale(7);
}

.close {
  display: none;
}
</style>
