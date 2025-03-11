<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="loading">
      Loading provider details...
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error">
      Failed to load provider details. {{ error }}
    </div>
    
    <!-- Data Loaded Successfully -->
    <div v-else-if="dataLoaded" class="provider-details">
      <h3>Please Refresh if the details doesn't load</h3>

    <!-- NOTIFICATION TO REFRESH THE PAGE IF THE PROVIDER'S DETAILS DOESNT LOAD -->
     <div class="notify">
     </div>
      <!-- Provider Header -->
      <div class="provider-header">
        <img :src="provider.profilePicture || '/img/profilepicture.jpeg'" alt="Provider Image" class="profile-image" />
        <h2 class="checkVeri">
          {{provider.firstname + ' ' + provider.lastname}}
          <span class="verified" v-if="provider.isVerified === true">✔️ Verified</span>
          <span class="verified" v-else style="color: red;">❌ Not verified</span>
        </h2>
        <p class="service-type">{{ provider.serviceType }}</p>
        <p class="distance">📍 {{ incomingInfo.distance }} km away</p>
      </div>
  
      <!-- Provider Information -->
      <div class="provider-info">
        <h3>About {{provider.firstname + ' ' + provider.lastname}}</h3>
        <p>{{ Description }}</p>
  
        <h3>Service Details</h3>
        <p>⭐ Rating: 3/5</p>
        <p class="available">✅ {{ provider.available }}</p>
  
        <h3>Contact</h3>
        <p><a :href="`tel:${provider.phone}`">📞 Call</a></p>
        <p>📍 {{ provider.address }}</p>
  
        <div class="action-buttons">
          <button class="chat-btn" @click="startChat">💬 Chat</button>
          <button class="call-btn" @click="callProvider">📞 Call</button>
          <button class="book-btn" @click="bookService">📅 Book Service</button>
        </div>
      </div>
  
      <!-- Map Section -->
      <div class="map-section">
        <h3>📍 Location on Map</h3>
        <Map v-bind="mapDetails"/>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed, watchEffect, onBeforeUnmount  } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserProviderStore } from '@/stores/provideruser'

const providerUser = useUserProviderStore()
const router = useRouter()
const route = useRoute()

// Local state management
const isLoading = ref(true)
const error = ref(null)
const dataLoaded = ref(false)

const incomingInfo = ref({
  ProviderId: '',
  userLat: '',
  userLon: '',
  distance: ''
})

// Provider details
const provider = ref({
  firstname: '',
  lastname: '',
  serviceType: '',
  phone: '',
  address: '',
  available: '',
  profilePicture: '',
  isVerified: false,
  describe: '',
  lat: '',
  lng: '',
})

// Computed property for truncated description
const Description = computed(() => { 
  return truncateDesciption(provider.value.describe, 20) 
})

// Map details
const mapDetails = computed(() => ({
  userLat: route.query.lat,
  userLng: route.query.lng,
  providerLat: provider.value.lat,
  providerLng: provider.value.lng
}))

// Function to update provider details from store
const updateDetailsInfo = () => {
  if (!providerUser.userDetails) return
  
  provider.value.firstname = providerUser.userDetails.Firstname || ''
  provider.value.lastname = providerUser.userDetails.Lastname || ''
  provider.value.serviceType = providerUser.userDetails.ServiceType || ''
  provider.value.profilePicture = providerUser.userDetails.ProfilePicture || ''
  provider.value.phone = providerUser.userDetails.PhoneNumber || ''
  provider.value.available = providerUser.userDetails.Availability || ''
  provider.value.address = providerUser.userDetails.Address || ''
  provider.value.isVerified = providerUser.userDetails.isVerified || false
  provider.value.describe = providerUser.userDetails.Description || ''
  provider.value.lat = providerUser.userDetails.lat || ''
  provider.value.lng = providerUser.userDetails.lng || ''
  
  dataLoaded.value = true
}

// Function to truncate description
const truncateDesciption = (description, wordLimit = 20) => {
  if (!description) return ""
  const words = description.split(" ")
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "..."
  }
  return description
}

// Navigation functions
const startChat = () => {
  const userId = route.query.userId
  const providerId = route.params.id
  router.push(`/chats/${providerId}`)
  // router.push(`/chats/${userId}/${providerId}`)
}

const callProvider = () => {
  window.location.href = `tel:${provider.value.phone}`
}

const bookService = () => {
  // Implement booking logic here
  alert('Booking service')
}

// Watch for changes to provider details in the store
watchEffect(() => {
  if (providerUser.userDetails && Object.keys(providerUser.userDetails).length > 0) {
    updateDetailsInfo()
  }
})

// let reloadTimer
// Fetch provider details on component mount
onMounted(async () => {
  try {
    isLoading.value = true
    error.value = null
    
    // Extract query parameters
    incomingInfo.value.ProviderId = route.params.id
    incomingInfo.value.userLat = route.query.lat
    incomingInfo.value.userLon = route.query.lng
    incomingInfo.value.distance = route.query.distance
    
    const userRegId = route.params.id
    
    console.log("Fetching provider details for:", userRegId)
    
    // Fetch provider details
    await providerUser.userDetailsFetch(userRegId)
    
    if (!providerUser.userDetails || Object.keys(providerUser.userDetails).length === 0) {
      throw new Error("No provider data found")
    }
    
    // Update provider details
    updateDetailsInfo()
    
    isLoading.value = false
  } catch (error) {
    console.error("Error loading provider data:", error)
    isLoading.value = false
    error.value = error.message || "Failed to load provider details"
  }
  setTimeout(() => {
        updateDetailsInfo()
  }, 5000);
})


// onBeforeUnmount(() => {
//   if (reloadTimer) {
//     clearTimeout(reloadTimer)
//   }
// })

</script>
  
<style scoped>
a {
  text-decoration: none;
}

.loading, .error {
  padding: 20px;
  text-align: center;
  font-size: 18px;
  margin: 50px auto;
  max-width: 600px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error {
  color: #dc3545;
  background: #f8d7da;
}

.provider-details {
  padding: 20px;
  max-width: 600px;
  margin: auto;
  text-align: center;
}

.provider-header {
  background: #007bff;
  color: white;
  padding: 20px;
  border-radius: 10px;
}

.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
}

.service-type {
  font-size: 18px;
  font-weight: bold;
}

.distance {
  font-size: 14px;
  color: #f1f1f1;
}

.verified {
  color: #28a745;
  font-size: 14px;
  margin-left: 5px;
  background-color: white;
  padding: 10px;
}

.available {
  color: #28a745;
  font-weight: bold;
}

.busy {
  color: #dc3545;
  font-weight: bold;
}

.provider-info {
  margin-top: 20px;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 10px;
  text-align: left;
}

h3 {
  margin-bottom: 5px;
  color: #007bff;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.chat-btn {
  background: #28a745;
  color: white;
}

.call-btn {
  background: #dc3545;
  color: white;
}

.book-btn {
  background: #ffc107;
  color: black;
}

.map-section {
  margin-top: 20px;
  padding: 15px;
  background: #e9ecef;
  border-radius: 10px;
  text-align: center;
}

@media (max-width: 768px) {
  .checkVeri {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 5px 0;
  }
  
  .service-type {
    font-size: 22px;
    font-weight: bold;
  }
}
</style>