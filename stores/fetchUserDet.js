import { defineStore } from 'pinia'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useUsersStore = defineStore('details', () => {
    const userDetails = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const updateInfo = ref(null)
    const providers = ref([])
    let chatList = ref([])
    const availableProviders = computed(() => providers.value.length)


    // FETCHING DETAILS FOR PROVIDER
    const userDetailsFetch = async (userRegId) => {
        isLoading.value = true
        error.value = null

        try {
            const { $db } = useNuxtApp()
            const docRef = doc($db, 'REGISTERED_USERS', userRegId)
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
    
    // UPDATING PROVIDER DETAILS
    const getProviderFromSearch = async (serviceType, lat, lng) => {
        // console.log(serviceType, lat, lng);
        isLoading.value = true;
        error.value = null;
        providers.value = [];
    
        try {
            const { $db } = useNuxtApp();
            const providerRef = collection($db, "REGISTERED_PROVIDERS");
            const q = query(providerRef, where("ServiceType", "==", serviceType));
            const querySnapshot = await getDocs(q);
    
            if (querySnapshot.empty) {
                console.log("Provider does not exist");
                return;
            }
    
            let within2km = [];
            let within4km = [];
    
            querySnapshot.forEach((docc) => {
                const providerData = docc.data();
                const providerLat = providerData.lat;
                const providerLng = providerData.lng;
                // console.log(providerLat, providerLng);
    
                const distance = calculateDistance(lat, lng, providerLat, providerLng).toFixed(2);
                // console.log(distance);
    
                if (distance <= 40) {
                    within2km.push({ ...providerData, id: docc.id, distance, providerLat, providerLng });
                    // console.log(within2km);
                } else if (distance <= 4) {
                    within4km.push({ ...providerData, id: docc.id, distance, providerLat, providerLng });
                }
            });
    
            // Prioritize providers within 2km, otherwise take 4km ones
            providers.value = within2km.length > 0 ? within2km : within4km;
            // console.log(providers);
        } catch (err) {
            error.value = err.message || "An error occurred while fetching data";
            // console.log(error.value);
        } finally {
            isLoading.value = false;
        }
    };
    
    // FUNCTION TO LIST OUT ALL THE CHATS
    const fetchChats = async (userRegId) => {
        isLoading.value = true
        error.value = null
        // console.log('Fetching...', userRegId)
    
        try {
            const { $db } = useNuxtApp()
            const chatRef = collection($db, 'REGISTERED_USERS', userRegId, 'CHATS')
            const snapshot = await getDocs(chatRef)
            
            if(snapshot.empty){
                console.log('No chats found')
                return []
            }
            
            const chats = []
            snapshot.forEach(doc => {
                // console.log(doc.id, '=>', doc.data())
                chats.push({
                    id: doc.id,
                    ...doc.data()
                })
            })
            chatList.value = chats
            // console.log(chats)
            
            return chats
        } catch (err) {
            console.error('Error fetching chats:', err)
            error.value = err.message || 'An error occurred while fetching data'
            return []
        } finally {
            isLoading.value = false
        }
    }












    
    return {
        isLoading,
        error,
        userDetails,
        userDetailsFetch,
        updateInfo,
        getProviderFromSearch,
        availableProviders,
        providers,
        fetchChats,
        chatList
    }
})