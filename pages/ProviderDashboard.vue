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
        <!-- Home Section -->
        <section v-if="activeTab === 'home'">
          <h2>Welcome, [Provider Name]!</h2>
          <p>Here's an overview of your recent activity.</p>
          <ul>
            <li>✅ Completed Requests: 12</li>
            <li>⏳ Pending Requests: 4</li>
            <li>⭐ Average Rating: 4.8/5</li>
          </ul>
          <div class="buttonsB">
            <button @click="navigateToRequests">View Service Requests</button>
            <button @click="getVerified">Get Verified ✅</button>
          </div>
          <!-- <button @click="navigateToRequests">View Service Requests</button>
          <button @click="getVerified">Get Verified ✅</button> -->
        </section>
  
        <!-- Requests Section -->
        <section v-if="activeTab === 'requests'">
          <h2>Service Requests</h2>
          <p>Manage incoming service requests from customers.</p>
          <ul>
            <li>👨‍💼 John Doe - Plumbing Issue - 📍 2km away - <button>Accept</button></li>
            <li>👩‍💼 Sarah Smith - Electrical Repair - 📍 5km away - <button>Accept</button></li>
            <li>👨‍💼 Mark Lee - Car Mechanic - 📍 3km away - <button>Accept</button></li>
          </ul>
          <button @click="refreshRequests">Refresh Requests</button>
        </section>
  
        <!-- Profile Section -->
        <section v-if="activeTab === 'profile'">
          <h2>Profile Settings</h2>
          <p>Update your personal and service details.</p>
          <form>
            <label>Name:</label>
            <input type="text" v-model="profile.name" />
            <label>Service Type:</label>
            <input type="text" v-model="profile.serviceType" />
            <label>Phone:</label>
            <input type="text" v-model="profile.phone" />
            <button type="submit">Save Changes</button>
          </form>
        </section>
  
        <!-- Premium Section -->
        <section v-if="activeTab === 'premium'">
          <h2>Upgrade to Premium</h2>
          <p>Become a premium provider to get:</p>
          <ul>
            <li>🔝 Top listing priority</li>
            <li>📢 More visibility</li>
            <li>🎖 Exclusive offers</li>
          </ul>
          <button @click="upgradeToPremium">Upgrade Now</button>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  const router = useRouter();

  const getVerified = () => {
    router.push('/Verification')
  }
  
  const activeTab = ref('home');
  
  const profile = ref({
    name: "John Doe",
    serviceType: "Plumber",
    phone: "123-456-7890",
  });
  
  const logout = () => {
    alert("Logging out...");
  };
  
  const navigateToRequests = () => {
    activeTab.value = 'requests';
  };
  
  const refreshRequests = () => {
    alert("Refreshing service requests...");
  };
  
  const upgradeToPremium = () => {
    router.push('/Premium');
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
  
  button {
    padding: 8px 15px;
    border: none;
    background: #007bff;
    color: white;
    cursor: pointer;
    margin-top: 10px;
  }
  .buttonsB {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  </style>
  