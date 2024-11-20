<script lang="js" setup>
import { ref } from 'vue';

const error = ref('');
let dashboardData = ref({
  currentBookings: 0,
  roomDatabase: 0,
  todayBookings: 0,
  roomBooked: 0,
  todayCheckouts: 0,
  dueBalance: 0
});

let selectedCard = ref('currentBookings');
let selectedDate = ref(new Date().toISOString().split("T")[0]);
let roomStatus = ref('unavailable');
// const bookingStore = useBookingModalStore();
onMounted(async () => {
  try {
    const response = await $fetch('/api/dashboard/alldata');
    // const cat_response = await $fetch('/api/rooms/category/all_categories');
    // categories.value = cat_response; // Adjust to match the response structure
    // rooms.value = room_response; // Adjust to match the response structure
    console.log('response:', response);
    dashboardData.value = response
  } catch (err) {
    error.value = err.message;
    console.log('Error fetching records:', err);
  }
});

async function showData(relatedTo) {
  // alert(relatedTo)
  selectedCard.value = relatedTo
  // try {
  //   const response = await $fetch(`/api/dashboard/${relatedTo}`);
  //   // const cat_response = await $fetch('/api/rooms/category/all_categories');
  //   // categories.value = cat_response; // Adjust to match the response structure
  //   // rooms.value = room_response; // Adjust to match the response structure
  //   console.log('response:', response);
  //   // dashboardData.value = response
  // } catch (err) {
  //   error.value = err.message;
  //   console.log('Error fetching records:', err);
  // }
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">Welcome to Maheshwari Dharamshala</h2>
    <div class="grid grid-cols-3 gap-6">
      <div class="bg-yellow-400 text-white p-6 rounded shadow cursor-pointer" @click="showData('currentBookings')">
        <h3 class="text-2xl font-bold">{{ dashboardData.currentBookings }}</h3>
        <p>Current Bookings</p>
      </div>
      <div class="bg-blue-300 text-white p-6 rounded shadow cursor-pointer" @click="showData('roomDatabase')">
        <h3 class="text-2xl font-bold">{{ dashboardData.roomDatabase }}</h3>
        <p>Room Database</p>
      </div>
      <div class="bg-gray-500 text-white p-6 rounded shadow cursor-pointer" @click="showData('todayBookings')">
        <h3 class="text-2xl font-bold">{{ dashboardData.todayBookings }}</h3>
        <p>Today Booking</p>
      </div>
      <div class="bg-teal-400 text-white p-6 rounded shadow cursor-pointer" @click="showData('roomBooked')">
        <h3 class="text-2xl font-bold">{{ dashboardData.roomBooked }}</h3>
        <p>Room Booked</p>
      </div>
      <div class="bg-green-400 text-white p-6 rounded shadow cursor-pointer" @click="showData('todayCheckouts')">
        <h3 class="text-2xl font-bold">{{ dashboardData.todayCheckouts }}</h3>
        <p>Today's Checkout</p>
      </div>
      <div class="bg-pink-400 text-white p-6 rounded shadow cursor-pointer" @click="showData('dueBalance')">
        <h3 class="text-2xl font-bold">{{ dashboardData.dueBalance }}</h3>
        <p>Due Balance</p>
      </div>
    </div>
    <div>
      <BookingsTable v-if="selectedCard == 'currentBookings'" />
      <RoomsTable v-if="selectedCard == 'roomDatabase'" />
      <BookingsTable v-if="selectedCard == 'todayBookings'" :api_url="`/api/bookings/booking?date=${selectedDate}`" />
      <RoomsTable v-if="selectedCard == 'roomBooked'" :api_url="`/api/rooms/room/${roomStatus}`" />
      <BookingsTable v-if="selectedCard == 'todayCheckouts'" :api_url="`/api/bookings/booking?date=${selectedDate}&status=checkout`" />
    </div>
  </div>
</template>
