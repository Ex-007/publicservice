import { defineStore } from 'pinia'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'

export const useUsersStore = defineStore('details', () => {
    const userDetails = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const updateInfo = ref(null)
    const providers = ref([])
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
    // const updateUser = async (id, providerInfo) => {
    //     isLoading.value = true;
    //     error.value = null;
 
    //     try {
    //         const { $db } = useNuxtApp();
    //         if (!$db) {
    //             throw new Error("🔥 Firebase database is not initialized.");
    //         }
    
    //         if (!id) {
    //             throw new Error("⚠️ Invalid provider ID: " + id);
    //         }
    
    //         const updateRef = doc($db, 'REGISTERED_PROVIDERS', id);
    
    //         const filteredProviderInfo = Object.fromEntries(
    //             Object.entries(providerInfo).filter(([_, v]) => v !== undefined)
    //         );
    
    //         await updateDoc(updateRef, filteredProviderInfo);
    
    //         console.log("✅ Profile Updated Successfully");
    //         return true;
    //     } catch (err) {
    //         console.error("❌ Error Updating Profile:", err); 
    //         error.value = err?.message || JSON.stringify(err) || "Unknown error occurred";
    //         return false;
    //     } finally {
    //         isLoading.value = false;
    //     }
    // };

// CALCULATING THE DISTANCE BETWEEN TWO POINTS
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        console.log(lat1, lon1, lat2, lon2)
        const R = 6371; 
        const deg2rad = (deg) => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);  
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c;
        return d;
    };

    // GETTING PROVIDER FROM STORE
    // const getProviderFromSearch = async (serviceType, lat, lng) => {
    //     console.log(serviceType, lat, lng)
    //     isLoading.value = true
    //     error.value = null
    //     providers.value = []
    //     try {
    //         const {$db} = useNuxtApp()
    //         const providerRef = collection($db, "REGISTERED_PROVIDERS")
    //         const q = query(providerRef, where("ServiceType", "==", serviceType))
    //         const querySnapshot = await getDocs(q)
    //         console.log(querySnapshot.data())
    //         let filteredProviders = []
    //         EXTRACT PROVIERS WITHING 2KM RADIUS
    //         querySnapshot.forEach((docc) => {
    //             const providerData = docc.data()
    //             const providerLat = providerData.lat
    //             const providerLng = providerData.lng
    //             console.log(providerLat, providerLng)
    //             const distance = calculateDistance(lat, lng, providerLat, providerLng)
    //             console.log(distance)
    //             if(distance <= 2){
    //                 filteredProviders.push({...providerData, id: docc.id})
    //             }

    //             IF THERE'S NO VALUE WITHING 2KM, EXTEND TO 4 KM
    //             if(filteredProviders.length === 0){
    //                 if(distance <= 4){
    //                     filteredProviders.push({...providerData, id: docc.id})
    //                 }
    //             }
    //         }
    //         )
    //         providers.value = filteredProviders
    //         console.log(filteredProviders)
    //     }
    //     catch (err) {
    //         error.value = err.message || 'An error occrured while fetching data'
    //     } finally {
    //         isLoading.value = false
    //     }
    // }

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
            console.log(providers);
        } catch (err) {
            error.value = err.message || "An error occurred while fetching data";
            console.log(error.value);
        } finally {
            isLoading.value = false;
        }
    };
    













    
    return {
        isLoading,
        error,
        userDetails,
        userDetailsFetch,
        updateInfo,
        getProviderFromSearch,
        availableProviders,
        providers
    }
})