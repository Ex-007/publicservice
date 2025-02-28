<template>
    <div>
        <div id="map" class="map">

        </div>
    </div>
</template>

<script setup>
    import {ref, onMounted, watch} from 'vue'
    // import { useNuxtApp } from '#app';
    import { useMapStore } from '@/stores/mapstory'
    const mapStore = useMapStore()

    const {$L} = useNuxtApp()
    const map = ref(null)
    const markers = ref([])
    const polyline = ref(null)
    const props = defineProps(['userLat', 'userLng', 'providerLat', 'providerLng'])


    const addMarkers =() => {
        if(!mapStore.userLocation || !mapStore.providerLocation) return

        console.log(mapStore.userLocation)
        console.log(mapStore.providerLocation)
        markers.value.push($L.marker([mapStore.userLocation.lat, mapStore.userLocation.lng])
        .addTo(map.value)
        .bindPopup('You')
        .openPopup()
        )

        markers.value.push($L.marker([mapStore.providerLocation.lat, mapStore.providerLocation.lng])
        .addTo(map.value)
        .bindPopup('Provider')
        .openPopup()
        )

        
    }

    const drawPolyLine = () => {
        if(!mapStore.userLocation || !mapStore.providerLocation){
            return
        }

        polyline.value = $L.polyline([
            [mapStore.userLocation.lat, mapStore.userLocation.lat],
            [mapStore.providerLocation.lat, mapStore.providerLocation.lat]
        ],
        {
                color: 'red'
            })
            .addTo(map.value)
    }



    onMounted(async () => {
        mapStore.setLocations(props.userLat, props.userLng, props.providerLat, props.providerLng)
        console.log(props.userLat, props.userLng, props.providerLat, props.providerLng)
        map.value = $L.map('map').setView([props.userLat, props.userLng], 13)

        $L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution : '&copy; openstreetmap contributors'
        }).addTo(map.value)
        addMarkers()
        drawPolyLine()
    })


</script>
    


<style scoped>
    .map{
        height: 400px;
        width: 100%;
    }
</style>