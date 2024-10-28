<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form @submit.prevent="updateProfile" class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Update Profile</h2>
      <div class="mb-4">
        <input v-model="name" type="text" placeholder="Name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="mobile" type="text" placeholder="Mobile" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
      </div>
      <div class="mb-4">
        <input v-model="email" type="email" placeholder="Email" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
      </div>
      <div class="mb-6">
        <input v-model="password" type="password" placeholder="New Password" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
      </div>
      <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg"> Update Profile </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useFetch } from '#app'

// Reactive data variables
const name = ref('')
const mobile = ref('')
const email = ref('')
const password = ref('')

// Method to update profile
const updateProfile = async () => {
  const { data, error } = await useFetch('/api/auth/profile', {
    method: 'PUT',
    body: {
      name: name.value,
      mobile: mobile.value,
      email: email.value,
      password: password.value
    }
  })

  if (error.value) {
    alert('Update failed, please try again.')
  } else {
    alert('Profile updated successfully.')
  }
}
</script>
