<script setup lang="ts">
// import { useSidebarStore } from '@/stores/sidebar'
// // import DarkModeSwitcher from './DarkModeSwitcher.vue'
// import DropdownMessage from './DropdownMessage.vue'
// import DropdownNotification from './DropdownNotification.vue'
import DropdownUser from './DropdownUser.vue';

// const { toggleSidebar } = useSidebarStore()
// const sidebarStore = useSidebarStore()
</script>
<style lang="css">
.shadow-2 {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}
.highlight {
  color: #2980b9;
}
</style>
<template>
  <header class="sticky top-0 z-999 flex w-full shadow-sm bg-slate-300 duration-300 ease-linear drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
    <div class="flex flex-grow items-center justify-end md:px-6 2xl:px-11">
      <div class="flex items-center gap-3 2xsm:gap-7 justify-between w-full">
        <div class="highlight font-semibold m-2"> Welcome <span class="highlight font-bold">Admin</span>, Have a great day </div>

        <!-- User Area -->
        <DropdownUser />
        <!-- User Area -->
      </div>
    </div>
  </header>
</template>
