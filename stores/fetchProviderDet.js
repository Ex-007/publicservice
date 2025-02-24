import { defineStore } from 'pinia'
import {collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc, deleteField, query, where, orderBy} from 'firebase/firestore'
import { ref as storageRef, getDownloadURL, uploadBytesResumable  } from 'firebase/storage'

export const useProdetailsStore = defineStore('details', () => {
    const providerDetails = ref(null)
    const isLoading = ref(false)
    const error = ref(null)
    const updateInfo = ref(null)
    const uploading = ref(false)
    const uploadError = ref(null)


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
    
            // Remove undefined fields before updating
            const filteredProviderInfo = Object.fromEntries(
                Object.entries(providerInfo).filter(([_, v]) => v !== undefined)
            );
    
            await updateDoc(updateRef, filteredProviderInfo);
    
            console.log("✅ Profile Updated Successfully");
            return true;
        } catch (err) {
            console.error("❌ Error Updating Profile:", err); // Log full error
            error.value = err?.message || JSON.stringify(err) || "Unknown error occurred";
            return false;
        } finally {
            isLoading.value = false;
        }
    };

    // UPDATE THE PROFILE PICTURE
    // const changeProfilePicture = async (id, file) => {
    //     uploading.value = true;
    //     error.value = null;
    //       if (!file) {
    //         uploadError.value = 'No file selected.';
    //         return;
    //       }
    //       if (!id) {
    //         uploadError.value = 'No User Id Detected.';
    //         throw new Error("⚠️ Invalid provider ID: " + id);
    //         }
    //       if (!file.type.startsWith('image/')) {
    //         uploadError.value = 'Only image files are allowed.';
    //         return;
    //       }


    //       try {
              
    //         const { $db, $storage } = useNuxtApp()
    //         const storageRef = ref($storage, `profileImages/${id}/${file.name}`);
    //         const snapshot = await uploadBytes(storageRef, file);
    //         const downloadURL = await getDownloadURL(snapshot.ref);

    //         const providerRef = doc($db, 'REGISTERED_PROVIDERS', id)
    //         await updateDoc(providerRef, {
    //             ProfilePicture : downloadURL
    //         })
    //         uploading.value = false
            
    //     } catch (error) {
    //         uploadError.value = error.message
    //         uploading.value = false
    //     }
    // }
    

    const changeProfilePicture = async (id, file) => {
        uploading.value = true;
        uploadError.value = null;

        console.log("🚀 ~ file", file)
    
        if (!file) {
            uploadError.value = 'No file selected.';
            uploading.value = false;
            return false;
        }
        if (!id) {
            uploadError.value = 'No User Id Detected.';
            uploading.value = false;
            return false;
        }
        if (!file.type.startsWith('image/')) {
            uploadError.value = 'Only image files are allowed.';
            uploading.value = false;
            return false;
        }
    
        try {
            const { $db, $storage } = useNuxtApp();
            const storageReff = storageRef($storage, `profileImages/${id}/${file.name}`);
            
            const uploadTask = uploadBytesResumable(storageReff, file);
    
            await new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                    null,
                    (error) => {
                        uploadError.value = error.message;
                        uploading.value = false;
                        reject(error);
                    },
                    async () => {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        const providerRef = doc($db, 'REGISTERED_PROVIDERS', id);
                        await updateDoc(providerRef, { ProfilePicture: downloadURL });
                        uploading.value = false;
                        resolve(downloadURL);
                    }
                );
            });
    
            return true;
        } catch (error) {
            uploadError.value = error.message;
            uploading.value = false;
            return false;
        }
    };

    // const handleFile = async(id,file) => {
    //     console.log("🚀 ~ file", file, id)
    // }
    
    
    


















    
    return {
        isLoading,
        error,
        providerDetails,
        providerDetailsFetch,
        updateProvider,
        updateInfo,
        uploadError,
        uploading,
        changeProfilePicture,
        handleFile
    }
})