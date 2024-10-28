<script setup lang="ts">
// import HeaderArea from '@/components/Header/HeaderArea.vue'
// import SidebarArea from '@/components/Sidebar/SidebarArea.vue'
import addCategoryForm from '@/components/Rooms/Category/add.vue';
</script>

<template>
  <!-- ===== Page Wrapper Start ===== -->
  <div class="flex h-screen overflow-hidden">
    <!-- ===== Sidebar Start ===== -->
    <SidebarArea />
    <!-- ===== Sidebar End ===== -->

    <!-- ===== Content Area Start ===== -->
    <div class="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-slate-50">
      <!-- ===== Header Start ===== -->
      <HeaderArea />
      <!-- ===== Header End ===== -->

      <!-- ===== Main Content Start ===== -->
      <main>
        <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          <slot></slot>
          <!-- <NuxtPage /> -->
        </div>
        <!-- Addding all model popup -->
        <addCategoryForm />
      </main>
      <!-- ===== Main Content End ===== -->
    </div>
  </div>
  <!-- ===== Page Wrapper End ===== -->
</template>
