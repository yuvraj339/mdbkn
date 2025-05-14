<script setup lang="ts">
// import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
// const dropdownOpen = ref(false);
import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia

const target = ref(null);
import { useAuthStore } from '@/stores/auth';
import { useRouter } from '#app';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <div class="relative" ref="target">
    <ul class="flex items-center space-x-4 justify-end pr-4">
      <li v-if="!authStore.isAuthenticated" class="loginBtn">
        <nuxt-link to="/login" class="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>Login</span>
        </nuxt-link>
      </li>

      <li v-else class="loginBtn flex items-center space-x-2">
        <span class="text-gray-700"
          >Hello <strong>{{ authStore.user?.name }}</strong
          >,</span
        >
        <nuxt-link @click="logout()" class="flex items-center space-x-1 text-red-600 hover:text-red-800 font-semibold">
          <button class="flex items-center space-x-1 text-red-600 hover:text-red-800">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5 text-red-600">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
            <span>Logout</span>
          </button>
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>
