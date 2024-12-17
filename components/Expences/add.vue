<template>
  <div class="bg-gray-100 flex justify-center items-center p-4">
    <div class="bg-white shadow-md rounded-lg w-full max-w-6xl p-6">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Expense Manager</h1>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- <div class="grid grid-cols-2 gap-2"> </div> -->
        <div class="grid grid-cols-5 gap-2">
          <div class="mb-4">
            <label class="block font-medium mb-1">Select Date:</label>
            <input type="date" v-model="form.selectedDate" class="w-full p-2 border rounded" />
          </div>
          <!-- Staff Salary -->
          <div>
            <label for="staffSalary" class="block text-gray-700 font-medium mb-2"> Staff Salary </label>
            <input
              type="number"
              id="staffSalary"
              v-model="form.staffSalary"
              placeholder="Enter staff salary"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Voucher -->
          <div>
            <label for="voucher" class="block text-gray-700 font-medium mb-2"> Voucher </label>
            <input
              type="text"
              id="voucher"
              v-model="form.voucher"
              placeholder="Enter voucher details"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <!-- Light Bill -->
          <div>
            <label for="lightBill" class="block text-gray-700 font-medium mb-2"> Light Bill </label>
            <input
              type="number"
              id="lightBill"
              v-model="form.lightBill"
              placeholder="Enter light bill amount"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Water Bill -->
          <div>
            <label for="waterBill" class="block text-gray-700 font-medium mb-2"> Water Bill </label>
            <input
              type="number"
              id="waterBill"
              v-model="form.waterBill"
              placeholder="Enter water bill amount"
              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Extra Expenditure -->
        <div>
          <label for="extraExpenditure" class="block text-gray-700 font-medium mb-2"> Extra Expenditure </label>
          <textarea
            id="extraExpenditure"
            v-model="form.extraExpenditure"
            placeholder="Describe extra expenditure"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="text-right">
          <button type="submit" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"> Submit </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        selectedDate: '',
        staffSalary: '',
        lightBill: '',
        waterBill: '',
        voucher: '',
        extraExpenditure: ''
      }
    };
  },
  methods: {
    async submitForm() {
      const { data, error } = await useFetch('/api/expences', {
        method: 'POST',
        body: this.form
      });

      if (error.value) {
        alert('Failed to save room');
      } else {
        alert('Expense added successfully!');
        roomStore.closeModel();
        router.go(0);
      }
      // Reset the form
      this.form = {
        selectedDate: '',
        staffSalary: '',
        lightBill: '',
        waterBill: '',
        voucher: '',
        extraExpenditure: ''
      };
    }
  }
};
</script>

<style>
/* You can add custom styles here if needed */
</style>
