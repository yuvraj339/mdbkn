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
let fromDate = ref(new Date().toISOString().split("T")[0]);
let toDate = ref(new Date().toISOString().split("T")[0]);
let roomStatus = ref('Unavailable');
let apiUrl = ref('/api/bookings/booking');
// const bookingStore = useBookingModalStore();
onMounted(async () => {
  await fetchLatestData()
});
async function fetchLatestData() {
  try {
    let endPoint = '/api/dashboard/alldata';
    if (fromDate.value){
      endPoint = `/api/dashboard/alldata?fromDate=${fromDate.value}&toDate=${toDate.value}`;
    }
    const response = await $fetch(endPoint);

    console.log('response:', response);
    dashboardData.value = response
  } catch (err) {
    error.value = err.message;
    console.log('Error fetching records:', err);
  }
}
async function showData(relatedTo) {
  selectedCard.value = relatedTo

  if(selectedCard.value == 'roomBooked') {
      apiUrl.value = '/api/bookings/booking?fromDate=' + fromDate.value + '&toDate=' + toDate.value + '&type=' + selectedCard.value
  }  else if(selectedCard.value == 'currentBookings' || selectedCard.value == 'dueBalance' || selectedCard.value == 'cashBook') {
      apiUrl.value = '/api/bookings/booking?fromDate=' + fromDate.value + '&toDate=' + toDate.value + '&status=' + roomStatus.value + '&type=' + selectedCard.value
  }  else {
      apiUrl.value = '/api/bookings/booking'
  }
}
// const bookingChild = ref(null);

// const bookingChild = ref(null);
function setFilter() {
  selectedCard.value = 'currentBookings'
}
</script>
<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <div>
      <div class="grid grid-cols-3 gap-5 p-4 border border-gray-200">
        <div class="mb-4 grid grid-cols-2 gap-5">
          <div>
            <label class="font-medium mb-1">From:</label>
            <input type="date" v-model="fromDate" class="w-full p-2 border rounded" />
          </div>
          <div>
            <label class="font-medium mb-1">To:</label>
            <input type="date" v-model="toDate" class="w-full p-2 border rounded" />
          </div>
        </div>
        <div class="mb-4 w-[200px]">
          <label class="font-medium mb-1">Room Status:</label>
          <select class="w-full px-3 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200" v-model="roomStatus">
            <option key="available" value="both">Both</option>
            <option key="unavailable" value="Unavailable">Check-in</option>
            <option key="available" value="Available">Check-out</option>
            <option key="advance" value="advance">Check-in + Advance</option>
            <option key="dayBook" value="dayBook">Day Book</option>
            <!-- <option v-for="option in field.options" :key="option.id" :value="option.id">{{ option.name }}</option> -->
          </select>
        </div>
        <div class="mb-4 m-2 flex justify-between items-center mt-5">
          <div class="">
            <!-- <button @click="setFilter" class="bg-gray-500 hover:bg-gray-600 text-white py-2 px-2 rounded-lg">Search</button> -->
          </div>
          <div class="">
            <BookingsAdvancePaymentModal />
          </div>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-6 p-4">
        <div
          class="bg-yellow-400 text-white p-6 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105"
          :class="{ 'scale-110 border-solid border-2 border-gray-700': selectedCard == 'currentBookings' }"
          @click="showData('currentBookings')"
        >
          <h3 class="text-2xl font-bold">{{ dashboardData.currentBookings }}</h3>
          <p>Bookings</p>
        </div>
        <div
          class="bg-blue-300 text-white p-6 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105"
          :class="{ 'scale-110 border-solid border-2 border-gray-700': selectedCard == 'roomDatabase' }"
          @click="showData('roomDatabase')"
        >
          <h3 class="text-2xl font-bold">{{ dashboardData.roomDatabase }}</h3>
          <p>Rooms</p>
        </div>
        <!-- <div class="bg-gray-500 text-white p-6 rounded shadow cursor-pointer" @click="showData('todayBookings')">
        <h3 class="text-2xl font-bold">{{ dashboardData.todayBookings }}</h3>
        <p>Booking</p>
      </div> -->
        <div
          class="bg-teal-400 text-white p-6 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105"
          :class="{ 'scale-110 border-solid border-2 border-gray-700': selectedCard == 'roomBooked' }"
          @click="showData('roomBooked')"
        >
          <h3 class="text-2xl font-bold">{{ dashboardData.roomBooked }}</h3>
          <p>Booked Rooms</p>
        </div>
        <div
          class="bg-orange-400 text-white p-6 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105"
          :class="{ 'scale-110 border-solid border-2 border-gray-700': selectedCard == 'cashBook' }"
          @click="showData('cashBook')"
        >
          <span class="flex"
            ><h3 class="text-2xl font-bold mr-1">{{ parseInt(dashboardData.todayCheckouts) + parseInt(dashboardData.todayBookings) }}</h3></span
          >
          <p>Cash Book</p>
        </div>
        <div
          class="bg-green-400 text-white p-6 rounded-2xl shadow-lg cursor-pointer transition-transform hover:scale-105"
          :class="{ 'scale-110 border-solid border-2 border-gray-700': selectedCard == 'dueBalance' }"
          @click="showData('dueBalance')"
        >
          <h3 class="text-2xl font-bold">₹{{ dashboardData.dueBalance.dueAmount }}</h3>
          <p>Due Balance</p>
          <!-- <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
          <div><span class="font-medium">Days:</span> {{ dashboardData.dueBalance.totalDays }}</div>
          <div><span class="font-medium">Rent:</span> ₹{{ dashboardData.dueBalance.totalRent }}</div>
          <div><span class="font-medium">Advance:</span> ₹{{ dashboardData.dueBalance.totalAdvance }}</div>
          <div
            ><span class="font-medium">Due Amount:</span> <span class="font-bold"> ₹{{ dashboardData.dueBalance.dueAmount }}</span></div
          >
        </div> -->
        </div>
      </div>
    </div>

    <div>
      <RoomsTable v-if="selectedCard == 'roomDatabase'" />
      <BookingsTable ref="bookingChild" v-else :api_url="apiUrl" />
    </div>
  </div>
</template>
