<script setup lang="ts">
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';
// import DataTablesCore from 'datatables.net';
import 'datatables.net-responsive';
import 'datatables.net-select';
 
DataTable.use(DataTablesCore);
 
const columns = [
  { data: 'name', title: 'Name' },
  { data: 'position', title: 'Position' },
  { data: 'office', title: 'Office' },
  { data: 'extn', title: 'Extension' },
  { data: 'start_date', title: 'Start date' },
  { data: 'salary', title: 'Salary' },
];
 
const options = {
  responsive: true,
  select: true,
};
</script>
 
<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" 
        rel="stylesheet" 
        integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" 
        crossorigin="anonymous"
   >
    <DataTable
        :columns="columns"
        :options="options"
        ajax="/api/rooms/"
        class="display nowrap"
    />
    
</template>
<style lang="css">
a {
  text-decoration: unset !important; 
  color: unset !important;
}
</style>