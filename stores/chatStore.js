import { defineStore } from 'pinia'
import { ref as vueRef } from 'vue'
import { ref as dbRef, push, remove, onChildAdded, onValue, off } from 'firebase/database'
import { doc, getDoc, collection, query, where, getDocs, addDoc} from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { useNuxtApp } from '#app'

export const useChatStore = defineStore('chat', () => {
    const messages = vueRef([])
    const activeChatId = vueRef(null)
    const messageListeners = vueRef([]) 
    const error = vueRef(null)
    const isLoading = vueRef(false)
    const senderUid = vueRef(null)
    const senderDet = vueRef(null)
    const receiverUid = vueRef(null)
    const currentUser = vueRef(null)
    const userDetails = vueRef(null)

    // GET CURRENT LOGGED IN USER
    const getCurrentUser = async () => {
        const { $auth } = useNuxtApp()
        return new Promise((resolve) => {
            // First check if we already have the user
            if (senderUid.value) {
                resolve(currentUser.value)
                return
            }
            
            // Otherwise set up the listener
            const unsubscribe = onAuthStateChanged($auth, (user) => {
                if (user) {
                    currentUser.value = user
                    senderUid.value = user.uid
                    console.log('Current user UID:', senderUid.value)
                } else {
                    currentUser.value = null
                    senderUid.value = null
                }
                unsubscribe() 
                resolve(currentUser.value)
            })
        })
    }

    // CHECK IF USER OR PROVIDER'S USERID EXISTS IN EACH DATABASE
   

    // In your store
    const saveToSubCollection = async (providerUid, providerDetails) => {
    isLoading.value = true
    error.value = null
    // console.log('Starting saveToSubCollection with:', { providerUid, senderUid: senderUid.value })
    
    try {
        const { $db } = useNuxtApp()
        
        // Validate required data
        if (!senderUid.value || !providerUid) {
            // console.error('Missing UIDs:', { senderUid: senderUid.value, providerUid })
            error.value = 'Missing user or provider ID'
            isLoading.value = false
            return false
        }
        
        const userChatRef = collection($db, 'REGISTERED_USERS', senderUid.value, 'CHATS')
        const providerChatRef = collection($db, 'REGISTERED_PROVIDERS', providerUid, 'CHATS')
        
        // CHECKING IF THE DETAILS EXIST FOR USERS
        const userQuery = query(userChatRef, where('providerUid', '==', providerUid))
        const userSnapshot = await getDocs(userQuery)
        
        if (userSnapshot.empty) {
            // console.log('User document does not exist, creating...')
            await addDoc(userChatRef, {
                providerUid: providerUid,
                serviceType: providerDetails.serviceType,
                Firstname: providerDetails.firstname,
                Lastname: providerDetails.lastname,
                providerImage: providerDetails.profilePicture,
                createdAt: new Date() // Adding timestamp for debugging
            })
            // console.log('User document added successfully')
        } else {
            // console.log('Provider already exists in user chat:', userSnapshot.docs.length, 'docs')
        }

        // CHECKING FOR PROVIDERS
        const providerQuery = query(providerChatRef, where('userUid', '==', senderUid.value))
        const providerSnapshot = await getDocs(providerQuery)
        
        if (providerSnapshot.empty) {
            // console.log('Provider document does not exist, creating...')
            
            // Check if senderDet is defined
            if (!senderDet || !senderDet.value.Fullname) {
                // console.error('Missing senderDet data:', senderDet)
                error.value = 'Missing sender details'
                isLoading.value = false
                return false
            }
            
            await addDoc(providerChatRef, {
                userUid: senderUid.value,
                Fullname: senderDet.value.Fullname,
                userImage: senderDet.value.ProfilePicture,
                createdAt: new Date() 
            })
            // console.log('Provider document added successfully')
        } else {
            // console.log('User already exists in provider chat:', providerSnapshot.docs.length, 'docs')
        }
        
        isLoading.value = false
        return true
    } catch (err) {
        // console.error('Error in saveToSubCollection:', err)
        error.value = err.message || 'An error occurred while saving chat data'
        isLoading.value = false
        return false
    } finally {
        isLoading.value = false
    }
}

    // GENERATE CONSISTENT CHAT ID
    const getChatId = (userUid, providerUid) => {
        return [userUid, providerUid].sort().join('_')
    }

    // FETCHING MESSAGES IN REAL TIME
    const fetchMessages = async (providerUid) => {
        // Wait for the current user if not already set
        if (!senderUid.value) {
            await getCurrentUser()
            if (!senderUid.value) {
                console.error('User not authenticated')
                error.value = 'User not authenticated'
                return
            }
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

            // Get initial snapshot of all messages
            const initialListener = onValue(chatRef, (snapshot) => {
                if (snapshot.exists()) {
                    const messagesData = snapshot.val()
                    const messageArray = []
                    
                    // Convert object to array
                    Object.keys(messagesData).forEach(key => {
                        messageArray.push({
                            id: key,
                            ...messagesData[key]
                        })
                    })
                    
                    // Sort by timestamp
                    messageArray.sort((a, b) => a.timestamp - b.timestamp)
                    messages.value = messageArray
                }
                // Remove this listener after initial load
                off(chatRef, 'value', initialListener)
            }, (err) => {
                console.error('Error fetching initial messages:', err)
                error.value = err.message
            })

            // Add listener for new messages
            const newMessageListener = onChildAdded(chatRef, (snapshot) => {
                const messageData = snapshot.val()
                const newMessage = {
                    id: snapshot.key,
                    ...messageData
                }
                
                // Only add if not already in the array
                if (!messages.value.some(msg => msg.id === newMessage.id)) {
                    messages.value.push(newMessage)
                }
            }, (err) => {
                console.error('Error fetching new messages:', err)
                error.value = err.message
            })

            messageListeners.value.push({ ref: chatRef, listener: newMessageListener })
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
                text: messageText,
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

    // FETCH RECEIVER'S DETAILS
    const receiverDet = async (providerUid) => {
        console.log(providerUid)
        isLoading.value = true
        error.value = null

        try {
            const { $db } = useNuxtApp()
            const docRef = doc($db, 'REGISTERED_PROVIDERS', providerUid)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                userDetails.value = docSnap.data()
                // console.log(docSnap.data())
            }else{
                error.value = 'Provider not found'
            }
        } catch (err) {
            error.value = err.message || 'An error occrured while fetching data'
        } finally {
            isLoading.value = false
        }
    }

    // FETCH USER'S DETAILS
    const userDet = async () => {
        isLoading.value = true
        error.value = null

        try {
            const { $db } = useNuxtApp()
            const senderRef = doc($db, 'REGISTERED_USERS', senderUid.value)
            const senderSnapSnap = await getDoc(senderRef);
            if(senderSnapSnap.exists()){
                senderDet.value = senderSnapSnap.data()
                // console.log(senderSnapSnap.data())
            }else{
                error.value = 'Provider not found'
            }
        } catch (err) {
            error.value = err.message || 'An error occrured while fetching data'
        } finally {
            isLoading.value = false
        }
    }

    // FETCH USER'S DETAILS

    return {
        receiverDet,
        userDetails,
        messages,
        activeChatId,
        error,
        isLoading,
        senderUid,
        receiverUid,
        currentUser,
        fetchMessages,
        sendMessage,
        deleteMessage,
        clearMessageListeners,
        getCurrentUser,
        saveToSubCollection,
        userDet
    }
})