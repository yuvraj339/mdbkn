<template>
  <div>
    <button @click="showModal = true" class="bg-blue-600 text-white px-4 py-2 rounded"> Advance Payment </button>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-4xl">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">Advance Payment</h2>
          <button @click="showModal = false" class="text-red-600 text-lg font-bold">✕</button>
        </div>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium">Select Room</label>
              <select v-model="form.roomNumber" class="w-full border px-2 py-1 rounded" @change="getPatientDetails">
                <option value="" disabled>Select Room</option>
                <option v-for="room in rooms" :key="room.id" :value="room.id">Room {{ room.roomNumber }}</option>
              </select>
            </div>

            <div>
              <!-- datetime-local -->
              <label class="block text-sm font-medium">Date</label>
              <input type="date" v-model="form.date" class="w-full border px-2 py-1 rounded" />
            </div>

            <div>
              <label class="block text-sm font-medium">Name</label>
              <input type="text" v-model="form.name" class="w-full border px-2 py-1 rounded" />
            </div>

            <div>
              <label class="block text-sm font-medium">Address</label>
              <input type="text" v-model="form.address" class="w-full border px-2 py-1 rounded" />
            </div>

            <!-- <div>
              <label class="block text-sm font-medium">Card Type</label>
              <input type="text" v-model="form.cardType" class="w-full border px-2 py-1 rounded" />
            </div>

            <div>
              <label class="block text-sm font-medium">Card Number</label>
              <input type="text" v-model="form.cardNumber" class="w-full border px-2 py-1 rounded" />
            </div>

            <div>
              <label class="block text-sm font-medium">Name On Card</label>
              <input type="text" v-model="form.nameOnCard" class="w-full border px-2 py-1 rounded" />
            </div> -->

            <div>
              <label class="block text-sm font-medium">Receipt No.</label>
              <input type="text" v-model="form.receiptNo" class="w-full border px-2 py-1 rounded" />
            </div>
            <div>
              <label class="block text-sm font-medium">Advance Amount</label>
              <input type="number" v-model="form.advanceAmount" class="w-full border px-2 py-1 rounded" />
            </div>

            <!-- <div class="col-span-2">
              <label class="block text-sm font-medium">Remark</label>
              <textarea v-model="form.remark" class="w-full border px-2 py-1 rounded"></textarea>
            </div> -->
          </div>

          <div class="flex justify-between mt-4">
            <div class="space-x-2">
              <button type="button" @click="print" class="bg-gray-400 text-white px-4 py-1 rounded">Print</button>
              <button type="button" @click="submitForm" class="bg-blue-600 text-white px-4 py-1 rounded">Save</button>
              <button type="reset" class="bg-yellow-500 text-white px-4 py-1 rounded">Reset</button>
              <button type="button" @click="showModal = false" class="bg-red-600 text-white px-4 py-1 rounded">Close</button>
            </div>
          </div>
        </form>

        <div class="mt-6">
          <table class="w-full table-auto border border-gray-300 text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="border px-2 py-1 text-left">Party Name</th>
                <th class="border px-2 py-1 text-left">Date</th>
                <th class="border px-2 py-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="roomDetails.length > 0">
                <td class="border px-2 py-1">{{ form.name }}</td>
                <td class="border px-2 py-1">{{ formatDate(roomDetails[0].checkInTime) }}</td>
                <td class="border px-2 py-1 text-right">{{ parseFloat(roomDetails[0].payment).toFixed(2) }}</td>
              </tr>
              <tr v-for="(entry, index) in previousPayments" :key="index">
                <td class="border px-2 py-1">{{ form.name }}</td>
                <td class="border px-2 py-1">{{ formatDate(entry.date) }}</td>
                <td class="border px-2 py-1 text-right">{{ entry.advance_amount.toFixed(2) }}</td>
              </tr>
              <tr class="font-bold border-t">
                <td class="px-4 py-2" colspan="2">Total</td>
                <!-- <td class="px-4 py-2" colspan="2">&nbsp;</td> -->
                <td class="px-4 py-2 text-right"> {{ totalAmount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';

const showModal = ref(false);

const form = reactive({
  roomNumber: null,
  date: new Date().toISOString().slice(0, 16),
  name: '',
  advanceAmount: 0,
  address: '',
  receiptNo: '',
  bookingId: null
});

const rooms = ref([]);
const roomPrice = ref(0);
const error = ref('');
const roomDetails = ref(null);

let previousPayments = ref([]);
let bookingAdvanceAmount = ref(0);

function print() {
  const printWindow = window.open('', '', 'width=800,height=600');
  const tableHTML = `
    <html>
      <head>
        <title>Print</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2>Payment Details of ( ${form.name} )</h2>
        <div style="display: flex; justify-content: space-between;">
          <h5>Print Date & Time: ${new Date().toISOString().split('T')}</h6> 
          <h5>Total Advance Paid: ${totalAmount.value}</h5>
        </div> 
        <table>
          <thead>
            <tr>
              <th>Party Name</th>
              <th>Payment Date</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${previousPayments.value
              .map(
                (record) => `
              <tr>
                <td>${form.name}</td>
                <td>${formatDate(record.date)}</td>
                <td>${record.advance_amount.toFixed(2)}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(tableHTML);
  printWindow.document.close();
  printWindow.focus();
  // printWindow.print();
  // printWindow.close();
}

function formatDate(dateString) {
  if (!dateString) return ''; // Handle empty or null values
  const date = new Date(dateString);
  if (isNaN(date)) return ''; // Handle invalid dates
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-US', options).replace(/\d{1,2}/, (d) => {
    const suffix = d === '1' || d === '21' || d === '31' ? 'st' : d === '2' || d === '22' ? 'nd' : d === '3' || d === '23' ? 'rd' : 'th';
    return d + suffix;
  });
}

const listPayments = async () => {
  const { data, error } = await useFetch('/api/bookings/advance/payment', {
    method: 'GET',
    params: { roomNumber: form.roomNumber, bookingId: form.bookingId }
  });
  console.log('Fetching payments for room:', form.roomNumber);
  console.log('data:', data.value);
  console.log('error:', error);

  if (error.value) {
    console.error('Error fetching payments:', error.value);
    return;
  }

  previousPayments.value = data.value || [];
  return { data, error };
};

onMounted(async () => {
  try {
    const { rows } = await $fetch('/api/rooms/room/unavailable');
    rooms.value = rows; // Adjust to match the response structure
    console.log('rooms:', rooms.value);
  } catch (err) {
    error.value = err.message;
    console.log('Error fetching records:', err);
  }
});

const totalAmount = computed(() => {
  let advancePaymentAmount = parseFloat(bookingAdvanceAmount.value) + previousPayments.value.reduce((sum, row) => sum + parseFloat(row.advance_amount), 0);
  return advancePaymentAmount;
});
const getPatientDetails = async () => {
  console.log(form.roomNumber);
  if (!form.roomNumber) return;

  // Replace with actual API calls to get room and guest details
  const roomResponse = await $fetch(`/api/rooms/room/${form.roomNumber}`);
  roomDetails.value = roomResponse || {};
  if (roomDetails.value.length > 0) {
    form.name = roomDetails.value[0].guestName || '';
    form.bookingId = roomDetails.value[0].id || null;
    form.address = roomDetails.value[0].state + ', ' + roomDetails.value[0].city + ', ' + roomDetails.value[0].tehsil + ', ' + roomDetails.value[0].village || '';
    roomPrice.value = roomDetails.value[0].patientType === 'cancer' ? roomDetails.value[0].patientRent : roomDetails.value[0].normalRent;
    bookingAdvanceAmount.value = roomDetails.value[0].payment || 0;
    listPayments();
  }

  // const guestResponse = await $fetch(`/api/bookings/booking/${selectedRoom.value}`);
  // guestDetails.value = guestResponse || {};
};
const submitForm = async () => {
  if (!form.roomNumber) {
    alert('Please select a room number');
    return;
  }
  const { data, error } = await $fetch('/api/bookings/advance/payment', {
    method: 'POST',
    body: form,
    headers: {}
  });
  listPayments();

  if (error) {
    alert('Failed to save Booking');
  } else {
    alert('Room Booking added successfully!');
    bookingStore.closeModel();
    router.go(0);
  }
};
</script>
