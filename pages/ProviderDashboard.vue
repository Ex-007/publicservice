<template>
    <div class="dashboard">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li @click="activeTab = 'home'" :class="{ active: activeTab === 'home' }">🏠 Home</li>
          <li @click="activeTab = 'requests'" :class="{ active: activeTab === 'requests' }">📩 Service Requests</li>
          <li @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">👤 Profile</li>
          <li @click="activeTab = 'premium'" :class="{ active: activeTab === 'premium' }">💎 Upgrade to Premium</li>
          <li @click="logout">🚪 Logout</li>
        </ul>
      </aside>
  
      <!-- Main Content Area -->
      <main class="content">
        <section v-if="activeTab === 'home'">
          <h2>Welcome, Service Provider!</h2>
          <p>Here’s an overview of your recent activity.</p>
        </section>
  
        <section v-if="activeTab === 'requests'">
          <h2>Service Requests</h2>
          <p>List of customers who need your service will be displayed here.</p>
        </section>
  
        <section v-if="activeTab === 'profile'">
          <h2>Profile Settings</h2>
          <p>Edit your personal and service details.</p>
        </section>
  
        <section v-if="activeTab === 'premium'">
          <h2>Upgrade to Premium</h2>
          <p>Get listed at the top of search results and increase visibility.</p>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const activeTab = ref('home');
  
  const logout = () => {
    alert("Logging out...");
  };
  </script>
  
  <style scoped>
  .dashboard {
    display: flex;
    height: 100vh;
  }
  
  /* Sidebar */
  .sidebar {
    width: 250px;
    background: #007bff;
    color: white;
    padding: 20px;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar ul li {
    padding: 10px;
    cursor: pointer;
  }
  
  .sidebar ul li.active {
    background: white;
    color: #007bff;
    font-weight: bold;
  }
  
  .content {
    flex: 1;
    padding: 20px;
  }
  </style>
  