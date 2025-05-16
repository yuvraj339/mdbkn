<script setup>
import { ref, computed, onMounted } from 'vue';
// import { useFetch } from '#app';

const rooms = ref([]);
const selectedRoom = ref('');
const checkoutDate = ref('');
const roomDetails = ref(null);
// const guestDetails = ref(null);
const roomPrice = ref(0);
const description = ref('');
const payment = ref('0');
let totalDays = ref(0);
let totalAmount = ref(0);
let amenities = ref(0);
let booking_receipt_number = ref(null);
let advance_paid = ref(0);

// = computed(() => {
//   if (!guestDetails.value || !checkoutDate.value) return 0;
//   const checkin = new Date(guestDetails.value.checkinDate);
//   const checkout = new Date(checkoutDate.value);
//   return Math.ceil((checkout - checkin) / (1000 * 60 * 60 * 24));
// });

const remainingPayment = computed(() => {
  if (!roomDetails.value) return 0;
  const advancePayment = roomDetails.value.payment;
  totalAmount.value = amenities.value + totalDays.value * roomPrice.value;
  const rmp = totalAmount.value - (parseFloat(advancePayment) + advance_paid.value);
  payment.value = rmp;
  return rmp;
});
// await $fetch('/api/migrations');
// Fetch room list (replace with actual API endpoint)
onMounted(async () => {
  await fetchRoomList();
  // await fetchRoomDetails();
});
async function fetchRoomList() {
  const { rows } = await $fetch('/api/rooms/room/unavailable');
  rooms.value = rows || [];
}

// Fetch room details and guest details based on selected room
const fetchRoomDetails = async () => {
  if (!selectedRoom.value) return;

  // Replace with actual API calls to get room and guest details
  const roomResponse = await $fetch(`/api/rooms/room/${selectedRoom.value}`);
  roomDetails.value = roomResponse.rows || {};
  advance_paid.value = roomResponse.advance_paid || 0;
  roomPrice.value = roomDetails.value.patientType === 'cancer' ? roomDetails.value.patientRent : roomDetails.value.normalRent;
};

// Calculate stay details on checkout date change
const calculateStayDetails = (checkinDate) => {
  if (checkinDate && checkoutDate) {
    // Convert to Date objects
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate.value);

    // If the checkout date is the same as the check-in date
    if (checkin.getFullYear() === checkout.getFullYear() && checkin.getMonth() === checkout.getMonth() && checkin.getDate() === checkout.getDate()) {
      totalDays.value = 1;
    } else {
      // If checkout date is the next day and time is after 11:00 AM
      const nextDay = new Date(checkin);
      nextDay.setDate(nextDay.getDate() + 1);

      if (nextDay.getFullYear() === checkout.getFullYear() && nextDay.getMonth() === checkout.getMonth() && nextDay.getDate() === checkout.getDate() && checkout.getHours() >= 11) {
        totalDays.value = 2;
      } else {
        // General case for difference in days
        const differenceInTime = checkout - checkin;
        totalDays.value = Math.ceil(differenceInTime / (1000 * 60 * 60 * 24));
      }
    }
  }
};
// import { useRouter } from 'vue-router';

// const router = useRouter();

const checkoutRoom = async () => {
  if (!selectedRoom.value || !checkoutDate.value) {
    alert('Please select room and checkout date');
    return;
  }

  // API call to mark room as checked out (replace with actual endpoint)
  await $fetch(`/api/bookings/checkout`, {
    method: 'POST',
    body: {
      checkOutTime: checkoutDate.value,
      remark: description.value,
      payment: payment.value,
      room: selectedRoom.value,
      amenities: amenities.value,
      booking_receipt_number: booking_receipt_number.value
    }
  });

  alert('Checkout completed successfully!');
  // Reset form after successful checkout
  selectedRoom.value = '';
  checkoutDate.value = '';
  remainingPayment.value = 0;
  totalAmount.value = 0;
  amenities.value = 0;
  booking_receipt_number.value = null;
  roomDetails.value = null;
  payment.value = 0;
  description.value = '';
  // router.go(0);
  fetchRoomList();
};
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 bg-white shadow rounded">
    <h2 class="text-2xl font-semibold mb-4">Final Checkout</h2>

    <!-- Room Number Selector -->
    <div class="mb-4">
      <label class="block font-medium mb-1">Select Room Number:</label>
      <select v-model="selectedRoom" @change="fetchRoomDetails" class="w-full p-2 border rounded">
        <option value="" disabled>Select Room</option>
        <option v-for="room in rooms" :key="room.id" :value="room.id"> Room {{ room.roomNumber }} </option>
      </select>
    </div>

    <!-- Room Details -->
    <div class="mb-4 grid grid-cols-2 gap-5 p-7 border border-dashed" v-if="roomDetails && roomDetails">
      <div>
        <h3 class="font-semibold">Room Details:</h3>
        <p
          >Room Category: <strong class="text-gray-700">{{ roomDetails.name }}</strong></p
        >
        <p
          >Room Normal Price: <strong class="text-gray-700">{{ roomDetails.normalRent }}</strong> per night</p
        >
        <p
          >Room Patient Price: <strong class="text-gray-700">{{ roomDetails.patientRent }}</strong> per night</p
        >
      </div>

      <!-- Guest and Payment Details -->
      <div>
        <h3 class="font-semibold">Guest Details:</h3>
        <p
          >Guest Name: <strong class="text-gray-700">{{ roomDetails.guestName }}</strong></p
        >
        <p
          >Check-in Date: <strong class="text-gray-700">{{ roomDetails.checkInTime }}</strong></p
        >
        <p
          >Initial Paid: <strong class="text-gray-700">{{ roomDetails.payment }}</strong></p
        >
        <p
          >Total Days: <strong class="text-gray-700">{{ totalDays }}</strong></p
        >
        <p
          >Total Payment: <strong class="text-gray-700">{{ totalAmount }}</strong></p
        >
        <p
          >Advance Paid: <strong class="text-gray-700">{{ advance_paid }}</strong></p
        >
        <p
          ><span v-if="remainingPayment < 0"> Refund Amount </span>
          <span v-else> Remaining Payment: </span>
          <strong class="text-gray-700">{{ remainingPayment }}</strong></p
        >
      </div>
    </div>

    <!-- Checkout Date -->
    <div class="grid grid-cols-2 gap-5" v-if="roomDetails && roomDetails">
      <div class="mb-4">
        <label class="block font-medium mb-1">Select Checkout Date:</label>
        <input type="datetime-local" v-model="checkoutDate" @change="calculateStayDetails(roomDetails.checkInTime)" class="w-full p-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Select room Type</label>
        <div class="flex items-center space-x-4">
          <label class="flex items-center">
            <input type="radio" v-model="roomPrice" :value="roomDetails.normalRent" class="mr-2" />
            Normal Price
          </label>
          <label class="flex items-center">
            <input type="radio" v-model="roomPrice" :value="roomDetails.patientRent" class="mr-2" />
            Cancer Patient Price
          </label>
        </div>
      </div>
    </div>
    <!-- Description Box -->
    <div class="grid grid-cols-3 gap-5">
      <div class="mb-4">
        <label class="block font-medium mb-1">Amenities amount:</label>
        <input type="number" v-model="amenities" class="w-full p-2 border rounded" />
      </div>
      <div class="mb-4">
        <label class="block font-medium mb-1">Receipt no:</label>
        <input type="number" v-model="booking_receipt_number" class="w-full p-2 border rounded" />
      </div>
      <div class="mb-4">
        <label class="block font-medium mb-1">Final payment amount:</label>
        <input type="number" v-model="payment" class="w-full p-2 border rounded" />
      </div>
      <!-- <div class="mb-4">
        <label class="block font-medium mb-1">Enter Discount:</label>
        <input type="number" v-model="discount" class="w-full p-2 border rounded" />
      </div> -->
    </div>
    <div class="mb-4">
      <label class="block font-medium mb-1">Description:</label>
      <textarea v-model="description" class="w-full p-2 border rounded" rows="3"></textarea>
    </div>

    <!-- Submit Button -->
    <button @click="checkoutRoom" class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"> Complete Checkout </button>
  </div>
</template>
