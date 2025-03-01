import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useUserStore = defineStore('userauth', () => {
    const userValue = ref(null)
    const userIdd = ref(localStorage.getItem('userIdd') || null) 
    const isLoading = ref(false)
    const error = ref(null)
    const canProceed = ref(false)
    const addressFetched = ref('')

    // WATCHING FOR AUTH CHANGES
    const checkAuth = async () => {
        const { $auth } = useNuxtApp()
        onAuthStateChanged($auth, (currentUser) => {
            if (currentUser) {
                userValue.value = currentUser
                userIdd.value = currentUser.uid 
                localStorage.setItem('userIdd', currentUser.uid);
            } else {
                userValue.value = null
                userIdd.value = null
                localStorage.removeItem('userIdd'); 
            }
        })
    }

    // REVERSE GEOCODING FUNCTION
    const reverseGeocode = async (lat, lng) => {
        // console.log(lat, lng);
        isLoading.value = true;
        error.value = null;
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
            if (!response.ok) throw new Error('Failed to fetch address');
            const data = await response.json();
            addressFetched.value = data.display_name || 'Address not found';
            // console.log('Address:', addressFetched.value);
        } catch (err) {
            error.value = err.message || 'An error occurred while reverse geocoding';
            // console.log(error.value, 'Please Ensure network connectivity');
        } finally {
            isLoading.value = false;
        }
    };
    
    // PERMISSION FOR LOCATION ACCESS BEFORE REGISTERING
    const getLocation = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        reverseGeocode(position.coords.latitude, position.coords.longitude);
                        localStorage.setItem('lat', position.coords.latitude);
                        localStorage.setItem('lng', position.coords.longitude);
                    },
                    (err) => {
                        error.value = err.message || 'An error occurred while fetching location';
                        console.log(error.value);
                    }
                );
            } else {
                error.value = 'Geolocation is not supported by this browser.';
                console.log(error.value);
            }
        } finally {
            isLoading.value = false;
        }
    };

    // REGISTERING THE USER
    const registerUser = async (userDetails) => {
        isLoading.value = true
        error.value = null
        canProceed.value = false
        try {
            const { $auth } = useNuxtApp()
            var email = userDetails.email
            var password = userDetails.password
            const response = await createUserWithEmailAndPassword($auth, email, password)
            if(response){
                const user = response.user
                let userId = user.uid
                localStorage.setItem('userIdd', userId);
                
                await addUSerToDatabase(userId, userDetails)
                canProceed.value = true
                // console.log('User ID : ', userId, email)
            }
        } catch (err) {
            error.value = err.message || 'An error occurred while registering user'
            console.log(err.value)
        } finally {
            isLoading.value = false
        }
    }

    // ADDING THE REGISTERED PROVIDERS DETAILS TO FIRESTORE.
    const addUSerToDatabase = async (userId, userDetails) => {
        isLoading.value = true
        error.value = null
        try {
            const { $db } = useNuxtApp()
            const docRef = doc($db, 'REGISTERED_USERS', userId)
            await setDoc(docRef, {
                Fullname: userDetails.fullName,     
                PhoneNumber: userDetails.phoneNumber,
                Email: userDetails.email,
                Address: userDetails.address,
                ProfilePicture: null,
                lat: userDetails.lat,
                lng: userDetails.lng,
                isPremium: false,
                isVerified: false,
                identification: userId
            })
            console.log('User added to database')
        } catch (err) {
            console.error('Error adding user to database:', err)
        } finally {
            isLoading.value = false
        }
    }

    // SIGNING IN PROVIDERS
    const signinUser = async (signDetails) => {
        isLoading.value = true
        error.value = null
        canProceed.value = false
        try {
            const { $auth } = useNuxtApp()
            var email = signDetails.email
            var password = signDetails.password

            const userCredential = await signInWithEmailAndPassword($auth, email, password)
            if(userCredential){
                let userId = userCredential.user.uid
                localStorage.setItem('userIdd', userId);

                setTimeout(() => {
                    canProceed.value = true
                }, 1000);
            }
        } catch (err) {
            error.value = err.message || 'An error occurred while signing in'
            console.log(err.message)
        } finally{
            isLoading.value = false
        }
    }

    // THE logout btn
    const logOutProvider = async () => {
        isLoading.value = true
        error.value = null
        canProceed.value = false
        try {
            const { $auth } = useNuxtApp()
            await signOut($auth)
            setTimeout(() => {
                canProceed.value = true
            }, 1000);

        } catch (err) {
            error.value = error.message
        }
    }













    
    return {
        checkAuth,
        userIdd, 
        isLoading,
        error,
        canProceed,
        registerUser,
        signinUser,
        addressFetched,
        getLocation
    }
})