import { defineStore } from 'pinia'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useProdetailsStore = defineStore('details', () => {
    const providerDetails = ref(null)
    const isLoading = ref(false)
    const error = ref(null)


    // FETCHING DETAILS FOR PROVIDER
    const providerDetailsFetch = async (id) => {
        isLoading.value = true
        error.value = null

        try {
            const { $db } = useNuxtApp()
            const docRef = doc($db, 'REGISTERED_PROVIDERS', id)
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                providerDetails.value = docSnap.data()
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
        providerDetails,
        providerDetailsFetch
    }
})