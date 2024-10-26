<script setup lang="ts">
// import FirstForm from '~/components/Form/firstForm.vue';
// import TableThree from '~/components/Tables/TableThree.vue';
// import TableTwo from '~/components/Tables/TableTwo.vue';
// import Default from '~/layouts/default.vue';

// import DataStatsOne from '@/components/DataStats/DataStatsOne.vue'
// // import ChartOne from '@/components/Charts/ChartOne.vue'
// // import ChartThree from '@/components/Charts/ChartThree.vue'
// // import ChartTwo from '@/components/Charts/ChartTwo.vue'
// import ChatCard from '@/components/ChatCard.vue'
// // import MapOne from '@/components/Maps/MapOne.vue'
// import TableOne from '@/components/Tables/TableOne.vue'
import Default from '@/layouts/Default.vue'
import FirstForm from '~/components/Form/FirstForm.vue';
import AddRecord from '~/components/Form/AddRecord.vue';
import Table4 from '~/components/Tables/Table4.vue';
</script>

<template>
  <Default>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7">
      <DataStatsOne />
    </div>

    <div class="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7 2xl:gap-7">
      <!-- ====== Chart One Start -->
      <!-- <ChartOne /> -->
      <!-- ====== Chart One End -->

      <!-- ====== Chart Two Start -->
      <!-- <ChartTwo /> -->
      <!-- ====== Chart Two End -->

      <!-- ====== Chart Three Start -->
      <!-- <ChartThree /> -->
      <!-- ====== Chart Three End -->

      <!-- ====== Map One Start -->
      <!-- <MapOne /> -->
      <!-- ====== Map One End -->

      <!-- ====== Table One Start -->
      <div class="col-span-12 xl:col-span-12">
        <Table4 />
      </div>
      <div class="col-span-12 xl:col-span-12">
        <AddRecord />
        <FirstForm />
        
      </div>
      <!-- ====== Table One End -->

      <!-- ====== Chat Card Start -->
      <!-- <ChatCard /> -->
      <!-- ====== Chat Card End -->
    </div>
  </Default>
</template>
