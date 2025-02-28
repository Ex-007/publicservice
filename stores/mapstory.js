import { defineStore } from 'pinia'

export const useMapStore = defineStore('auth', () => {
    const isLoading = ref(false)
    const error = ref(null)
    const userLocation = ref(null)
    const providerLocation = ref(null)

    const setLocations = (userLat, userLng, providerLat, providerLng) => {
        userLocation.value = {
            lat: userLat,
            lng: userLng
        }
        providerLocation.value = {
            lat: providerLat,
            lng: providerLng
        }
    }













    
    return {
        providerLocation,
        userLocation,
        error,
        isLoading,
        setLocations
    }
})