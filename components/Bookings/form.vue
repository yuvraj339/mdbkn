<template>
  <div class="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-semibold">{{ bookingStore.editMode ? 'Edit Booking' : 'Add Booking' }}</h2>
      <button @click="bookingStore.closeModel()">✖️</button>
    </div>
    <!-- <h2 class="text-1xl font-bold mb-6">Add Booking/Canteen</h2> -->

    <form @submit.prevent="createBooking">
      <!-- Patient Type and Booking Type -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Patient Type</label>
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input type="radio" v-model="form.patientType" value="nonCancer" class="mr-2" />
              Non Cancer Patient
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="form.patientType" value="cancer" class="mr-2" />
              Cancer Patient
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
          <div class="flex items-center space-x-4">
            <label class="flex items-center">
              <input type="radio" v-model="form.bookingType" value="admitted" class="mr-2" />
              Admitted
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="form.bookingType" value="nonAdmitted" class="mr-2" />
              Non-Admitted
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="form.bookingType" value="tests" class="mr-2" />
              Tests/Reports
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="form.bookingType" value="other" class="mr-2" />
              Other
            </label>
          </div>
        </div>
      </div>

      <!-- Guest Information -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Guest Name</label>
          <input type="text" v-model="form.guestName" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Guest Father Name</label>
          <input type="text" v-model="form.guestFName" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Patient/Guest Relation</label>
          <input type="text" v-model="form.patientGuestRelation" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Guest Caste</label>
          <input type="text" v-model="form.caste" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Guest Gender</label>
          <select v-model="form.gender" class="input-field">
            <option v-for="gender in genders" :key="gender">{{ gender }}</option>
          </select>
        </div>
      </div>

      <!-- Additional  Details -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mobile No</label>
          <input type="text" v-model="form.mobile" class="input-field" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Age</label>
          <input type="text" v-model="form.age" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">State</label>
          <select v-model="form.state" class="input-field">
            <option v-for="state in states" :key="state">{{ state }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
          <input type="text" v-model="form.city" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tehsil</label>
          <input type="text" v-model="form.tehsil" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Village</label>
          <input type="text" v-model="form.village" class="input-field" />
        </div>
      </div>
      <!-- Check-in Time, Category, Room, and Payment -->
      <div :class="bookingStore.editMode ? 'grid grid-cols-1 md:grid-cols-7  gap-4 mt-6' : 'grid grid-cols-1 md:grid-cols-5 gap-4 mt-6'">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Check-in Time</label>
          <input type="datetime-local" v-model="form.checkInTime" class="input-field" required />
        </div>
        <div v-if="bookingStore.editMode">
          <label class="block text-sm font-medium text-gray-700 mb-2">Check-out Time</label>
          <input type="datetime-local" v-model="form.checkOutTime" class="input-field" required />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>

          <select v-model="form.category" class="input-field" @change="getCategoryRooms(form.category)" required>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Room <small class="text-sm" v-if="bookingStore.editMode">({{ form.roomNumber }})</small></label
          >

          <!-- <input type="text" v-if="bookingStore.editMode" v-model="form.room" class="input-field" disabled readonly /> -->
          <select v-model="form.room" class="input-field">
            <option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.roomNumber }}</option>
          </select>
        </div>
        <div v-if="bookingStore.editMode">
          <label class="block text-sm font-medium text-gray-700 mb-2">Aminity +</label>
          <input type="number" v-model="form.amenities" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Advance + Payment </label>
          <input type="number" v-model="form.payment" class="input-field" />
        </div>
        <div>
          <!-- <img :src="form.document" class="max-h-10 max-w-40" /> -->
          <!-- <a :href="'public' + form.document" :download="form.document">
            <button>Download Image</button>
          </a> -->
          <div v-if="bookingStore.editMode" class="border border-solid">
            <a :href="imgHrf"> <img id="img1" :src="form.document" alt="Zoomable Image" @click="toggleImage" class="zoomable h-10 w-40" /> </a>
            <!-- <a href="#" class="close"> Close Zoom</a> -->
          </div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Upload document</label>
          <input type="file" @change="handleFileUpload" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200" />
        </div>
      </div>

      <!-- Patient Information -->
      <div class="grid grid-cols-1 md:grid-cols-6 gap-4 mt-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
          <input type="text" v-model="form.patientName" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hospital (Department)</label>
          <input type="text" v-model="form.hospital" class="input-field" />
          <!-- <select v-model="form.hospital" class="input-field">
            <option v-for="department in departments" :key="department">{{ department }}</option>
          </select> -->
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Patient Ward No</label>
          <input type="text" v-model="form.wardNo" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Hospital Room</label>
          <input type="text" v-model="form.hospitalRoomNumber" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Bed</label>
          <input type="text" v-model="form.hospitalBedNumber" class="input-field" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Doctor Name</label>
          <input type="text" v-model="form.doctorName" class="input-field" />
        </div>
      </div>
      <!-- Extra Remarks and Submit -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Extra Remark</label>
        <textarea v-model="form.remark" class="input-field h-24"></textarea>
      </div>

      <!-- <button type="submit" class="mt-6 w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Create Booking</button> -->
      <button @click="bookingStore.closeModel()" class="btn btn-secondary mr-2 py-2">Close</button>
      <button v-if="!bookingStore.editMode" @click="save" type="submit" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600"> Create Booking</button>
      <button v-else @click="update" class="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600">Update Booking</button>
    </form>
  </div>
</template>

<script setup>
// import { ref, onMounted } from 'vue';
// const props = defineProps(['storeData']);
import { useBookingModalStore } from '@/stores/booking';
const categories = ref([]);
const rooms = ref([]);
const roomDB = ref([]);
const error = ref('');
import { useRouter } from 'vue-router';

const router = useRouter();
const bookingStore = useBookingModalStore();
onMounted(async () => {
  try {
    const cat_response = await $fetch('/api/rooms/category/all_categories');
    const { rows } = await $fetch('/api/rooms/room/available');
    categories.value = cat_response; // Adjust to match the response structure
    roomDB.value = rows; // Adjust to match the response structure
    rooms.value = rows; // Adjust to match the response structure
    console.log('Categories:', rooms.value);
  } catch (err) {
    error.value = err.message;
    console.log('Error fetching records:', err);
  }
});
const getCategoryRooms = (category) => {
  rooms.value = roomDB.value.filter((room) => room.roomCategory == category);
  // console.log('Rooms:', rooms);
};
let imgHrf = ref('#img1');
const toggleImage = () => {
  imgHrf.value = imgHrf.value == '#img1' ? '#' : '#img1';
};
const form = ref(bookingStore.record);
// const images = import.meta.glob('~/assets/uploads/*');
// const imagePath = computed(() => images['/assets/uploads/1731484622429_icon.png']);

// console.log(imagePath, 'imagePath');
// const imagePath = `~/${form.value.document}`;
// const imagePath = computed(() => require(`~/${form.value.document}`));

// const storeData = props.storeData;
let uploadedFile = '';

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  uploadedFile = file;
  // form.value.document = uploadedFile
};

const genders = ['Male', 'Female', 'Other'];
const states = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

//
// const departments = ['Department 1', 'Department 2', 'Department 3'];

// Save data
const save = async () => {
  bookingStore.editMode = false;
  const formData = new FormData();

  // Append all form fields to FormData
  Object.keys(form.value).forEach((key) => {
    formData.append(key, form.value[key]);
  });
  // Append the file separately to FormData
  if (uploadedFile) {
    formData.append('document', uploadedFile);
  }
  const { data, error } = await $fetch('/api/bookings/booking', {
    method: 'POST',
    body: formData,
    headers: {}
  });

  if (error) {
    alert('Failed to save Booking');
  } else {
    alert('Room Booking added successfully!');
    bookingStore.closeModel();
    router.go(0);
  }
};

async function update() {
  const formData = new FormData();

  // Append all form fields to FormData
  Object.keys(form.value).forEach((key) => {
    formData.append(key, form.value[key]);
  });
  // Append the file separately to FormData
  if (uploadedFile) {
    formData.append('document', uploadedFile);
  }
  const response = await $fetch(`/api/bookings/booking/${bookingStore.editId}`, {
    method: 'POST',
    body: formData,
    headers: {}
  });
  console.log(response.success, 'response');

  if (response.success) {
    // Handle successful response
    alert(response.message); // Log the success message
    // Perform any necessary actions like updating the UI or redirecting
    bookingStore.setEditMode(false);
    bookingStore.closeModel();
    router.go(0);
  } else {
    // Handle unsuccessful response
    alert(response.message); // Log the error message
    // Display an error message to the user or take other appropriate actions
  }
}

// return {
//   form,
//   categories,
//   rooms,
//   genders,
//   states,
//   departments,
//   createBooking,
// };
// },
// };

// const city = [
//   "Mumbai",
//   "Delhi",
//   "Bangalore",
//   "Hyderabad",
//   "Ahmedabad",
//   "Chennai",
//   "Kolkata",
//   "Surat",
//   "Pune",
//   "Jaipur",
//   "Lucknow",
//   "Kanpur",
//   "Nagpur",
//   "Indore",
//   "Thane",
//   "Bhopal",
//   "Visakhapatnam",
//   "Pimpri-Chinchwad",
//   "Patna",
//   "Vadodara",
//   "Ghaziabad",
//   "Ludhiana",
//   "Agra",
//   "Nashik",
//   "Faridabad",
//   "Meerut",
//   "Rajkot",
//   "Kalyan-Dombivli",
//   "Vasai-Virar",
//   "Varanasi",
//   "Srinagar",
//   "Aurangabad",
//   "Dhanbad",
//   "Amritsar",
//   "Navi Mumbai",
//   "Allahabad",
//   "Howrah",
//   "Ranchi",
//   "Gwalior",
//   "Jabalpur",
//   "Coimbatore",
//   "Vijayawada",
//   "Jodhpur",
//   "Madurai",
//   "Raipur",
//   "Kota",
//   "Guwahati",
//   "Chandigarh",
//   "Solapur",
//   "Hubli–Dharwad",
//   "Mysore",
//   "Tiruchirappalli",
//   "Bareilly",
//   "Aligarh",
//   "Tiruppur",
//   "Moradabad",
//   "Jalandhar",
//   "Bhubaneshwar",
//   "Salem",
//   "Warangal",
//   "Guntur",
//   "Bhiwandi",
//   "Saharanpur",
//   "Gorakhpur",
//   "Bikaner",
//   "Amravati",
//   "Noida",
//   "Jamshedpur",
//   "Bhilai",
//   "Cuttack",
//   "Firozabad",
//   "Kochi",
//   "Bhavnagar",
//   "Dehradun",
//   "Durgapur",
//   "Asansol",
//   "Nanded",
//   "Kolhapur",
//   "Ajmer",
//   "Gulbarga",
//   "Jamnagar",
//   "Ujjain",
//   "Loni",
//   "Siliguri",
//   "Jhansi",
//   "Ulhasnagar",
//   "Jammu",
//   "Sangli-Miraj & Kupwad",
//   "Mangalore",
//   "Erode",
//   "Belgaum",
//   "Ambattur",
//   "Tirunelveli",
//   "Malegaon",
//   "Gaya",
//   "Jalgaon",
//   "Udaipur",
//   "Maheshtala",
//   "Davanagere",
//   "Kozhikode",
//   "Kurnool",
//   "Rajpur Sonarpur",
//   "Rajahmundry",
//   "Bokaro",
//   "South Dumdum",
//   "Bellary",
//   "Patiala",
//   "Gopalpur",
//   "Agartala",
//   "Bhagalpur",
//   "Muzaffarpur",
//   "Bhatpara",
//   "Panihati",
//   "Latur",
//   "Dhule",
//   "Tirupati",
//   "Rohtak",
//   "Korba",
//   "Bhilwara",
//   "Berhampur",
//   "Muzaffarnagar",
//   "Ahmednagar",
//   "Mathura",
//   "Kollam",
//   "Avadi",
//   "Kadapa",
//   "Anantapur",
//   "Kamarhati",
//   "Bilaspur",
//   "Sambalpur",
//   "Shahjahanpur",
//   "Satara",
//   "Bijapur",
//   "Kakinada",
//   "Bhuj",
//   "Akola",
//   "Latur"
// ];
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent;
}
.zoomable {
  width: 200px;
  transition: transform 0.5s ease;
}

#img1:target {
  transform: scale(7);
}

.close {
  display: none;
}
</style>
