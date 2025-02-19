<template>
    <div class="premium-container">
      <h1>Upgrade to Premium</h1>
      <p>Get more visibility, priority listings, and exclusive features to grow your business.</p>
      
      <div class="plans">
        <div class="plan">
          <h2>Basic Plan</h2>
          <p>Priority listing in search results (below Standard & Premium)</p>
          <p>Access to customer inquiries</p>
          <p>Limited monthly bookings (10 per month)</p>
          <h3>$9.99/month</h3>
          <button @click="subscribe('Basic', 9.99)">Subscribe</button>
        </div>
  
        <div class="plan">
          <h2>Standard Plan</h2>
          <p>Higher priority in search results than Basic</p>
          <p>Unlimited bookings</p>
          <p>Verified badge displayed on profile</p>
          <p>Customer reviews highlighted</p>
          <h3>$19.99/month</h3>
          <button @click="subscribe('Standard', 19.99)">Subscribe</button>
        </div>
  
        <div class="plan">
          <h2>Premium Plan</h2>
          <p>Top priority in search results</p>
          <p>Featured provider badge</p>
          <p>Unlimited bookings & direct leads</p>
          <p>Profile showcased on homepage</p>
          <p>Exclusive marketing and promotion</p>
          <h3>$39.99/month</h3>
          <button @click="subscribe('Premium', 39.99)">Subscribe</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  
  const subscribe = (plan, price) => {
    router.push(`/payment/${plan}/${price}`);
  };
  </script>
  
  <style scoped>
  .premium-container {
    text-align: center;
    padding: 20px;
  }
  
  .plans {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  
  .plan {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    background: #f9f9f9;
    text-align: center;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px;
    margin-top: 10px;
    cursor: pointer;
    border-radius: 5px;
  }
  
  button:hover {
    background: #0056b3;
  }
  </style>
  