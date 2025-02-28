import { defineStore } from 'pinia'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useUserProviderStore = defineStore('details', () => {
    const userDetails = ref(null)
    const isLoading = ref(false)
    const error = ref(null)


    // FETCHING DETAILS FOR PROVIDER
    const userDetailsFetch = async (userRegId) => {
        isLoading.value = true
        error.value = null

        try {
            const { $db } = useNuxtApp()
            const docRef = doc($db, 'REGISTERED_PROVIDERS', userRegId)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                userDetails.value = docSnap.data()
            }else{
                error.value = 'Provider not found'
            }
        } catch (err) {
            error.value = err.message || 'An error occrured while fetching data'
        } finally {
            isLoading.value = false
        }
    }

 

    
    
    return {
        isLoading,
        error,
        userDetails,
        userDetailsFetch,
    }
})