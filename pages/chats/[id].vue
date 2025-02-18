<template>
    <div class="chat-container">
      <!-- Chat Header -->
      <div class="chat-header">
        <button class="back-btn" @click="goBack">&#8592;</button>
        <img src="/public/img/mechanic.jpeg" alt="Provider" class="profile-pic" />
        <div class="provider-info">
          <h3>John Doe {{ id }}</h3>
          <p class="status">Online</p>
        </div>
      </div>
  
      <!-- Chat Messages -->
      <div class="chat-messages">
        <div class="message received">
          <p>Hello! How can I help you today?</p>
          <span class="timestamp">10:30 AM</span>
        </div>
        <div class="message sent">
          <p>Hi, I need assistance with my plumbing issue.</p>
          <span class="timestamp">10:32 AM</span>
        </div>
      </div>
  
      <!-- Chat Input -->
      <div class="chat-input">
        <input type="text" placeholder="Type a message..." />
        <button class="send-btn">&#9658;</button>
      </div>
    </div>
  </template>
  
  <script setup>
      import { useRouter, useRoute } from 'vue-router'
    const router = useRouter()
    const route = useRoute()

    const goBack = () => {
        router.back();
    };
  const {id} = route.params;
</script>

  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: #f5f5f5;
  }
  
  .chat-header {
    display: flex;
    align-items: center;
    background: #007bff;
    color: white;
    padding: 10px;
  }
  
  .back-btn {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    margin-right: 10px;
  }
  
  .profile-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  
  .provider-info h3 {
    margin: 0;
    font-size: 16px;
  }
  
  .provider-info .status {
    font-size: 12px;
    color: #cfcfcf;
  }
  
  .chat-messages {
    flex-grow: 1;
    padding: 15px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }
  
  .message {
    max-width: 75%;
    padding: 10px;
    border-radius: 10px;
    margin-bottom: 10px;
    position: relative;
  }
  
  .received {
    background: #ffffff;
    align-self: flex-start;
  }
  
  .sent {
    background: #007bff;
    color: white;
    align-self: flex-end;
  }
  
  .timestamp {
    font-size: 12px;
    color: gray;
    display: block;
    margin-top: 5px;
    text-align: right;
  }
  
  .chat-input {
    display: flex;
    padding: 10px;
    background: white;
    position: fixed;
    bottom: 0;
    width: 100%;
  }
  
  .chat-input input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .send-btn {
    background: #007bff;
    border: none;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 10px;
  }
  </style>
  