<template>
    <div class="policy-container">
      <nav class="policy-nav">
        <router-link to="/privacy-policy">Privacy Policy</router-link>
        <router-link to="/terms-of-service">Terms of Service</router-link>
      </nav>
      
      <section class="policy-content">
        <router-view></router-view>
      </section>
    </div>
  </template>
  
  <style scoped>
  .policy-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .policy-nav {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #007bff;
    border-radius: 5px;
  }
  
  .policy-nav a {
    color: white;
    text-decoration: none;
    padding: 10px;
  }
  
  .policy-nav a:hover {
    background: white;
    color: #007bff;
    border-radius: 3px;
  }
  
  .policy-content {
    margin-top: 20px;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 5px;
  }
  </style>
  