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
                    localStorage.removeItem('userIdd'); 
                }
            })
        }
    
    

















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
    const sendMessage = async(providerUid, newMessage) => {
        if(!newMessage.trim()) return

        const { $realtimeDb } = useNuxtApp()
        const chatPath = `chats/${getChatId(senderUid.value, providerUid)}/messages`
        const messageData = {
            senderUid: senderUid.value,
            newMessage,
            timestamp: Date.now()
        }
        await push(dbRef($realtimeDb, chatPath), messageData)
    }

    // DELETE A MESSAGe
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
        clearMessageListeners,
        getCurrentUser
    }
})