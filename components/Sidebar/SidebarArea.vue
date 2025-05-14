<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';
import SidebarItem from './SidebarItem.vue';

const target = ref(null);

const sidebarStore = useSidebarStore();

onClickOutside(target, () => {
  sidebarStore.isSidebarOpen = false;
});

const menuGroups = ref([
  {
    // name: 'MENU',
    menuItems: [
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
              `,
        label: 'Dashboard',
        route: '/'
        // children: [{ label: 'eCommerce', route: '/' }]
      },

      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M3 7h18M3 12h18M3 17h18"/>
              </svg>
              `,
        label: 'Cetegory',
        route: '/categories'
        // children: [{ label: 'eCommerce', route: '/' }]
      },

      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M3 7v13h18V7H3zm0 6h18M7 7v6m10-6v6"/>
              </svg>
              `,
        label: 'Rooms',
        route: '/rooms'
        // children: [{ label: 'eCommerce', route: '/' }]
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"/>
              </svg>
              `,
        label: 'Bookings',
        route: '/bookings'
        // children: [{ label: 'eCommerce', route: '/' }]
      },

      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 4h16v6H4zM4 14h16v6H4zM4 10h16v4H4z"/>
              </svg>
              `,
        label: 'Checkout',
        route: '/checkout'
        // children: [{ label: 'eCommerce', route: '/' }]
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M4 4h16v16H4zM8 10h8M8 14h6"/>
              </svg>
              `,
        label: 'Expenses',
        route: '/accounts'
        // children: [{ label: 'eCommerce', route: '/' }]
      },
      {
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 8.6 15a1.65 1.65 0 0 0-1.82-.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0 .33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 15 8.6c.32 0 .63.05.92.15"/>
              </svg>
              `,
        label: 'Settings',
        route: '/settings'
        // children: [{ label: 'eCommerce', route: '/' }]
      }
    ]
  }
]);
</script>

<template>
  <aside
    class="absolute left-0 top-0 z-9999 flex h-screen w-65 flex-col overflow-y-hidden bg-slate-200 duration-300 ease-linear lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen
    }"
    ref="target"
  >
    <!-- SIDEBAR HEADER -->
    <div class="flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
      <!-- <router-link to="/">
        <img src="@/assets/images/logo/logo.svg" alt="Logo" />
      </router-link> -->
      <p class="mt-3"><strong>Maheshwari Dharamshala</strong></p>
      <button class="block lg:hidden" @click="sidebarStore.isSidebarOpen = false">
        <svg class="fill-current" width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
            fill=""
          />
        </svg>
      </button>
    </div>
    <!-- SIDEBAR HEADER -->

    <div class="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
      <!-- Sidebar Menu -->
      <nav class="mt-1 lg:mt-1 lg:px-1">
        <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
          <div>
            <!-- <h3 class="mb-4 ml-4 text-sm font-medium text-gray-800">{{ menuGroup.name }}</h3> -->

            <ul class="mb-6 flex flex-col gap-1.5">
              <SidebarItem v-for="(menuItem, index) in menuGroup.menuItems" :item="menuItem" :key="index" :index="index" />
            </ul>
          </div>
        </template>
      </nav>
      <!-- Sidebar Menu -->

      <!-- Promo Box -->

      <!-- Promo Box -->
    </div>
  </aside>
</template>
<style scoped lang="css"></style>
