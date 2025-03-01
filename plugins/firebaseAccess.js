import { db, storage, auth, realtimeDb } from "@/firebase/firebaseConfigurations";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.provide('db', db)
    nuxtApp.provide('storage', storage)
    nuxtApp.provide('auth', auth)
    nuxtApp.provide('realtimeDb', realtimeDb)
    });