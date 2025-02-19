<template>
    <div class="payment-container">
      <h2>Subscription Payment</h2>
      <div class="subscription-details">
        <p><strong>Plan:</strong> {{ planName }}</p>
        <p><strong>Price:</strong> ${{ price }}</p>
      </div>
      <button class="pay-btn">Proceed to Payment</button>
    </div>
  </template>
  
  <script setup>
  import { useRoute } from 'vue-router';
  
  const route = useRoute();
  const params = route.params.params || [];
  const [planName, price] = params;
  </script>
  
  <style scoped>
  .payment-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background: #f9f9f9;
    min-height: 100vh;
  }
  
  h2 {
    margin-bottom: 20px;
  }
  
  .subscription-details {
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    margin-bottom: 20px;
  }
  
  .pay-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .pay-btn:hover {
    background: #0056b3;
  }
  </style>
  