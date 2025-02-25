import { defineStore } from 'pinia'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useProdetailsStore = defineStore('details', () => {
    const providerDetails = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const updateInfo = ref(null)


    // FETCHING DETAILS FOR PROVIDER
    const providerDetailsFetch = async (id) => {

        console.log('this is the id', id)
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
    
    // UPDATING PROVIDER DETAILS
    const updateProvider = async (id, providerInfo) => {
        isLoading.value = true;
        error.value = null;
 
        try {
            const { $db } = useNuxtApp();
            if (!$db) {
                throw new Error("🔥 Firebase database is not initialized.");
            }
    
            if (!id) {
                throw new Error("⚠️ Invalid provider ID: " + id);
            }
    
            const updateRef = doc($db, 'REGISTERED_PROVIDERS', id);
    
            const filteredProviderInfo = Object.fromEntries(
                Object.entries(providerInfo).filter(([_, v]) => v !== undefined)
            );
    
            await updateDoc(updateRef, filteredProviderInfo);
    
            console.log("✅ Profile Updated Successfully");
            return true;
        } catch (err) {
            console.error("❌ Error Updating Profile:", err); 
            error.value = err?.message || JSON.stringify(err) || "Unknown error occurred";
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    
















    
    return {
        isLoading,
        error,
        providerDetails,
        providerDetailsFetch,
        updateProvider,
        updateInfo,
    }
})