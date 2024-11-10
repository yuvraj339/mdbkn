<template>
  <div class="grid grid-cols-3 gap-5">
    <div v-for="(field, index) in formFields" :key="index" class="mb-4">
      <label :for="field.name" class="block font-semibold mb-1">{{ field.label }}</label>
      <input
        v-if="field.type !== 'select'"
        :type="field.type"
        :id="field.name"
        v-model="form[field.name]"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
        :placeholder="field.placeholder"
      />
      <select
        v-if="field.type === 'select'"
        :id="field.name"
        v-model="form[field.name]"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
      >
        <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps(['form', 'formFields']);
</script>
