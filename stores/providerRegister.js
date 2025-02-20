import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
    const userValue = ref(null)
    const userId = ref(localStorage.getItem('userId') || null) 
    const isLoading = ref(false)
    const error = ref(null)
    const canProceed = ref(false)

    // WATCHING FOR AUTH CHANGES
    const checkAuth = async () => {
        const { $auth } = useNuxtApp()
        onAuthStateChanged($auth, (currentUser) => {
            if (currentUser) {
                userValue.value = currentUser
                userId.value = currentUser.uid 
                localStorage.setItem('userId', currentUser.uid);
            } else {
                userValue.value = null
                userId.value = null
                localStorage.removeItem('userId'); 
            }
        })
    }

    
    // REGISTER USER
    
    // const registerUser = async (email, password, username) => {
    //     isLoading.value = true
    //     error.value = null
    //     canProceed.value = false
    //     try {
    //         const { $auth } = useNuxtApp()
    //         const response = await createUserWithEmailAndPassword($auth, email, password)
    //         if(response){
    //             const user = response.user
    //             const userId = user.uid
    //             registrationId.value = userId
                
    //             await addUSerToDatabase(userId, email, username)
    //             canProceed.value = true
    //             console.log('User ID : ', userId, email, username)
    //         }
    //     } catch (error) {
    //         error.value = error.message || 'An error occurred while registering user'
    //         console.log(error.value)
    //     } finally {
    //         isLoading.value = false
    //     }
    // }

    const registerUser = async (email, password, username) => {
        isLoading.value = true
        error.value = null
        try {
            const { $auth } = useNuxtApp()
            const response = await createUserWithEmailAndPassword($auth, email, password)
            if (response) {
                const user = response.user
                userId.value = user.uid  // <-- Store userId after creation
                localStorage.setItem('userId', user.uid); // ✅ Save userId
                console.log('User ID:', userId.value, email, username)

                await addUSerToDatabase(user.uid, email, username)
                canProceed.value = true
            }
        } catch (err) {
            error.value = err.message || 'An error occurred while registering user'
        } finally {
            isLoading.value = false
        }
    }
    
    // ADD USER TO DATABASE
    // const addUSerToDatabase = async (userId, email, username) => {
    //     isLoading.value = true
    //     error.value = null
    //     try {
    //         const { $db } = useNuxtApp()
    //         const docRef = doc($db, 'REGISTERED_USERS', userId)
    //         await setDoc(docRef, {
    //             email : email,
    //             username : username,
    //             isPremium : false,
    //             isVerified : false
    //         })
    //         console.log('User added to database')
    //     } catch (error) {
    //         console.error('Error adding user to database: ', error)
    //         error.value = error.message || 'An error occurred while adding user to database'
    //     }
    // }

    const addUSerToDatabase = async (userId, email, username) => {
        isLoading.value = true
        error.value = null
        try {
            const { $db } = useNuxtApp()
            const docRef = doc($db, 'REGISTERED_USERS', userId)
            await setDoc(docRef, {
                email: email,
                username: username,
                isPremium: false,
                isVerified: false
            })
            console.log('User added to database')
        } catch (err) {
            console.error('Error adding user to database:', err)
        } finally {
            isLoading.value = false
        }
    }
    
    return {
        checkAuth,
        userValue,
        userId, 
        isLoading,
        error,
        canProceed,
        registerUser
    }
})