import { defineStore } from 'pinia'
import { ref as dbRef, push, remove, onChildAdded, off } from 'firebase/database'

export const useChatStore = defineStore('chat', () => {
    const messages = ref([])
    const activeChatId = ref(null)
    const messageListeners = ref([]) // Track active listeners for cleanup

    // GENERATE CONSISTENT CHAT ID
    const getChatId = (userUid, providerUid) => {
        return [userUid, providerUid].sort().join('_')
    }

    // FETCHING MESSAGES IN REAL TIME
    const fetchMessages = (userUid, providerUid) => {
        // Clean up existing listeners first
        clearMessageListeners()
        
        const { $realtimeDb } = useNuxtApp()
        activeChatId.value = getChatId(userUid, providerUid)
        messages.value = []
        
        const chatPath = `chats/${activeChatId.value}/messages`
        const chatRef = dbRef($realtimeDb, chatPath)
        
        // Store reference to detach later
        const callback = onChildAdded(chatRef, (snapshot) => {
            messages.value.push({id: snapshot.key, ...snapshot.val()})
        })
        
        messageListeners.value.push({ ref: chatRef, path: chatPath })
    }

    // Clear listeners when changing chats
    const clearMessageListeners = () => {
        messageListeners.value.forEach(listener => {
            off(listener.ref)
        })
        messageListeners.value = []
    }

    // SEND A MESSAGE
    const sendMessage = async(userUid, providerUid, text) => {
        if(!text.trim()) return

        const { $realtimeDb } = useNuxtApp()
        const chatPath = `chats/${getChatId(userUid, providerUid)}/messages`
        const messageData = {
            senderUid: userUid,
            text,
            timestamp: Date.now()
        }
        await push(dbRef($realtimeDb, chatPath), messageData)
    }

    // DELETE A MESSAGE
    const deleteMessage = async(messageId, currentUserUid) => {
        const { $realtimeDb } = useNuxtApp()
        const chatPath = `chats/${activeChatId.value}/messages/${messageId}`
        const message = messages.value.find(msg => msg.id === messageId)
        
        if(message?.senderUid === currentUserUid) {
            await remove(dbRef($realtimeDb, chatPath))
            messages.value = messages.value.filter(msg => msg.id !== messageId)
        } else {
            console.warn('Cannot delete message: not the sender')
        }
    }
    
    return {
        messages,
        activeChatId,
        fetchMessages,
        sendMessage,
        deleteMessage,
        clearMessageListeners
    }
})