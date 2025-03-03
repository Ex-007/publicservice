import { defineStore } from 'pinia'
import { ref as dbRef, push, remove, onChildAdded, off } from 'firebase/database'
import { onAuthStateChanged } from 'firebase/auth'

export const useChatStore = defineStore('chat', () => {
    const messages = ref([])
    const activeChatId = ref(null)
    const messageListeners = ref([]) 
    const error = ref(null)
    const isLoading = ref(false)
    const senderUid = ref(null)
    const receiverUid = ref(null)
    const chatId = ref(null)

    // GET CURRENT LOGGED IN USER
    const currentUserInfo = ref(null)

    const getCurrentUser = async () => {
        const { $auth } = useNuxtApp()
        onAuthStateChanged($auth, (currentUser) => {
            if (currentUser) {
                currentUserInfo.value = currentUser
                senderUid.value = currentUser.uid
                console.log('senderUid', senderUid.value)
                console.log(currentUser)
            } else {
                currentUserInfo.value = null
                senderUid.value = null
            }
        })
    }

    // GENERATE CONSISTENT CHAT ID
    const getChatId = (userUid, providerUid) => {
        return [userUid, providerUid].sort().join('_')
    }

    // FETCHING MESSAGES IN REAL TIME
    const fetchMessages = (providerUid) => {
        // Ensure we have a sender UID before proceeding
        if (!senderUid.value) {
            console.error('User not authenticated')
            error.value = 'User not authenticated'
            return
        }
        
        // Clean up existing listeners first
        clearMessageListeners()
        
        const { $realtimeDb } = useNuxtApp()
        activeChatId.value = getChatId(senderUid.value, providerUid)
        receiverUid.value = providerUid
        messages.value = [] // Clear existing messages
        isLoading.value = true
        
        try {
            const chatPath = `chats/${activeChatId.value}/messages`
            const chatRef = dbRef($realtimeDb, chatPath)
            
            // Store reference to detach later
            const listener = onChildAdded(chatRef, (snapshot) => {
                const messageData = snapshot.val()
                messages.value.push({
                    id: snapshot.key,
                    ...messageData
                })
            }, (err) => {
                console.error('Error fetching messages:', err)
                error.value = err.message
            })
            
            messageListeners.value.push({ ref: chatRef, listener })
        } catch (err) {
            console.error('Error setting up message listener:', err)
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    // Clear listeners when changing chats
    const clearMessageListeners = () => {
        messageListeners.value.forEach(listener => {
            off(listener.ref)
        })
        messageListeners.value = []
    }

    // SEND A MESSAGE
    const sendMessage = async (providerUid, messageText) => {
        if (!messageText.trim()) return
        if (!senderUid.value) {
            console.error('User not authenticated')
            error.value = 'User not authenticated'
            return
        }

        isLoading.value = true
        error.value = null
        
        try {
            const { $realtimeDb } = useNuxtApp()
            const chatId = getChatId(senderUid.value, providerUid)
            const chatPath = `chats/${chatId}/messages`
            
            const messageData = {
                senderUid: senderUid.value,
                text: messageText, // Using 'text' as the message content field
                timestamp: Date.now()
            }
            
            await push(dbRef($realtimeDb, chatPath), messageData)
        } catch (err) {
            console.error('Error sending message:', err)
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    // DELETE A MESSAGE
    const deleteMessage = async (messageId) => {
        if (!senderUid.value || !activeChatId.value) {
            console.error('User not authenticated or no active chat')
            error.value = 'User not authenticated or no active chat'
            return
        }

        const { $realtimeDb } = useNuxtApp()
        const chatPath = `chats/${activeChatId.value}/messages/${messageId}`
        const message = messages.value.find(msg => msg.id === messageId)
        
        if (message?.senderUid === senderUid.value) {
            try {
                await remove(dbRef($realtimeDb, chatPath))
                // The message will be automatically removed from the UI when Firebase sends the update
            } catch (err) {
                console.error('Error deleting message:', err)
                error.value = err.message
            }
        } else {
            console.warn('Cannot delete message: not the sender')
            error.value = 'Cannot delete message: not the sender'
        }
    }
    
    return {
        messages,
        activeChatId,
        error,
        isLoading,
        senderUid,
        receiverUid,
        fetchMessages,
        sendMessage,
        deleteMessage,
        clearMessageListeners,
        getCurrentUser
    }
})