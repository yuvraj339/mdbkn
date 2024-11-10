<script setup>
const exportDB = async () => {
  const { data, error } = await $fetch('/api/export');
  console.log(data, err);
};
</script>
<template>
  <div>
    <h2 @click="exportDB">Export Database Backup</h2>
    <AuthProfile />
  </div>
</template>
