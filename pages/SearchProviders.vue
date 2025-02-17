<template>
    <div class="search-page">
      <!-- Search Bar -->
      <div class="search-container">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search for a service (e.g., Plumber, Mechanic)" 
          @input="searchProviders"
        />
      </div>
  
      <!-- Results -->
      <div v-if="filteredProviders.length > 0" class="results">
        <h2>Available Providers</h2>
        <ul>
          <li v-for="provider in filteredProviders" :key="provider.id" class="provider-card">
            <img :src="provider.image" alt="Provider Image" class="provider-image" />
            <div class="provider-info">
              <h3>{{ provider.name }}</h3>
              <p>📌 {{ provider.serviceType }}</p>
              <p>📍 {{ provider.distance }} km away</p>
              <button @click="contactProvider(provider.phone)">📞 Contact</button>
            </div>
          </li>
        </ul>
      </div>
  
      <!-- No Results -->
      <div v-else class="no-results">
        <p>No providers found for "{{ searchQuery }}". Try another search.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Dummy Data
  const providers = ref([
    { id: 1, name: "John Doe", serviceType: "Plumber", phone: "123-456-7890", distance: 2, image: "/img/welder.jpeg" },
    { id: 2, name: "Sarah Smith", serviceType: "Electrician", phone: "987-654-3210", distance: 4, image: "/img/welder.jpeg" },
    { id: 3, name: "Michael Lee", serviceType: "Mechanic", phone: "555-123-4567", distance: 3, image: "/img/mechanic.jpeg" },
    { id: 4, name: "Emma Brown", serviceType: "Tailor", phone: "333-999-0000", distance: 1, image: "/img/tailor.jpeg" }
  ]);
  
  const searchQuery = ref("");
  const filteredProviders = ref(providers.value);
  
  // Search Function
  const searchProviders = () => {
    const query = searchQuery.value.toLowerCase();
    filteredProviders.value = providers.value.filter(provider => 
      provider.serviceType.toLowerCase().includes(query)
    );
  };
  
  // Contact Provider
  const contactProvider = (phone) => {
    alert(`Calling ${phone}...`);
  };
  </script>
  
  <style scoped>
  .search-page {
    padding: 20px;
  }
  
  .search-container {
    margin-bottom: 20px;
  }
  
  input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #007bff;
    border-radius: 5px;
  }
  
  .results {
    margin-top: 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  .provider-card {
    display: flex;
    align-items: center;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
  }
  
  .provider-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  
  .provider-info {
    flex-grow: 1;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
  
  .no-results {
    text-align: center;
    color: gray;
    font-style: italic;
  }
  </style>
  