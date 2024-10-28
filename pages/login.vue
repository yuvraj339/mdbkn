<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <AuthLogin></AuthLogin>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  // middleware: ['guest'],
  layout: 'auth'
});
</script>
