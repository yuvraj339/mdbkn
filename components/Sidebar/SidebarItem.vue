<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar';
import { useRoute } from 'vue-router';
import SidebarDropdown from './SidebarDropdown.vue';

const sidebarStore = useSidebarStore();
const props = defineProps(['item', 'index']);
const currentPage = useRoute().name;

interface SidebarItem {
  label: string;
}

const handleItemClick = () => {
  const pageName = sidebarStore.page === props.item.label ? '' : props.item.label;
  sidebarStore.page = pageName;

  if (props.item.children) {
    return props.item.children.some((child: SidebarItem) => sidebarStore.selected === child.label);
  }
};
</script>

<template>
  <li>
    <NuxtLink
      :to="item.route"
      @click.prevent="handleItemClick"
      class="group relative flex items-center gap-2 rounded-md px-4 py-2 font-medium text-gray-700 dark:text-gray-300 transition-all duration-200 hover:bg-gray-100 hover:dark:bg-gray-700"
      :class="{
        'bg-blue-100 text-blue-700 dark:bg-gray-800 dark:text-white shadow-md': sidebarStore.page === item.label
      }"
    >
      <span v-html="item.icon" class="text-lg transition-all duration-200 group-hover:scale-110"></span>
      {{ item.label }}

      <svg
        v-if="item.children"
        class="absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200"
        :class="{ 'rotate-180': sidebarStore.page === item.label }"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M8.12 9.29L12 13.17l3.88-3.88a1 1 0 1 1 1.41 1.42l-4.59 4.58a1 1 0 0 1-1.41 0l-4.59-4.58a1 1 0 0 1 1.42-1.42z" />
      </svg>
    </NuxtLink>

    <!-- Dropdown Menu Start -->
    <div class="transition-all duration-200 ease-in-out" v-show="sidebarStore.page === item.label">
      <SidebarDropdown v-if="item.children" :items="item.children" :currentPage="currentPage" :page="item.label" />
    </div>
    <!-- Dropdown Menu End -->
  </li>
</template>
