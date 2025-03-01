import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDGMDGWLCwQUYhDDAc0MWhrTBf4MRh_ttg",
  authDomain: "kampuskonnect-3d1d5.firebaseapp.com",
  databaseURL: "https://kampuskonnect-3d1d5-default-rtdb.firebaseio.com",
  projectId: "kampuskonnect-3d1d5",
  storageBucket: "kampuskonnect-3d1d5.appspot.com",
  messagingSenderId: "451610627457",
  appId: "1:451610627457:web:61b4c70d520410b603ac80"

  };

  const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    const storage = getStorage(app)
    const auth = getAuth(app)
    const realtimeDb = getDatabase(app)

    export{db, storage, auth, realtimeDb}