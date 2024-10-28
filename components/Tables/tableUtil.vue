<template>
  <div class="p-4">
    <div v-if="error">
      <p>Error fetching data: {{ error }}</p>
    </div>
    <!-- Search Box -->
    <div v-else>
      <div class="flex justify-between">
        <input v-model="search" type="text" placeholder="Search..." class="p-2 border border-gray-300 rounded mb-4" />
        <div> </div>

        <!-- Records per page -->
        <div>
          <label for="perPage">Records per page:</label>
          <select v-model="perPage" id="perPage" class="ml-2 p-2 border border-gray-300 rounded">
            <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <table class="min-w-full table-auto">
        <thead>
          <tr>
            <th v-for="header in headers" :key="header" @click="sortBy(header.key)" class="text-xs">
              <button class="px-4 py-2 text-left" v-if="header.key != 'actions'">
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
                <button v-if="(header.label = 'edit')" @click="editRecord(record)" class="text-blue-500 mr-2">✏️</button>
                <button v-if="(header.label = 'delete')" @click="deleteRecord(record.id)" class="text-red-500">🗑️</button>
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
import { ref, computed, onMounted } from 'vue';

// Data properties
const records = ref([]);
const search = ref('');
const perPage = ref(10);
const currentPage = ref(1);
const sortKey = ref(null);
const sortOrder = ref(null);
const error = ref(null);
const props = defineProps({
  headers: Array,
  apiURL: String,
  store: Object
});

const editRecord = async (data) => {
  console.log(JSON.parse(JSON.stringify(data)));
  props.store.setRecord(JSON.parse(JSON.stringify(data)));
  props.store.setEditMode(true);
  // setTimeout(() => {
  props.store.showModal = true;
  // }, 1000)

  // await fetchData('PUT', `/api/rooms/${roomId}`, updatedData);
};

const deleteRecord = async (id) => {
  const { data, error } = await useFetch(`${props.apiURL}/${id}`, {
    method: 'DELETE' // Use DELETE method here
  });
  // console.log(data._rawValue.message, error)
  if (error.value) {
    alert('Failed to delete record: ' + props.apiURL);
  } else {
    alert('Record deleted successfully!');
  }
};

onMounted(async () => {
  try {
    const { data } = await useFetch(props.apiURL);
    console.log(data);
    records.value = data.value['rows'];
  } catch (err) {
    error.value = err.message;
    console.error('Error fetching records:', err);
  }
});
const perPageOptions = [1, 5, 10, 15, 20];

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
