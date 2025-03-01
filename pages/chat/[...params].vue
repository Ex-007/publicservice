<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>Chat with {{ recipientName }}</h2>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="message in messages" :key="message.id" 
           :class="['message-wrapper', message.senderUid === currentUserId ? 'outgoing' : 'incoming']">
        <div class="message">
          <p>{{ message.text }}</p>
          <div class="message-meta">
            <span class="time">{{ formatTime(message.timestamp) }}</span>
            <button v-if="message.senderUid === currentUserId" 
                   class="delete-btn" @click="handleDelete(message.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <input 
        v-model="newMessage" 
        @keyup.enter="sendNewMessage" 
        placeholder="Type a message..." 
      />
      <button @click="sendNewMessage" :disabled="!newMessage.trim()">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chatStore'
// import { useUserStore } from '~/stores/userStore' 

const route = useRoute()
const chatStore = useChatStore()
// const userStore = useUserStore()

// Get IDs from route parameters
// const currentUserId = route.params.userId
// const providerId = route.params.providerId

const params = route.params.params || [];
const [currentUserId, providerId] = params;

// For displaying recipient name - update this based on your app's data structure
const recipientName = ref('User')

// Reference to messages container for auto-scrolling
const messagesContainer = ref(null)

// New message input
const newMessage = ref('')

// Get messages from store
const messages = computed(() => chatStore.messages)

// Initialize chat and fetch messages
onMounted(async () => {
  // Fetch recipient name - this would depend on your app's data structure
  // For example: recipientName.value = await userStore.getUserName(providerId)
  
  // Initialize chat and fetch messages
  chatStore.fetchMessages(currentUserId, providerId)
  
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
    await chatStore.sendMessage(currentUserId, providerId, newMessage.value)
    newMessage.value = ''
  }
}

// Handle message deletion
const handleDelete = async (messageId) => {
  await chatStore.deleteMessage(messageId, currentUserId)
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
  max-width: 900px;
  margin: 0 auto;
  background-color: #f5f5f5;
}

.chat-header {
  padding: 1rem;
  background-color: #4f46e5;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chat-messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message-wrapper {
  display: flex;
  margin-bottom: 1rem;
}

.message-wrapper.incoming {
  justify-content: flex-start;
}

.message-wrapper.outgoing {
  justify-content: flex-end;
}

.message {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
}

.incoming .message {
  background-color: white;
  border-bottom-left-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.outgoing .message {
  background-color: #4f46e5;
  color: white;
  border-bottom-right-radius: 0.25rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.outgoing .message-meta {
  color: rgba(255, 255, 255, 0.7);
}

.incoming .message-meta {
  color: #6b7280;
}

.delete-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  margin-left: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 1;
}

.chat-input {
  display: flex;
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #e5e7eb;
}

.chat-input input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  margin-right: 0.5rem;
  outline: none;
}

.chat-input button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: #4f46e5;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.chat-input button:hover {
  background-color: #4338ca;
}

.chat-input button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}
</style>