import { ref } from 'vue';
import { useFetch } from 'nuxt/app';

export function useFetchData(apiURL) {
  const records = ref([]);
  const error = ref(null);

  async function fetchData() {
    try {
      const { data } = await useFetch(apiURL);
      records.value = data.value['rows'];
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching records:', err);
    }
  }

  return { records, fetchData, error };
}
