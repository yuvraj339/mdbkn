<template>
  <form @submit.prevent="handleLogin" class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6">Login</h2>
    <div class="mb-4">
      <input v-model="email" type="email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" required />
    </div>
    <div class="mb-6">
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        required
      />
    </div>
    <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"> Login </button>
  </form>
</template>

<script setup>
import { ref } from 'vue';
import { useFetch, useRouter } from '#app';
import { useAuthStore } from '@/stores/auth';

const email = ref('');
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = () => {
  useFetch('/api/auth/login', {
    method: 'POST',
    body: { email: email.value, password: password.value }
  })
    .then(({ data, error }) => {
      // Access the value from the `Ref`
      const response = data.value;
      const err = error.value;

      if (err || !response?.auth) {
        alert('Login failed, please try again.');
      } else {
        authStore.authenticateUser(response.auth);
        authStore.currentUser(response.user);
        router.push('/');
      }
    })
    .catch((err) => {
      console.error('Login error:', err);
      alert('An error occurred during login. Please try again later.');
    });
};
</script>
