<template>
  <div class="flex items-center justify-center bg-gray-100">
    <form @submit.prevent="updateProfile" class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Update Profile</h2>
      <div class="mb-4">
        <input
          required
          v-model="secret"
          type="text"
          placeholder="Secret code"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <hr class="mb-5" />
      <div class="mb-4">
        <input required v-model="form.name" type="text" placeholder="Name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
      </div>
      <div class="mb-4">
        <input
          required
          v-model="form.mobile"
          type="number"
          placeholder="Mobile"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <div class="mb-4">
        <input required v-model="form.email" type="email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
      </div>
      <div class="mb-6">
        <input
          required
          v-model="form.password"
          type="password"
          placeholder="New Password"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"> Update Profile </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFetch } from '#app';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// Reactive data variables
// authStore.updateOnReload();
let form = authStore.record;

const secret = ref('');
// const name = ref('');
// const mobile = ref('');
// const email = ref('');
// const password = ref('');

// Method to update profile
const updateProfile = async () => {
  const { data, error } = await useFetch('/api/auth/profile', {
    method: 'PUT',
    body: {
      secret: secret.value,
      name: form.name,
      mobile: form.mobile,
      email: form.email,
      password: form.password
    }
  });
  if (error.value) {
    alert('Update failed, please try again.');
  } else if (!data.value.success) {
    alert(data.value.message);
  } else {
    alert(data.value.message);
  }
};
</script>
