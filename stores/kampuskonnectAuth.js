import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import {addDoc, collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useAuthStore = defineStore('auth', () => {
    const userValue = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const canProceed = ref(false)

        // WATCHING FOR AUTH CHANGES
        const checkAuth = async () => {
            const { $auth } = useNuxtApp()
            onAuthStateChanged($auth, (currentUser) => {
                userValue.value = currentUser
            })
        }

            // REGISTER USER
    
    const registerUser = async (email, passsword, firstname, lastname, phoneNumber, dateOfBirth, gender, username) => {
        isLoading.value = true
        error.value = null
        try {
            const { $auth } = useNuxtApp()
            const response = await createUserWithEmailAndPassword($auth, email, passsword)
            if(response){
                const user = response.user
                const userId = user.uid
                
                console.log('User ID: ', userId, email, username)
                addUSerToDatabase(userId, email, username, firstname, lastname, phoneNumber, dateOfBirth, gender)
            }
        } catch (error) {
            error.value = error.message || 'An error occurred while registering user'
        }
    }

        // ADD USER TO DATABASE
        const addUSerToDatabase = async (userId, email, username, firstname, lastname, phoneNumber, dateOfBirth, gender) => {
            isLoading.value = true
            error.value = null
            try {
                const { $db } = useNuxtApp()
                const docRef = doc($db, 'REGISTERED_USERS', userId)
                await setDoc(docRef, {
                    firstname : firstname,
                    lastname : lastname,
                    phoneNumber : phoneNumber,
                    dateOfBirth : dateOfBirth,
                    gender : gender,
                    email : email,
                    username : username,
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
    const logInWithEmailAndPassword = async (email, password) => {
        isLoading.value = true
        error.value = null
        try {
            const { $auth } = useNuxtApp()
            const response = await signInWithEmailAndPassword($auth, email, password)
            if(response){
                const user = response.user
                userValue.value = user
            }
        } catch (error) {
            error.value = error.message || 'An error occurred while signing in'
        }finally{
            isLoading.value = false
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
            }
        } catch (error) {
            error.value = error.message || 'An error occurred while signing in with Google'
        }finally{
            isLoading.value = false
        }
    }

    // SIGN OUT            
    return {
        checkAuth,
        userValue,
        isLoading,
        error,
        canProceed,
        addUSerToDatabase,
        registerUser,
        logInWithEmailAndPassword,
        registerWithGoogle
    }
})