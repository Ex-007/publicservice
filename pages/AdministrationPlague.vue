<template>
    <div>
        <div class="overHead">
            <h3>Admin Dashboard</h3>
            <h4>Signed in as Iron Man</h4>
        </div>
        <div class="admin-dashboard">
          <!-- <h2>Admin Dashboard</h2> -->
          
          <!-- Sidebar Navigation -->
          <nav class="sidebar">
            <ul>
              <li @click="setActive('verification')">Provider Verification</li>
              <li @click="setActive('providers')">Manage Providers</li>
              <li @click="setActive('users')">Manage Users</li>
              <li @click="setActive('subscriptions')">Subscription Management</li>
              <li @click="setActive('support')">Support & Complaints</li>
              <li @click="setActive('analytics')">Analytics & Reports</li>
            </ul>
          </nav>
          
          <!-- Dynamic Content Area -->
          <div class="content">
            <div v-if="activeTab === 'verification'">
              <h3>Provider Verification Requests</h3>
              <p>List of providers awaiting verification...</p>
            </div>
            
            <div v-if="activeTab === 'providers'">
              <h3>Manage Service Providers</h3>
              <p>View, edit, or remove service providers...</p>
            </div>
            
            <div v-if="activeTab === 'users'">
              <h3>Manage Users</h3>
              <p>View, update, or ban users...</p>
            </div>
            
            <div v-if="activeTab === 'subscriptions'">
              <h3>Subscription Management</h3>
              <p>Monitor premium service providers...</p>
            </div>
            
            <div v-if="activeTab === 'support'">
              <h3>Support & Complaints</h3>
              <p>Handle user complaints and queries...</p>
            </div>
            
            <div v-if="activeTab === 'analytics'">
              <h3>Analytics & Reports</h3>
              <p>Monitor platform activity and growth...</p>
            </div>
          </div>
        </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const activeTab = ref('verification');
  
  const setActive = (tab) => {
    activeTab.value = tab;
  };
  </script>
  
  <style scoped>
  .admin-dashboard {
    display: flex;
    height: 100vh;
  }
  
  .sidebar {
    width: 250px;
    background: #007bff;
    color: white;
    padding: 20px;
  }
  .overHead {
    background: #007bff;
    color: white;
    padding: 20px;
    display: flex;
    justify-content: space-between;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid white;
  }
  
  .sidebar li:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .content {
    flex-grow: 1;
    padding: 20px;
  }
  </style>
  