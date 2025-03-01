<template>
  <div class="chat-container">
    <!-- Chat Header -->
    <div class="chat-header">
      <button class="back-btn" @click="goBack">&#8592;</button>
      <img src="/public/img/mechanic.jpeg" alt="Provider" class="profile-pic" />
      <div class="provider-info">
        <h3>{{ recipientName }}</h3>
        <p class="status">Online</p>
      </div>
    </div>

    <!-- Chat Messages -->
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" 
           :class="['message', message.senderUid === userId ? 'sent' : 'received']">
        <p>{{ message.text }}</p>
        <div class="message-actions">
          <button v-if="message.senderUid === userId" 
                 class="delete-btn" @click="handleDelete(message.id)">
            <span class="delete-icon">🗑️</span>
          </button>
          <span class="timestamp">{{ formatTime(message.timestamp) }}</span>
        </div>
      </div>
    </div>

    <!-- Chat Input -->
    <div class="chat-input">
      <input 
        type="text" 
        v-model="newMessage" 
        @keyup.enter="sendNewMessage" 
        placeholder="Type a message..." 
      />
      <button class="send-btn" @click="sendNewMessage">&#9658;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chatStore'

const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()

// Get user ID and provider ID from route parameters
  const params = route.params.params || [];
  const [userId, providerId] = params; 

// Reference to messages container for auto-scrolling
const messagesContainer = ref(null)

// Set placeholder recipient name (you can fetch the actual name from your database)
const recipientName = ref(providerId || 'Provider')

// New message input
const newMessage = ref('')

// Get messages from store
const messages = computed(() => chatStore.messages)

// Navigation
const goBack = () => {
  chatStore.clearMessageListeners()
  router.back()
}

// Initialize chat and fetch messages
onMounted(async () => {
  
  // Fetch messages
  chatStore.fetchMessages(userId, providerId)
  
  // Scroll to bottom initially when messages load
  await nextTick()
  scrollToBottom()
})

// Clean up listeners when component is destroyed
onUnmounted(() => {
  chatStore.clearMessageListeners()
})

// Watch for new messages to auto-scroll
watch(() => chatStore.messages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})

// Format timestamp to readable time
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Send a new message
const sendNewMessage = async () => {
  if (newMessage.value.trim()) {
    await chatStore.sendMessage(userId, providerId, newMessage.value)
    newMessage.value = ''
  }
}

// Handle message deletion
const handleDelete = async (messageId) => {
  await chatStore.deleteMessage(messageId, userId)
}

// Scroll to bottom of chat
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
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

.message-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 5px;
}

.delete-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0;
  margin-right: 5px;
  font-size: 12px;
}

.received .delete-btn {
  color: rgba(0, 0, 0, 0.5);
}

.delete-icon {
  opacity: 0.7;
}

.delete-btn:hover .delete-icon {
  opacity: 1;
}

.timestamp {
  font-size: 12px;
  color: gray;
  text-align: right;
}

.sent .timestamp {
  color: rgba(255, 255, 255, 0.7);
}

.chat-input {
  display: flex;
  padding: 10px;
  background: white;
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