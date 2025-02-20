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
            let email = registrationData.email
            let password = registrationData.password
            const response = await createUserWithEmailAndPassword($auth, email, password)
            if(response){
                const user = response.user
                const userId = user.uid
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

    // REGISTERING PROVIDERS WITH GOOGLE AUTH PROVIDER
    const registerProviderWithGoogleAuth = async () => {
        isLoading.value = true
        error.value = null
        canProceed.value = false

        try {
            const { $auth } = useNuxtApp()
            const provider = new GoogleAuthProvider()
            const gResponse = await signInWithPopup($auth, provider)
            if(gResponse){
                const gUser = gResponse.user
                const userId = gUser.uid

                // SAVING THE USERID TO LOCAL STORAGE
                localStorage.setItem('userId', userId);
                // SAVING THE DETAILS TO FIRESTORE
                await addUSerToDatabase(userId, {
                    FirstName: gResponse.user.displayName.split(' ')[0] || '',
                    LastName: gResponse.user.displayName.split(' ')[1] || '',
                    PhoneNumber : null,
                    Email : user.email,
                    ProfilePicture: gResponse.user.photoURL || null,
                    lat: null,
                    lng: null,
                    Availability: true,
                    Description: null,
                    isPremium: false,
                    isVerified: false,
                    YearsOfExperience: null,
                    Address: null,
                    ServiceType: null,
                    PhoneNumber: null,
                })
                canProceed.value = true

                console.log('user successfully created', userId)
            }
        } catch (err) {
            // error.value = err
            console.log(err)
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
        registerProvider,
        registerProviderWithGoogleAuth
    }
})