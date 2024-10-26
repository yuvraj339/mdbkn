<template>
    <form @submit.prevent="submitForm">
      <div>
        <label for="name">Name:</label>
        <input v-model="name" id="name" type="text" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input v-model="email" id="email" type="email" required />
      </div>
      <button type="submit">Add Record</button>
      <p v-if="message">{{ message }}</p>
    </form>
  </template>
  
  <script setup>
  alert('here')
  import { ref } from 'vue';
  
  const name = ref('');
  const email = ref('');
  const message = ref('');
  
  const submitForm = async () => {
    const { data } = await useFetch('/api/records', {
      method: 'POST',
      body: { name: name.value, email: email.value },
    });
    message.value = data.value.message;
  };
  </script>
  