import { ref } from 'vue';

export function useFetchData(apiURLRef) {
  const records = ref([]);
  const other = ref([]);
  const error = ref(null);

  async function fetchData() {
    try {
      const res = await fetch(apiURLRef.value);
      const data = await res.json();
      records.value = data.rows; // Adjust if your API returns differently
      if (data.other) {
        other.value = data.other; // Adjust if your API returns differently
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching records:', err);
    }
  }

  return { records, fetchData, error, other };
}
// const { data } = await useFetch(apiURL);
// records.value = data.value['rows'];
