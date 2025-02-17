<!-- <template>
    <nav class="navbar">
        
            <nuxt-link to="/"><i class="fa fa-home"></i>Home</nuxt-link>
            <nuxt-link to="/Account"><i class="fa fa-user"></i>Account</nuxt-link>
            <nuxt-link to="/Notifications"><i class="fa fa-bell"></i>Notifications</nuxt-link>
            <nuxt-link to="/Profile"><i class="fa fa-heart"></i>Profile</nuxt-link>

    </nav>
</template>

<script setup>

</script>

<style scoped>
    .navbar{
        height: 50px;
        display: flex;
        justify-content: start;
        align-items: center;
        border-radius: 20px;
    }
    
    a{
        display: flex;
        align-items: center;
        gap: 5px;
        list-style-type: none;
        background-color: #007bff;
        color: white;
        padding: 10px;
        border: 2px solid white;
        text-decoration: none;
    }
    a:hover{
        background-color: white;
        color: #007bff;
    }
    .router-link-active{
        background-color: white;
        color: #007bff;
    }
</style> -->
<template>
    <nav class="navbar">
      <!-- Menu Icon for Mobile -->
      <div class="menu-icon" @click="toggleMenu">
        <i class="fa" :class="isMenuOpen ? 'fa-times' : 'fa-bars'"></i>
      </div>
  
      <!-- Navigation Links -->
      <div class="nav-links" :class="{ 'show-menu': isMenuOpen }">
        <nuxt-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          :class="{ 'active': isActive(link.path) }"
          @click="closeMenu"
        >
          <i :class="link.icon"></i>{{ link.name }}
        </nuxt-link>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useRoute } from "vue-router";
  
  const isMenuOpen = ref(false);
  const route = useRoute();
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };
  
  // Close menu when a link is clicked (for mobile usability)
  const closeMenu = () => {
    isMenuOpen.value = false;
  };
  
  // List of navigation links
  const links = [
    { name: "Home", path: "/", icon: "fa fa-home" },
    { name: "About Us", path: "/About", icon: "fa fa-user" },
    { name: "Notifications", path: "/Notifications", icon: "fa fa-bell" },
    { name: "Profile", path: "/Profile", icon: "fa fa-heart" },
  ];
  
  // Function to check if a link is active
  const isActive = (path) => computed(() => route.path === path).value;
  </script>
  
  <style scoped>
  /* Navbar Container */
  .navbar {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* border-radius: 20px; */
    padding: 0 15px;
    background-color: #007bff;
    color: white;
    position: relative;
    z-index: 10; /* 👈 Ensures navbar stays above hero section */
}
  
  /* Navigation Links */
  .nav-links {
    display: flex;
    gap: 10px;
    position: relative;
    z-index: 10; /* 👈 Important */
}
  
  .nav-links a {
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: 2px solid white;
    text-decoration: none;
    transition: 0.3s;
  }
  
  /* Active Link */
  .nav-links a.active {
    background-color: white;
    color: #007bff;
  }
  
  /* Hover Effect */
  .nav-links a:hover {
    background-color: white;
    color: #007bff;
  }
  
  /* Mobile Styles */
  .menu-icon {
    display: none;
    font-size: 24px;
    cursor: pointer;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .menu-icon {
      display: block;
    }
  
    .nav-links {
        position: absolute;
        top: 50px;
        left: 0;
        width: 100%;
        flex-direction: column;
        background-color: #007bff;
        display: none;
        z-index: 20; /* 👈 Ensures it’s above hero */
    }
  
    .nav-links.show-menu {
        display: flex;
    }
  
    .nav-links a {
      width: 100%;
      text-align: center;
      padding: 12px;
      border: none;
      border-bottom: 1px solid white;
    }
  }
  </style>
  