<template>
    <div class="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6">Add Booking/Canteen</h2>
  
      <form @submit.prevent="createBooking">
        <!-- Patient Type and Booking Type -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Patient Type</label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.patientType" value="nonCancer" class="mr-2">
                Non Cancer Patient
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.patientType" value="cancer" class="mr-2">
                Cancer Patient
              </label>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <div class="flex items-center space-x-4">
              <label class="flex items-center">
                <input type="radio" v-model="form.bookingType" value="admitted" class="mr-2">
                Admitted
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.bookingType" value="nonAdmitted" class="mr-2">
                Non-Admitted
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.bookingType" value="tests" class="mr-2">
                Tests/Reports
              </label>
              <label class="flex items-center">
                <input type="radio" v-model="form.bookingType" value="other" class="mr-2">
                Other
              </label>
            </div>
          </div>
        </div>
  
        <!-- Check-in Time, Category, Room, and Payment -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
            <input type="text" v-model="form.checkInTime" class="input-field" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select v-model="form.category" class="input-field" required>
              <option v-for="category in categories" :key="category">{{ category }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Room</label>
            <select v-model="form.room" class="input-field" required>
              <option v-for="room in rooms" :key="room">{{ room }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Advance Payment</label>
            <input type="number" v-model="form.payment" class="input-field">
          </div>
        </div>
  
        <!-- Guest Information -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
            <input type="text" v-model="form.mobile" class="input-field" required>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
            <input type="text" v-model="form.guestName" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Guest Father Name</label>
            <input type="text" v-model="form.fatherName" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Guest Gender</label>
            <select v-model="form.gender" class="input-field">
              <option v-for="gender in genders" :key="gender">{{ gender }}</option>
            </select>
          </div>
        </div>
  
        <!-- Additional Guest Details -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Guest Caste</label>
            <input type="text" v-model="form.caste" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input type="text" v-model="form.age" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
            <select v-model="form.state" class="input-field">
              <option v-for="state in states" :key="state">{{ state }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input type="text" v-model="form.city" class="input-field">
          </div>
        </div>
  
        <!-- Patient Information -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
            <input type="text" v-model="form.patientName" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Hospital (Department)</label>
            <select v-model="form.hospital" class="input-field">
              <option v-for="department in departments" :key="department">{{ department }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Patient Ward No</label>
            <input type="text" v-model="form.wardNo" class="input-field">
          </div>
        </div>
  
        <!-- Extra Remarks and Submit -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Extra Remark</label>
          <textarea v-model="form.remark" class="input-field h-24"></textarea>
        </div>
  
        <button type="submit" class="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Create Booking</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    setup() {
      const form = ref({
        patientType: '',
        bookingType: '',
        checkInTime: '',
        category: '',
        room: '',
        payment: '',
        mobile: '',
        guestName: '',
        fatherName: '',
        gender: '',
        caste: '',
        age: '',
        state: '',
        city: '',
        patientName: '',
        hospital: '',
        wardNo: '',
        remark: '',
      });
  
      const categories = ['Category 1', 'Category 2', 'Category 3'];
      const rooms = ['Room 1', 'Room 2', 'Room 3'];
      const genders = ['Male', 'Female', 'Other'];
      const states = ['State 1', 'State 2', 'State 3'];
      const departments = ['Department 1', 'Department 2', 'Department 3'];
  
      const createBooking = () => {
        console.log(form.value);
      };
  
      return {
        form,
        categories,
        rooms,
        genders,
        states,
        departments,
        createBooking,
      };
    },
  };
  </script>
  
  <style scoped>
  .input-field {
    @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent;
  }
  </style>
  