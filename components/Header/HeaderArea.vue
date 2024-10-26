<script setup lang="ts">
// import { useSidebarStore } from '@/stores/sidebar'
// // import DarkModeSwitcher from './DarkModeSwitcher.vue'
// import DropdownMessage from './DropdownMessage.vue'
// import DropdownNotification from './DropdownNotification.vue'
import DropdownUser from './DropdownUser.vue'

// const { toggleSidebar } = useSidebarStore()
// const sidebarStore = useSidebarStore()
</script>

<template>
  <header
    class="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none bg-slate-500"
  >
    <div class="flex flex-grow items-center justify-end shadow-2 md:px-6 2xl:px-11">
       
      <div class="flex items-center gap-3 2xsm:gap-7">
         

        <!-- User Area -->
        <DropdownUser />
        <!-- User Area -->
      </div>
    </div>
  </header>
</template>
