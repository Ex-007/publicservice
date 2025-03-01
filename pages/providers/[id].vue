<template>
    <div class="provider-details">
      <!-- Provider Header -->
      <div class="provider-header">
        <img :src="provider.profilePicture || '/img/profilepicture.jpeg'" alt="Provider Image" class="profile-image" />
        <h2 class="checkVeri">
          {{provider.firstname + ' ' + provider.lastname}}
          <span class="verified" v-if="provider.isVerified == true">✔️ {{provider.isVerified}}</span>
          <span class="verified" v-else style="color: red;">❌ Not verified</span>
        </h2>
        <p class="service-type"> {{ provider.serviceType }}</p>
        <p class="distance">📍 {{ incomingInfo.distance }} km away</p>
      </div>
  
      <!-- Provider Information -->
      <div class="provider-info">
        <h3>About {{provider.firstname + ' ' + provider.lastname}}</h3>
        <p>{{ Description }}</p>
  
        <h3>Service Details</h3>
        <p>⭐ Rating: 3/5</p>
        <p class="available">✅ {{ provider.available }}</p>
        <!-- <p class="busy">❌ Busy</p> -->
  
        <h3>Contact</h3>
        <p><a :href="`tel:${provider.phone}`">📞 Call</a></p>
        <p>📍 {{ provider.address }}</p>
  
        <div class="action-buttons">
          <button class="chat-btn" @click="startChat">💬 Chat</button>
          <button class="call-btn" @click="callProvider">📞 Call</button>
          <button class="book-btn" @click="bookService">📅 Book Service</button>
        </div>
      </div>
  
      <!-- Collapsible Reviews Section -->
      <!-- <div class="reviews-section">
        <h3 @click="toggleReviews" class="reviews-header">
          📢 Customer Reviews (9) 
          <span v-if="showReviews">⬆️</span>
          <span v-else>⬇️</span>
        </h3> -->
  
        <!-- REVIEW SECTION -->
        <!-- <div v-if="showReviews">
          <div v-if="reviews.length > 0">
            <div v-for="review in reviews" :key="review.id" class="review">
              <div class="review-header">
                <strong>Femi Akintade</strong>
                <span class="stars">⭐ 4/5</span>
              </div>
              <p>His service is awesome</p>
            </div>
          </div>
          <p v-else>No reviews yet.</p> -->
  
          <!-- Add Review Form -->
          <!-- <div class="review-form">
            <h4>Add Your Review</h4>
            <input type="text" v-model="newReview.name" placeholder="Your Name" />
            <input type="number" v-model="newReview.rating" min="1" max="5" placeholder="Rating (1-5)" />
            <textarea v-model="newReview.comment" placeholder="Write a review"></textarea>
            <button @click="submitReview">Submit Review</button>
          </div>
        </div>
      </div> -->
  
      <!-- Map Section -->
      <div class="map-section">
        <h3>📍 Location on Map</h3>
        <Map v-bind="mapDetails"/>
        <!-- <div class="map-placeholder">Map will be integrated here</div> -->
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
    import { useRouter, useRoute } from 'vue-router'
    import { useUserProviderStore } from '@/stores/provideruser'
    const providerUser = useUserProviderStore()
    const router = useRouter()
    const route = useRoute()

    // const {id} = route.params;

    const incomingInfo = ref({
      ProviderId: '',
      userLat : '',
      userLon: '',
      distance: ''
    })

    // OTHER DETAILS
    const provider = ref({
      firstname: '',
      lastname: '',
      serviceType: '',
      phone: '',
      address: '',
      available: '',
      profilePicture: '',
      isVerified: '',
      describe: '',
      lat: '',
      lng: '',
      // Description : computed(() => {
      //   truncateDesciption(provider.value.describe, 20)
      // })
    });

    const Description = computed(() => { 
  return truncateDesciption(provider.value.describe, 20) 
})

    // UPDATE USER DETAILS
    const updateDetailsInfo = () => {
      console.log(providerUser.userDetails)
      provider.value.firstname = providerUser.userDetails.Firstname
      provider.value.lastname = providerUser.userDetails.Lastname
      provider.value.serviceType = providerUser.userDetails.ServiceType
      provider.value.profilePicture = providerUser.userDetails.ProfilePicture
      provider.value.phone = providerUser.userDetails.PhoneNumber
      provider.value.available = providerUser.userDetails.Availability
      provider.value.address = providerUser.userDetails.Address
      provider.value.isVerified = providerUser.userDetails.isVerified
      provider.value.describe = providerUser.userDetails.Description
      provider.value.lat = providerUser.userDetails.lat
      provider.value.lng = providerUser.userDetails.lng
    }

    // TRUNCATE THE ABOUT INFO
    const truncateDesciption = (description, wordLimit = 20) => {
      if(!description) return ""
      const words = description.split(" ")
      if(words.length > wordLimit){
        return words.slice(0, wordLimit).join(" ") + "..."
      }
      return description
    }

    const mapDetails = {
      userLat : route.query.lat,
      userLng : route.query.lng,
      providerLat : route.query.uselat,
      providerLng : route.query.uselng
    }


    // INITIATE THE CHAT
    const startChat = () => {
        const userId = route.query.userId
        const providerId = route.query.providerId
      router.push(`/chats/${userId}/${providerId}`);
    };


    const callProvider = () => {
      alert('calling')
    }


    // ONMOUNTED
    onMounted(async () => {
      incomingInfo.value.ProviderId = route.params.id
      incomingInfo.value.userLat = route.query.lat
      incomingInfo.value.userLon = route.query.lng
      incomingInfo.value.distance = route.query.distance



      const userRegId = route.params.id
      const userLat = route.query.lat
      const userLon = route.query.lng
      const distance = route.query.distance

      await providerUser.userDetailsFetch(userRegId)
      await updateDetailsInfo()
    })
  </script>
  
  <style scoped>
  a{
    text-decoration: none;
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
  
  .reviews-section {
    margin-top: 20px;
    padding: 15px;
    background: #fff3cd;
    border-radius: 10px;
    text-align: left;
  }
  
  .reviews-header {
    cursor: pointer;
  }
  
  .review {
    background: #ffffff;
    padding: 10px;
    margin-top: 10px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  }
  
  .review-form {
    margin-top: 15px;
  }
  
  input, textarea {
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
  }
  
  .map-section {
    margin-top: 20px;
    padding: 15px;
    background: #e9ecef;
    border-radius: 10px;
    text-align: center;
  }
  
  .map-placeholder {
    height: 200px;
    background: #d6d6d6;
  }

  @media (max-width: 768px){
    .checkVeri{
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
  