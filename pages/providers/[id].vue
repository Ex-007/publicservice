<template>
    <div class="provider-details">
      <!-- Provider Header -->
      <div class="provider-header">
        <img src="/public/img/mechanic.jpeg" alt="Provider Image" class="profile-image" />
        <h2 class="checkVeri">
          Adebayo Adewale
          <span class="verified">✔️ Verified</span>
        </h2>
        <p class="service-type"> Mechanic</p>
        <p class="distance">📍 5 km away</p>
        <p class="distance">{{ id }}</p>
      </div>
  
      <!-- Provider Information -->
      <div class="provider-info">
        <h3>About Adebayo Adewale</h3>
        <p>A mechanic with years of experience</p>
  
        <h3>Service Details</h3>
        <p>⭐ Rating: 3/5</p>
        <p class="available">✅ Available</p>
        <!-- <p class="busy">❌ Busy</p> -->
  
        <h3>Contact</h3>
        <p>📞 <a href="'tel:' + provider.phone">123456789</a></p>
        <p>📍 Hawkeye street</p>
  
        <div class="action-buttons">
          <button class="chat-btn" @click="startChat">💬 Chat</button>
          <button class="call-btn" @click="callProvider">📞 Call</button>
          <button class="book-btn" @click="bookService">📅 Book Service</button>
        </div>
      </div>
  
      <!-- Collapsible Reviews Section -->
      <div class="reviews-section">
        <h3 @click="toggleReviews" class="reviews-header">
          📢 Customer Reviews (9) 
          <span v-if="showReviews">⬆️</span>
          <span v-else>⬇️</span>
        </h3>
  
        <div v-if="showReviews">
          <div v-if="reviews.length > 0">
            <div v-for="review in reviews" :key="review.id" class="review">
              <div class="review-header">
                <strong>Femi Akintade</strong>
                <span class="stars">⭐ 4/5</span>
              </div>
              <p>His service is awesome</p>
            </div>
          </div>
          <p v-else>No reviews yet.</p>
  
          <!-- Add Review Form -->
          <div class="review-form">
            <h4>Add Your Review</h4>
            <input type="text" v-model="newReview.name" placeholder="Your Name" />
            <input type="number" v-model="newReview.rating" min="1" max="5" placeholder="Rating (1-5)" />
            <textarea v-model="newReview.comment" placeholder="Write a review"></textarea>
            <button @click="submitReview">Submit Review</button>
          </div>
        </div>
      </div>
  
      <!-- Map Section -->
      <div class="map-section">
        <h3>📍 Location on Map</h3>
        <div class="map-placeholder">Map will be integrated here</div>
      </div>
    </div>
  </template>
  
  <script setup>
      import { useRouter, useRoute } from 'vue-router'
    const router = useRouter()
    const route = useRoute()

    const {id} = route.params;

    // const startChat = () => {
    //   route.push(`/chats/${id}`);
    // };
    const startChat = () => {
    //     alert('i am here');
      router.push('/chats/123');
        // router.push('/Account');
    };
  </script>
  
  <style scoped>
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
  