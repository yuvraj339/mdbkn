<template>
  <div>
    <TablesTableUtil :headers="headers" :apiURL="api_url" :store="expencesStore" ref="tableChild"></TablesTableUtil>
  </div>
</template>

<script setup>
import { useExpencesModalStore } from '@/stores/expences';
const expencesStore = useExpencesModalStore();

const tableChild = ref(null);

const refreshTableChildren = () => {
  alert(1);
  tableChild.value.fetchData();
};
const props = defineProps({
  api_url: {
    type: String,
    default: '/api/expences' // Set your default URL here
  }
});
// const api_url = ;
const headers = [
  { key: 'id', label: 'ID' },
  { key: 'staffSalary', label: 'Staff Salary' },
  { key: 'lightBill', label: 'Light Bill' },
  { key: 'waterBill', label: 'Water Bill' },
  { key: 'voucher', label: 'Voucher' },
  { key: 'extraExpenditure', label: 'Extra Expenditure' },
  { key: 'actions', label: ['delete'] }
];
</script>
