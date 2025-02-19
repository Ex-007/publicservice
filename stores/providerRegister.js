import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import {addDoc, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useProviderStore = defineStore('auth', () => {
    const userValue = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const canProceed = ref(false)
    const canLogin = ref(false)
    const userIdentification = ref(null)

        // WATCHING FOR AUTH CHANGES
        const checkAuth = async () => {
            const { $auth } = useNuxtApp()
            onAuthStateChanged($auth, (currentUser) => {
                userValue.value = currentUser
            })
        }

            // REGISTER USER
        const registerProvider = async (registrationData) => {
            isLoading.value = true
            error.value = null
            try {
                const { $auth } = useNuxtApp()
                let email = registrationData.email
                let password = registrationData.password
                const response = await createUserWithEmailAndPassword($auth, email, password)
                if(response){
                    const user = response.user
                    const userId = user.uid
                    userIdentification.value = userId
                    // console.log('User ID: ', userId, email, username)
                    await providerRegister(userId, registrationData)
                }
            } catch (error) {
                error.value = error.message || 'An error occurred while registering user'
            }finally {
                isLoading.value = false;
            }
        }

        // ADD USER TO DATABASE
        const providerRegister = async (userId, registrationData) => {
            isLoading.value = true
            error.value = null
            try {
                const { $db } = useNuxtApp()
                const docRef = doc($db, 'REGISTERED_PROVIDERS', userId)
                await setDoc(docRef, {
                    Firstname : registrationData.firstname,
                    Lastname : registrationData.lastname,
                    PhoneNumber : registrationData.phoneNumber,
                    Email : registrationData.email,
                    YearsOfExperience : registrationData.yearsOfExperience,
                    Address : registrationData.address,
                    ServiceType : registrationData.serviceType,
                    ProfilePicture : null,
                    lat : null,
                    lng : null,
                    Availability : true,
                    Description : registrationData.description,
                    isPremium : false,
                    isVerified : false,
                })
                canProceed.value = true
                console.log('User added to database')
                console.log(canProceed.value)
            } catch (error) {
                console.error('Error adding user to database: ', error)
            }finally{
                isLoading.value = false
            }
        }

    // SIGN IN WITH EMAIL AND PASSWORD
    const providerLogin = async (loginDetails) => {
        isLoading.value = true
        error.value = null
        try {
            const { $auth } = useNuxtApp()
            const email = loginDetails.email
            const password = loginDetails.password
            const response = await signInWithEmailAndPassword($auth, email, password)
            if(response){
                const user = response.user
                userValue.value = user
            }
        } catch (error) {
            error.value = error.message || 'An error occurred while signing in'
        }finally{
            isLoading.value = false
            canLogin.value = true
        }
    }

    // REGISTER WITH GOOGLE
    const registerWithGoogle = async () => {
        isLoading.value = true
        error.value = null
        try {
            const { $auth } = useNuxtApp()
            const provider = new GoogleAuthProvider()
            const response = await signInWithPopup($auth, provider)
            if(response){
                const user = response.user
                userValue.value = user

                const userId = user.uid
                userIdentification.value = userId
                await providerRegister(userId, {
                    firstname : user.displayName,
                    lastname : null,
                    phoneNumber : null,
                    email : user.email,
                    yearsOfExperience : null,
                    address : null,
                    serviceType : null,
                    description : null
                })
                
            }
        } catch (error) {
            error.value = error.message || 'An error occurred while signing in with Google'
        }finally{
            isLoading.value = false
        }
    }

    // SIGN OUT            
    return {
        userIdentification,
        checkAuth,
        userValue,
        isLoading,
        error,
        canProceed,
        providerRegister,
        registerProvider,
        providerLogin,
        registerWithGoogle,
        canLogin
    }
})