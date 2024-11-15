<!-- <script setup>
const { exec } = require('child_process');
const exportDB = async () => {
  // const response = await $fetch('/api/export');
  // console.log(response);
  // Copy-Item -Path $DBPath -Destination $BackupFile -ErrorAction Stop -Force
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
  </div>
</template> -->
<template>
  <div>
    <button @click="downloadDB" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">Export Database</button>
    <AuthProfile />
  </div>
</template>

<script setup>
const downloadDB = async () => {
  const response = await fetch('/api/export-db');

  if (!response.ok) {
    console.error('Failed to export database');
    return;
  }

  // Create a link to download the file
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const backupName = `db_backup_${new Date().toISOString()}.sqlite3`;
  link.download = backupName;
  link.click();
  URL.revokeObjectURL(url);
};
</script>
