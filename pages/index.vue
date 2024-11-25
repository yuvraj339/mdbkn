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
let roomStatus = ref('Unavailable');
// const bookingStore = useBookingModalStore();
onMounted(async () => {
  await fetchLatestData()
});
async function fetchLatestData() {
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
}
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
const bookingChild = ref(null);
function filterData() {
  // debugger
  // await fetchLatestData()
  selectedCard.value = 'currentBookings'
  bookingChild.value.refreshTableChildren()
}
</script>
<template>
  <div>
    <h2 class="text-3xl font-bold mb-6">Welcome to Maheshwari Dharamshala</h2>
    <div>
      <div class="grid grid-cols-3 gap-5 p-5 mt-5 mb-5 border border-gray-200">
        <div class="mb-4">
          <label class="block font-medium mb-1">Select Date:</label>
          <input type="date" v-model="selectedDate" class="w-full p-2 border rounded" />
        </div>
        <div class="mb-4">
          <label class="block font-medium mb-1">Select Room Status:</label>
          <select class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200" v-model="roomStatus">
            <option key="available" value="Available">Available</option>
            <option key="unavailable" value="Unavailable">Unavailable</option>
            <!-- <option v-for="option in field.options" :key="option.id" :value="option.id">{{ option.name }}</option> -->
          </select>
        </div>
        <div class="mb-4">
          <label>&nbsp;</label>
          <button @click="filterData" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 rounded-lg">Set Filter</button>
        </div>
      </div>
    </div>
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
      <BookingsTable v-if="selectedCard == 'roomBooked'" :api_url="`/api/bookings/booking?status=${roomStatus}`" />
      <BookingsTable ref="bookingChild" v-if="selectedCard == 'todayCheckouts'" :api_url="`/api/bookings/booking?date=${selectedDate}&status=checkout`" />
    </div>
  </div>
</template>
