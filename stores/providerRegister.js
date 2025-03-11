import { defineStore } from 'pinia'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from 'firebase/auth'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useProviderStore = defineStore('auth', () => {
    const userValue = ref(null)
    const userId = ref(localStorage.getItem('userId') || null) 
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
                userId.value = currentUser.uid 
                localStorage.setItem('userId', currentUser.uid);
            } else {
                userValue.value = null
                userId.value = null
                localStorage.removeItem('userId'); 
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
            console.log(error.value, 'Please Ensure network connectivity');
        } finally {
            isLoading.value = false;
        }
    };

    // PERMISSION FOR LOCATION ACCESS BEFORE REGISTERING
    const getLocationProvider = async () => {
        isLoading.value = true;
        error.value = null;
        try {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        reverseGeocode(position.coords.latitude, position.coords.longitude);
                        const latu = position.coords.latitude
                        const logi = position.coords.longitude
                        localStorage.setItem('latu', latu);
                        localStorage.setItem('lngu', logi);
                        console.log(latu, logi)
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
                lat: registrationData.lat,
                lng: registrationData.lng,
                Availability: 'active',
                Description: registrationData.description,
                isPremium: false,
                isVerified: false,
                identification: userId
            })
            console.log('User added to database')
        } catch (err) {
            error.value = err.message
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

        } catch (error) {
            error.value = error.message
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
        signinProviders,
        addressFetched,
        getLocationProvider
    }
})