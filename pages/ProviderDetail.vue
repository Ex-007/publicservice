<template>
    <div class="provider-details">
      <div class="provider-header">
        <img :src="provider.image" alt="Provider Image" class="profile-image" />
        <h2>{{ provider.name }}</h2>
        <p class="service-type">{{ provider.serviceType }}</p>
        <p class="distance">📍 {{ provider.distance }} km away</p>
      </div>
  
      <div class="provider-info">
        <h3>About {{ provider.name }}</h3>
        <p>{{ provider.description }}</p>
  
        <h3>Contact</h3>
        <p>📞 <a :href="'tel:' + provider.phone">{{ provider.phone }}</a></p>
        <p>📍 {{ provider.location }}</p>
  
        <div class="action-buttons">
          <button class="chat-btn" @click="startChat">💬 Chat</button>
          <button class="call-btn" @click="callProvider">📞 Call</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from "vue-router";
  import { ref, onMounted } from "vue";
  
  // Dummy Data (Normally this would come from Firebase or API)
  const providers = [
    { id: 1, name: "John Doe", serviceType: "Plumber", phone: "123-456-7890", distance: 2, location: "Downtown, City", description: "Expert plumber with 10+ years experience.", image: "/img/plumber.jpg" },
    { id: 2, name: "Sarah Smith", serviceType: "Electrician", phone: "987-654-3210", distance: 4, location: "Uptown, City", description: "Professional electrician offering wiring and installation services.", image: "/img/electrician.jpg" },
    { id: 3, name: "Michael Lee", serviceType: "Mechanic", phone: "555-123-4567", distance: 3, location: "Midtown, City", description: "Auto repair expert for all vehicle types.", image: "/img/mechanic.jpg" },
    { id: 4, name: "Emma Brown", serviceType: "Tailor", phone: "333-999-0000", distance: 1, location: "Suburb, City", description: "Custom tailoring and fashion design specialist.", image: "/img/tailor.jpg" }
  ];
  
  const route = useRoute();
  const provider = ref(null);
  
  // Fetch provider details based on ID from the route
  onMounted(() => {
    const providerId = parseInt(route.params.id);
    provider.value = providers.find(p => p.id === providerId);
  });
  
  const startChat = () => {
    alert(`Starting chat with ${provider.value.name}...`);
  };
  
  const callProvider = () => {
    window.location.href = `tel:${provider.value.phone}`;
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
  </style>
  