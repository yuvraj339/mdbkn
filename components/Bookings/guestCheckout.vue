<script setup>
import { ref, computed, watch } from 'vue';
import { useFetch } from '#app';

const rooms = ref([]);
const selectedRoom = ref('');
const checkoutDate = ref('');
const roomDetails = ref(null);
const guestDetails = ref(null);
const description = ref('');

const totalDays = computed(() => {
  if (!guestDetails.value || !checkoutDate.value) return 0;
  const checkin = new Date(guestDetails.value.checkinDate);
  const checkout = new Date(checkoutDate.value);
  return Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
});

const remainingPayment = computed(() => {
  if (!guestDetails.value || !roomDetails.value) return 0;
  const roomPrice = roomDetails.value.price;
  const totalAmount = totalDays.value * roomPrice;
  return totalAmount - guestDetails.value.advancePayment;
});

// Fetch room list (replace with actual API endpoint)
const all_rooms = await $fetch('/api/rooms/room/unavailable');
rooms.value = all_rooms || [];

// Fetch room details and guest details based on selected room
const fetchRoomDetails = async () => {
  if (!selectedRoom.value) return;

  // Replace with actual API calls to get room and guest details
  const roomResponse = await $fetch(`/api/rooms/room/${selectedRoom.value}`);
  roomDetails.value = roomResponse || {};

  const guestResponse = await $fetch(`/api/bookings/booking/${selectedRoom.value}`);
  guestDetails.value = guestResponse || {};
};

// Calculate stay details on checkout date change
const calculateStayDetails = () => {
  // Trigger recalculation
};

// Checkout action
const checkoutRoom = async () => {
  if (!selectedRoom.value || !checkoutDate.value) return;

  // API call to mark room as checked out (replace with actual endpoint)
  await $fetch(`/api/bookings/checkout`, {
    method: 'POST',
    body: {
      checkOutTime: checkoutDate.value,
      remark: description.value,
      payment: remainingPayment.value,
      roomId: selectedRoom.value
    }
  });

  alert('Checkout completed successfully!');
  // Reset form after successful checkout
  selectedRoom.value = '';
  checkoutDate.value = '';
  roomDetails.value = null;
  guestDetails.value = null;
  description.value = '';
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 bg-white shadow rounded">
    <h2 class="text-2xl font-semibold mb-4">Final Checkout</h2>

    <!-- Checkout Date -->
    <div class="mb-4">
      <label class="block font-medium mb-1">Select Checkout Date:</label>
      <input type="date" v-model="checkoutDate" @change="calculateStayDetails" class="w-full p-2 border rounded" />
    </div>
    <!-- Room Number Selector -->
    <div class="mb-4">
      <label class="block font-medium mb-1">Select Room Number:</label>
      <select v-model="selectedRoom" @change="fetchRoomDetails" class="w-full p-2 border rounded">
        <option value="" disabled>Select Room</option>
        <option v-for="room in rooms" :key="room.id" :value="room.id"> Room {{ room.roomNumber }} </option>
      </select>
    </div>

    <!-- Room Details -->
    <div class="mb-4 grid grid-cols-2 gap-5">
      <div v-if="roomDetails && roomDetails[0]">
        <h3 class="font-semibold">Room Details:</h3>
        <p
          >Room Category: <strong class="text-gray-700">{{ roomDetails[0].name }}</strong></p
        >
        <p
          >Room Normal Price: <strong class="text-gray-700">{{ roomDetails[0].normalRent }}</strong> per night</p
        >
        <p
          >Room Patient Price: <strong class="text-gray-700">{{ roomDetails[0].patientRent }}</strong> per night</p
        >
      </div>

      <!-- Guest and Payment Details -->
      <div v-if="guestDetails">
        <h3 class="font-semibold">Guest Details:</h3>
        <p>Guest Name: {{ guestDetails.name }}</p>
        <p>Check-in Date: {{ guestDetails.checkinDate }}</p>
        <p>Advance Payment: {{ guestDetails.advancePayment }}</p>
        <p>Total Days: {{ totalDays }}</p>
        <p>Remaining Payment: {{ remainingPayment }}</p>
      </div>
    </div>

    <!-- Description Box -->
    <div class="mb-4">
      <label class="block font-medium mb-1">Description:</label>
      <textarea v-model="description" class="w-full p-2 border rounded" rows="3"></textarea>
    </div>

    <!-- Submit Button -->
    <button @click="checkoutRoom" class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"> Complete Checkout </button>
  </div>
</template>
