<template>
    <div class="dashboard">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
          <h2 class='dashsay'>Dashboard</h2>
        <div class='profileP'>
            <img :src="providerInfo.ProfilePicture || '/img/profilepicture.jpeg'" alt="Profile Picture" class="profilePicture" />
            <p v-if="tracking">{{tracking}}</p>
        </div>
        <ul>
          <li @click="activeTab = 'home'" :class="{ active: activeTab === 'home' }">🏠 Home</li>
          <li @click="activeTab = 'requests'" :class="{ active: activeTab === 'requests' }">📩 Service Requests</li>
          <li @click="activeTab = 'profile'" :class="{ active: activeTab === 'profile' }">👤 Profile</li>
          <li @click="activeTab = 'premium'" :class="{ active: activeTab === 'premium' }">💎 Upgrade to Premium</li>
          <li @click="logout">🚪 Logout</li>
        </ul>
      </aside>
  
      <!-- Main Content Area -->
      <main class="content">
        <!-- Home Section -->
        <section v-if="activeTab === 'home'">
          <h2>Welcome, {{ providerInfo.Firstname }}!</h2>
          <p>Here's an overview of your recent activity.</p>
          <ul>
            <li>✅ Completed Requests: 12</li>
            <li>⏳ Pending Requests: 4</li>
            <li>⭐ Average Rating: 4.8/5</li>
          </ul>
          <div class="buttonsB">
            <button @click="navigateToRequests">View Service Requests</button>
            <button @click="getVerified">Get Verified ✅</button>
          </div>
          <!-- <button @click="navigateToRequests">View Service Requests</button>
          <button @click="getVerified">Get Verified ✅</button> -->
        </section>
  
        <!-- Requests Section -->
        <section v-if="activeTab === 'requests'">
          <h2>Service Requests</h2>
          <p>Manage incoming service requests from customers.</p>
          <ul>
            <li>👨‍💼 John Doe - Plumbing Issue - 📍 2km away - <button>Accept</button></li>
            <li>👩‍💼 Sarah Smith - Electrical Repair - 📍 5km away - <button>Accept</button></li>
            <li>👨‍💼 Mark Lee - Car Mechanic - 📍 3km away - <button>Accept</button></li>
          </ul>
          <button @click="refreshRequests">Refresh Requests</button>
        </section>
  
        <!-- Profile Section -->
        <section v-if="activeTab === 'profile'">
          <h2>Profile Settings</h2>
          <h3> {{ providerInfo.Email }} </h3>
          <p>Update your personal and service details.</p>
          <div class='profileDetails'>
            <label>Firstname:</label>
            <input type="text" v-model="providerInfo.Firstname" />
            <label>Lastname:</label>
            <input type="text" v-model="providerInfo.Lastname" />
            <label>Address:</label>
            <input type="text" v-model="providerInfo.Address" />
            <label>PhoneNumber :</label>
            <input type="number" v-model="providerInfo.PhoneNumber" />
            <label>Experience:</label>
            <input type="number" v-model="providerInfo.YearsOfExperience" />
            <label>Service Type:</label>
            <select v-model="providerInfo.ServiceType">
                <!-- <option>{{providerInfo.ServiceType}}</option> -->
                <option>HairDresser</option>
                <option>Plumber</option>
                <option>Mechanic</option>
                <option>Tailor</option>
                <option>Vulcanizer</option>
            </select>
            <label>Availability:</label>
            <select v-model="providerInfo.Availability">
                <option>{{providerInfo.Availability}}</option>
                <option>Busy</option>
            </select>
            <label>Description:</label>
            <textarea v-model="providerInfo.Description"></textarea>

            <button @click="updateInfo" :disabled="proDetails.isLoading">{{ proDetails.isLoading ? 'Updating...' : 'Update' }}</button>
            <label for="profilePictree" class="picDisplay">Profile Picture</label>
            <input type="file" id="profilePictree" class="picInput" accept="image/*" @change="handleImageUpload"/>
            <div class="uploaderror" v-if="proDetails.uploading">uploading...</div>
            <div class="uploaderror" v-if="proDetails.uploadError">{{ proDetails.uploadError }}</div>
        </div>
        </section>
  
        <!-- Premium Section -->
        <section v-if="activeTab === 'premium'">
          <h2>Upgrade to Premium</h2>
          <p>Become a premium provider to get:</p>
          <ul>
            <li>🔝 Top listing priority</li>
            <li>📢 More visibility</li>
            <li>🎖 Exclusive offers</li>
          </ul>
          <button @click="upgradeToPremium">Upgrade Now</button>
        </section>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted  } from 'vue';
  // import {storeToRefs} from 'pinia'
  // import { useProviderStore } from '@/stores/providerRegister'
  import { useProdetailsStore } from '@/stores/fetchProviderDet'
  const proDetails = useProdetailsStore()
  // const providerStore = useProviderStore(); 

  // const { providerDetailsFetch} = storeToRefs(proDetails)

  import { useRouter, useRoute } from 'vue-router';
  const router = useRouter();
  const route = useRoute()


  import {doc, updateDoc,} from 'firebase/firestore'
import { ref as storageRef, getDownloadURL, uploadBytesResumable, uploadBytes  } from 'firebase/storage'

  const getVerified = () => {
    router.push('/Verification')
  }
  
  const activeTab = ref('home');
  
  const logout = () => {
    alert("Logging out...");
  };
  
  const navigateToRequests = () => {
    activeTab.value = 'requests';
  };
  
  const refreshRequests = () => {
    alert("Refreshing service requests...");
  };
  
  const upgradeToPremium = () => {
    router.push('/Premium');
  };

  const tracking = ref('')

//   WATCHER FOR THE LOGOUT ACTION
    // watch(() => providerStore.canProceed, (newVal) => {
    //     if (newVal) {
    //         localStorage.removeItem('userId');
    //         router.push('/')
    //     }
    // });

  const {id} = route.params;

//   GRAB THE PROVIDER DETAILS FROM THE FIRESTORE STORAGE
    const providerInfo = ref({
        Address : '',
        Availability : '',
        Description : '',
        Email : '',
        Firstname : '',
        Lastname : '',
        PhoneNumber : '',
        ProfilePicture : '',
        ServiceType : '',
        YearsOfExperience : '',
        isPremium : false,
        isVerified : false,
        lat : '',
        lng : ''
    })

    // FETCHING THE DETAILS OF THE PROVIDER
  const runFetchDetails = async () => {
        providerInfo.value.Address = proDetails.providerDetails.Address
        providerInfo.value.Firstname = proDetails.providerDetails.Firstname
        providerInfo.value.Availability = proDetails.providerDetails.Availability
        providerInfo.value.Description = proDetails.providerDetails.Description
        providerInfo.value.Email = proDetails.providerDetails.Email
        providerInfo.value.Lastname = proDetails.providerDetails.Lastname
        providerInfo.value.PhoneNumber = proDetails.providerDetails.PhoneNumber
        providerInfo.value.ProfilePicture = proDetails.providerDetails.ProfilePicture
        providerInfo.value.ServiceType = proDetails.providerDetails.ServiceType
        providerInfo.value.YearsOfExperience = proDetails.providerDetails.YearsOfExperience
        providerInfo.value.isPremium = proDetails.providerDetails.isPremium
        providerInfo.value.isVerified = proDetails.providerDetails.isVerified
        providerInfo.value.lat = proDetails.providerDetails.lat
        providerInfo.value.lng = proDetails.providerDetails.lng
    }

    // UPDATING THE USER INFORMATION
    const updateInfo = async () => {

    const success = await proDetails.updateProvider(id, providerInfo.value);
    
    if (success) {
        console.log("✅ Profile updated successfully.");
        alert("Profile Updated Successfully");
        await proDetails.providerDetailsFetch(id)
        await runFetchDetails()
    } else {
        console.error("❌ Profile update failed. Error:", proDetails.error.value);
        alert("Profile Update Failed: " + (proDetails.error.value || "Unknown error"));
    }
};

// CHANGE PROFILE PICTURE
const handleImageUpload = async (event) => {
  const file = event.target.files[0];

  if (!file) {
    console.log('no file selected')
    return;
  }
  if (!id) {
    throw new Error("⚠️ Invalid provider ID: " + id);
  }
  if (!file.type.startsWith('image/')) {
    return;
  }

  try {
    const { $db, $storage } = useNuxtApp();
    const storageReff = storageRef($storage, `profileImages/${id}/${file.name}`);

    // Upload with progress tracking
    const uploadTask = uploadBytesResumable(storageReff, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Calculate progress percentage
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        tracking.value = `Upload is ${progress.toFixed(2)}% done`
      },
      (error) => {
        console.error("Upload error:", error);
      },
      async () => {
        // Get download URL on successful upload
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        // Update Firestore document with the image URL
        const providerRef = doc($db, 'REGISTERED_PROVIDERS', id);
        await updateDoc(providerRef, {
          ProfilePicture: downloadURL,
        });

        alert("Upload successful!");
      }
    );
  } catch (error) {
    console.error(error);
  }
};

































// import { nextTick } from "vue";




// ONMOUNT TO FIRE THE DATABASE FETCH FOR THE PROVIDER
  onMounted(async () => {
      await proDetails.providerDetailsFetch(id)
      await runFetchDetails()
      
  })

  </script>
  
  <style scoped>
  .picInput{
    display: none;
  }
  .dashboard {
    display: flex;
    height: 100vh;
  }
  
  /* Sidebar */
  .sidebar {
    width: 250px;
    background: #007bff;
    color: white;
    padding: 20px;
  }
  
  .sidebar ul {
    list-style: none;
    padding: 0;
  }
  
  .sidebar ul li {
    padding: 10px;
    cursor: pointer;
  }
  
  .sidebar ul li.active {
    background: white;
    color: #007bff;
    font-weight: bold;
  }
  
  .content {
    flex: 1;
    padding: 20px;
  }
  
  button {
    padding: 8px 15px;
    border: none;
    background: #007bff;
    color: white;
    cursor: pointer;
    margin-top: 10px;
  }
  .buttonsB {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }
  .profileDetails{
    display: flex;
    flex-direction : column;
  }
  input{
    width : 150px;
    height : 30px;
    padding : 5px;
    margin-bottom: 5px;
  }
  textarea{
    resize : none;
    height : 150px;
    padding : 5px
  }
  .profilePicture{
    width : 100px;
    height : 100px;
    border-radius: 50%;
  }
  .profileP{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    flex-direction: column;
  }
  .dashsay{
    display: flex;
    justify-content: cnter;
    align-items: center;
  }

  .picDisplay{
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
    padding: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
  }
  </style>
  