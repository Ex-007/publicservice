import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useProviderStore = defineStore('auth', () => {
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

    
    // REGISTERING THE PROVIDER
    const registerProvider = async (registrationData) => {
        isLoading.value = true
        error.value = null
        canProceed.value = false
        try {
            const { $auth } = useNuxtApp()
            var email = registrationData.email
            var password = registrationData.password
            const response = await createUserWithEmailAndPassword($auth, email, password)
            if(response){
                const user = response.user
                let userId = user.uid
                localStorage.setItem('userId', userId);
                
                await addUSerToDatabase(userId, registrationData)
                canProceed.value = true
                console.log('User ID : ', userId, email)
            }
        } catch (error) {
            error.value = error.message || 'An error occurred while registering user'
            console.log(error.value)
        } finally {
            isLoading.value = false
        }
    }


    // ADDING THE REGISTERED PROVIDERS DETAILS TO FIRESTORE.
    const addUSerToDatabase = async (userId, registrationData) => {
        isLoading.value = true
        error.value = null
        try {
            const { $db } = useNuxtApp()
            const docRef = doc($db, 'REGISTERED_PROVIDERS', userId)
            await setDoc(docRef, {
                Firstname: registrationData.firstName,  
                Lastname: registrationData.lastName,    
                PhoneNumber: registrationData.phoneNumber,
                Email: registrationData.email,
                YearsOfExperience: registrationData.yearsOfExperience,
                Address: registrationData.address,
                ServiceType: registrationData.serviceType,
                ProfilePicture: null,
                lat: null,
                lng: null,
                Availability: true,
                Description: registrationData.description,
                isPremium: false,
                isVerified: false,
            })
            console.log('User added to database')
        } catch (err) {
            console.error('Error adding user to database:', err)
        } finally {
            isLoading.value = false
        }
    }

    // SIGNING IN PROVIDERS
    const signinProviders = async (loginDetails) => {
        isLoading.value = true
        error.value = null
        canProceed.value = false
        try {
            const { $auth } = useNuxtApp()
            var email = loginDetails.email
            var password = loginDetails.password

            const userCredential = await signInWithEmailAndPassword($auth, email, password)
            if(userCredential){
                let userId = userCredential.user.uid
                localStorage.setItem('userId', userId);

                setTimeout(() => {
                    canProceed.value = true
                }, 1000);
            }
        } catch (error) {
            error.value = error.message || 'An error occurred while signing in'
            console.log(error.message)
        } finally{
            isLoading.value = false
        }
    }

    // THE logout btn
    const logOutProvider = async () => {
        isLoading.value = true
        error.value = null
    }













    
    return {
        checkAuth,
        userValue,
        userId, 
        isLoading,
        error,
        canProceed,
        registerProvider,
        signinProviders
    }
})