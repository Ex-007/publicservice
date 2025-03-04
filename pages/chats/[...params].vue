<template>
  <div class="chat-container">
    <!-- Chat Header -->
    <div class="chat-header">
      <button class="back-btn" @click="goBack">&#8592;</button>
      <img src="/img/profilepicture.jpeg" alt="Provider" class="profile-pic" />
      <div class="provider-info">
        <h3>John Doe</h3>
        <p class="status">Online</p>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <div 
        v-for="message in chatStore.messages" 
        :key="message.id" 
        :class="['message', isCurrentUserMessage(message) ? 'sent' : 'received']"
      >
        <p>{{ message.text || message.newMessage || message.neuMessage }}</p>
        <span class="timestamp">{{ formatTimestamp(message.timestamp) }}</span>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="chat-input">
      <input 
        type="text" 
        placeholder="Type a message..." 
        v-model="newMessage"
        @keyup.enter="sendMessage"
      />
      <button class="send-btn" @click="sendMessage">&#9658;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chatStore'

const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()

// Get user ID and provider ID from route parameters
const params = route.params.params || [];
const [userId, providerUid] = params; 

// Reference to messages container for auto-scrolling
const messagesContainer = ref(null)

// New message input
const newMessage = ref('')

// Navigation
const goBack = () => {
  chatStore.clearMessageListeners()
  router.back()
}

// Check if message is from current user
const isCurrentUserMessage = (message) => {
  return message.senderUid === chatStore.currentUser?.uid;
}

// Format timestamp to readable time
const formatTimestamp = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// SEND MESSAGE
const sendMessage = () => {
  if(newMessage.value.trim() === ''){
    alert('You can\'t send an empty message')
    return
  }
  
  chatStore.sendMessage(providerUid, newMessage.value)
  newMessage.value = ''
  
  // Scroll to bottom after sending
  scrollToBottom()
}

// Scroll to bottom of messages
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

// FETCHING MESSAGES
const fetchMessages = async () => {
  await chatStore.fetchMessages(providerUid)
  scrollToBottom()
}

// Initialize chat and fetch messages
onMounted(async () => {
  await chatStore.getCurrentUser()
  await fetchMessages()
})

// Clean up listeners when component is destroyed
onUnmounted(() => {
  chatStore.clearMessageListeners()
})
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
  margin-bottom: 60px; /* Space for the input at bottom */
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

.sent .timestamp {
  color: #e0e0e0;
}

.chat-input {
  display: flex;
  padding: 10px;
  background: white;
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
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