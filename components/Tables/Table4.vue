<template>
  <div class="p-4">
    <!-- Search Box -->
    <div class="mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Search..."
        class="p-2 border border-gray-300 rounded"
      />
    </div>

    <!-- Records per page -->
    <div class="mb-4">
      <label for="perPage">Records per page:</label>
      <select v-model="perPage" id="perPage" class="ml-2 p-2 border border-gray-300 rounded">
        <option v-for="option in perPageOptions" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>

    <!-- Table -->
    <table class="min-w-full table-auto">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" @click="sortBy(header.key)">
            <button class="px-4 py-2 text-left">
              {{ header.label }}
              <span v-if="sortKey === header.key">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in paginatedRecords" :key="record.id">
          <td v-for="header in headers" :key="header.key">{{ record[header.key] }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Previous
      </button>

      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';


// Data properties
const records = ref([]);
const search = ref("");
const perPage = ref(10);
const currentPage = ref(1);
const sortKey = ref(null);
const sortOrder = ref(null);
const headers = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" }
];
// const records = ref([
//   { id: 1, name: "John Doe", email: "john@example.com" },
//   { id: 2, name: "Jane Doe", email: "jane@example.com" },
//   { id: 3, name: "Alice Smith", email: "alice@example.com" }
//   // Add more records as needed
// ]);

// Fetch records from the API when the component mounts
onMounted(async () => {
  try {
    const { data } = await useFetch('/api/records');
    records.value = data.value['rows'];
  } catch (error) {
    console.error('Error fetching records:', error);
  }
});
const perPageOptions = [1, 5, 10, 15, 20];

// Computed properties
const filteredRecords = computed(() => {
  return records.value
    .filter(record =>
      Object.values(record).some(val =>
        String(val).toLowerCase().includes(search.value.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (!sortKey.value) return 0;
      const order = sortOrder.value === "asc" ? 1 : -1;
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
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
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

th, td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}

th button {
  width: 100%;
  text-align: left;
}
</style>
