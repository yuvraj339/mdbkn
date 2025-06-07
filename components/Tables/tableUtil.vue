<template>
  <div class="p-4">
    <div v-if="error">
      <p>Error fetching data: {{ error }}</p>
    </div>
    <!-- Search Box -->
    <div v-else>
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <!-- Search Input -->
        <input v-model="search" type="text" placeholder="Search..." class="p-2 border border-gray-300 rounded w-full md:w-1/3" />

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 w-full md:w-auto justify-center">
          <button @click="print" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full sm:w-auto"> Print </button>
          <button @click="exportToPDF" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full sm:w-auto"> Export to PDF </button>
          <button @click="exportToExcel" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg w-full sm:w-auto"> Export to Excel </button>
        </div>

        <!-- Records Per Page Selector -->
        <div class="flex items-center">
          <label for="perPage" class="mr-2">Records per page:</label>
          <select v-model="perPage" id="perPage" class="p-2 border border-gray-300 rounded">
            <option v-for="option in perPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <table class="min-w-full table-auto" ref="pdfContent">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header" @click="sortBy(header.key)" class="text-xs">
              <button class="py-2 text-left" v-if="header.key != 'actions'">
                {{ header.label }}
                <span v-if="sortKey === header.key">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
              </button>
              <div v-else>
                <span v-if="header.label.length">Actions</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in paginatedRecords" :key="record.id">
            <template v-for="header in headers" :key="header.key">
              <td v-if="header.key != 'actions'">{{ record[header.key] }}</td>
              <td v-else>
                <!-- {{ Array.isArray(header.label) }} -->

                <button v-if="header.label.includes('edit')" @click="editRecord(record)" class="text-blue-500 mr-2">✏️</button>
                <button v-if="header.label.includes('delete')" @click="deleteRecord(record.id)" class="text-red-500">🗑️</button>
              </td>
            </template>
          </tr>
          <!-- <tr v-for="action in actions" :key="action">
            
          </tr> -->
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="mt-4 flex justify-between items-center">
        <button @click="prevPage" :disabled="currentPage === 1" class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"> Previous </button>

        <span>Page {{ currentPage }} of {{ totalPages }}</span>

        <button @click="nextPage" :disabled="currentPage === totalPages" class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"> Next </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue';
import { useFetchData } from '@/composables/fetchData';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
// Data properties
// const records = ref([]);
const search = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const sortKey = ref(null);
const sortOrder = ref(null);
// const error = ref(null);
const props = defineProps({
  headers: Array,
  apiURL: String,
  store: Object
});

const apiUrlRef = computed(() => props.apiURL); // make it reactive
const { records, fetchData, error, other } = useFetchData(apiUrlRef);

watch(
  () => props.apiURL,
  () => {
    fetchData(); // call fetchData when apiURL changes
  },
  { immediate: true }
); // run immediately on component mount
const editRecord = async (data) => {
  console.log(JSON.parse(JSON.stringify(data)));
  props.store.setRecord(JSON.parse(JSON.stringify(data)));
  props.store.setEditMode(true);
  // setTimeout(() => {
  props.store.showModal = true;
  // }, 1000)

  // await fetchData('PUT', `/api/rooms/${roomId}`, updatedData);
};

const pdfContent = ref(null);
function getBookingParams() {
  const queryString = props.apiURL.split('?');

  let type = 'currentBookings'; // Default value
  let status = 'both'; // Default value
  let toDate = '';
  let fromDate = '';

  if (queryString.length > 1) {
    const params = new URLSearchParams(queryString[1]);
    type = params.get('type') || type;
    status = params.get('status') || status;
    fromDate = params.get('fromDate') || '';
    toDate = params.get('toDate') || '';
  }

  return { type, status, fromDate, toDate };
}
function exportToPDF() {
  const doc = new jsPDF();
  const { type, status, fromDate, toDate } = getBookingParams();
  // Bookings Table
  let pdfHeaders = [];
  let data = [];
  if (type === 'dueBalance') {
    pdfHeaders = [['Guest Name', 'Patient Name', 'Check In', 'Mobile', 'Room Number', 'Due Amount']];
    data = records.value.map((record) => [
      record.guestName,
      record.patientName,
      formatDate(record.checkInTime),
      record.mobile,
      record.roomNumber,
      record.payment // treated as Due Amount here
    ]);
  } else if (type === 'cashBook') {
    if (status == 'both' || status == 'Available') {
      pdfHeaders = [['Room Number', 'Guest Name', 'Check In', 'Check Out', 'Address', 'Receipt No.', 'Advance', 'Received']];
      data = records.value.map((record) => [
        record.roomNumber,
        record.guestName,
        formatDate(record.checkInTime),
        formatDate(record.checkOutTime),
        record.address,
        record.booking_receipt_number,
        record.totalAdvance,
        record.received
      ]);
    } else {
      pdfHeaders = [['Room Number', 'Guest Name', 'Check In', 'Check Out', 'Address', 'Receipt No.', 'Advance']];
      data = records.value.map((record) => [
        record.roomNumber,
        record.guestName,
        formatDate(record.checkInTime),
        formatDate(record.checkOutTime),
        record.address,
        record.booking_receipt_number,
        record.totalAdvance
      ]);
    }
  } else {
    pdfHeaders = [['Guest Name', 'Patient Name', 'Check In', 'Check Out', 'Mobile', 'City', 'Room Number', 'Payment']];
    data = records.value.map((record) => [
      record.guestName,
      record.patientName,
      formatDate(record.checkInTime),
      formatDate(record.checkOutTime),
      record.mobile,
      record.city,
      record.roomNumber,
      record.payment
    ]);
  }
  autoTable(doc, {
    head: pdfHeaders,
    body: data,
    styles: {
      fontSize: 7 // adjust font size here
    },
    headStyles: {
      fontSize: 8 // optional: header font size
    }
  });

  doc.save(`export_${new Date().toISOString()}.pdf`);
}
function exportToExcel() {
  // Only format checkInTime and checkOutTime if they exist in the record
  records.value = records.value.map((record) => ({
    ...record,
    ...(record.checkInTime && { checkInTime: formatDate(record.checkInTime) }),
    ...(record.checkOutTime && { checkOutTime: formatDate(record.checkOutTime) })
  }));
  const worksheet = XLSX.utils.json_to_sheet(records.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `export_${new Date().toISOString()}.xlsx`);
}

function print() {
  const { type, status, fromDate, toDate } = getBookingParams();

  const printWindow = window.open('', '', 'width=1000,height=700');
  let i = 1;

  const tableHTML = `
    <html>
      <head>
        <title>Print</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            font-size: 12px;
          }
          h2, h4 {
            margin: 5px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            table-layout: auto;
          }
          th, td {
            border: 1px solid #ccc;
            padding: 6px 8px;
            text-align: left;
            vertical-align: top;
          }
          th {
            background-color: #f8f8f8;
            font-size: 13px;
            font-weight: bold;
          }
          td {
            font-size: 12px;
          }
          tbody tr:nth-child(odd) {
            background-color: #f9f9f9;
          }
          .header {
            border-bottom: 2px solid #444;
            margin-bottom: 20px;
            padding-bottom: 10px;
          }

          .header h2 {
            font-size: 18px;
            margin: 0 0 8px;
            color: #333;
          }

          .print-info {
            font-size: 13px;
            margin: 0 0 6px;
            color: #555;
          }

          .summary {
            font-size: 13px;
            color: #444;
            display: flex;
            gap: 30px;
            margin-top: 4px;
          }
          .summary span {
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${type === 'cashBook' ? 'Cash Book' : 'Records'}
              ${fromDate && type !== 'dueBalance' ? `From ${fromDate} to ${toDate}` : ''}
          </h2>
          <p class="print-info">
            Printed On: <strong>${new Date().toLocaleString()}</strong>
          </p>
          ${
            type === 'cashBook' && other.value != null
              ? `<div class="summary">
                  <span><strong>Total Advance:</strong> ${other.value.allAdvance}</span>
                  <span><strong>Payment Received on Checkout:</strong> ${other.value.allReceived}</span>
                </div>`
              : ''
          }
        </div>
        <table>
          <thead>
            <tr>
              <th>S/N</th>
              <th>Room</th>
              <th>Guest Name</th>
              <th>Check In</th>
              ${type === 'cashBook' ? '<th>Check Out</th><th>Address</th><th>Receipt No.</th>' : '<th>Mobile</th><th>Patient Name</th>'}
              ${
                type !== 'dueBalance' && type !== 'cashBook'
                  ? '<th>Ward No</th>'
                  : status === 'both' || status === 'Available'
                  ? '<th>Total Advance</th><th>Received</th>'
                  : '<th>Total Advance</th>'
              }
            </tr>
          </thead>
          <tbody>
            ${records.value
              .map((record) => {
                const commonCols = `
                  <td>${i++}</td>
                  <td>${record.roomNumber}</td>
                  <td>${record.guestName}</td>
                  <td>${formatDate(record.checkInTime)}</td>`;

                const conditionalCols =
                  type === 'cashBook'
                    ? `<td>${formatDate(record.checkOutTime)}</td><td>${record.address}</td><td>${record.booking_receipt_number}</td>`
                    : `<td>${record.mobile}</td><td>${record.patientName}</td>`;

                const additionalCols =
                  type !== 'dueBalance' && type !== 'cashBook'
                    ? `<td>${record.wardNo}</td>`
                    : status === 'both' || status === 'Available'
                    ? `<td>${record.totalAdvance}</td><td>${record.received}</td>`
                    : `<td>${record.totalAdvance}</td>`;

                return `<tr>${commonCols}${conditionalCols}${additionalCols}</tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;

  printWindow.document.write(tableHTML);
  printWindow.document.close();
  printWindow.focus();

  printWindow.print();
  printWindow.close();
}
// Helper function to format date strings
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

const deleteRecord = async (id) => {
  const { data, error } = await useFetch(`${props.apiURL}/${id}`, {
    method: 'DELETE' // Use DELETE method here
  });
  // console.log(data._rawValue.message, error)
  if (error.value) {
    alert('Failed to delete record: ' + props.apiURL);
  } else {
    fetchData();
    alert('Record deleted successfully!');
  }
};

// async function fetchData() {
//   try {
//     const { data } = await useFetch(props.apiURL);
//     records.value = data.value['rows'];
//   } catch (err) {
//     error.value = err.message;
//     console.error('Error fetching records:', err);
//   }
// }

onMounted(() => {
  fetchData(); // Initial fetch when component mounts
});
const perPageOptions = [10, 20, 50, 100, 150];

// Computed properties
const filteredRecords = computed(() => {
  return records.value
    .filter((record) => Object.values(record).some((val) => String(val).toLowerCase().includes(search.value.toLowerCase())))
    .sort((a, b) => {
      if (!sortKey.value) return 0;
      const order = sortOrder.value === 'asc' ? 1 : -1;
      if (a[sortKey.value] < b[sortKey.value]) return -1 * order;
      if (a[sortKey.value] > b[sortKey.value]) return 1 * order;
      return 0;
    });
});

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return filteredRecords.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredRecords.value.length / perPage.value);
});

// Methods
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

th button {
  width: 100%;
  text-align: left;
}
</style>
