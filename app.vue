<!-- <script setup lang="ts">
// import Welcome from './pages/Welcome.vue'
</script> -->

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <!-- <div>
    <template v-if="!authStore.isAuthenticated">
      <login />
    </template>
    <template v-else>
      
    </template>
  </div> -->
</template>

<style>
#electron-status {
  background: #000;
  color: #fff;
  position: absolute;
  font-size: 2rem;
  font: bold;
}
</style>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

onMounted(() => {
  if (!authStore.isAuthenticated) {
    navigateTo('/login');
  }
});
definePageMeta({
  middleware: 'auth'
  // layout: 'auth'
});
</script>
