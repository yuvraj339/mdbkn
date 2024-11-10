<script setup>
const { exec } = require('child_process');
const exportDB = async () => {
  // const response = await $fetch('/api/export');
  // console.log(response);
  exec('powershell -File .\\stores\\export.ps1', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return res.status(500).send('Backup failed');
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send('Backup failed');
    }
    console.log(`stdout: ${stdout}`);
    res.send('Backup successful');
  });
};
</script>
<template>
  <div>
    <button @click="exportDB">Export Database Backup</button>
    <AuthProfile />
  </div>
</template>
