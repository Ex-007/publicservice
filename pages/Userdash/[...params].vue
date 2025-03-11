<template>
  <div>

  
    <div class="userInfoDiv">
      <div class="imgDiv">
        <img :src="userDetailss.profilePicture || '/img/profilepicture.jpeg'" alt="userImage">
      </div>
      <div class="otherUserDetails">
        <h3 class="displayName">{{ userDetailss.displayName }}</h3>
        <p class="email">{{ userDetailss.email }}</p>
      </div>
    </div>
  <div class="search-page">
      <div class="dropdown">
        <div class="input-container">
          <input
            type="text"
            v-model="searchTerm"
            @focus="isOpen = true"
            @blur="closeDropdown"
            placeholder="Search or select an option..."
            class="search-input"
          />
          <button @click="logSelectedOption" class="log-button">Search</button>
        </div>
        <ul v-if="isOpen" class="dropdown-menu">
          <li v-for="option in filteredOptions" :key="option" @mousedown="selectOption(option)">
            {{ option }}
          </li>
          <li v-if="filteredOptions.length === 0" class="no-results">No results found</li>
        </ul>
      </div>
  
     <!-- <div class="loadingValue" v-if="usersDet.isLoading">
      <h3>loading...</h3>
     </div> -->
     <!-- <div class="animatedLoad" v-if="usersDet.isLoading"></div> -->

      <div v-if="usersDet.availableProviders" class="results">
        <h2>Available Providers: {{ usersDet.availableProviders }}</h2>
        <ul>
          <li v-for="(provider, index) in incoming" :key="index">
            <nuxt-link 
              v-if="userDetailss.lat && userDetailss.lng"
              :to="{ 
                path: `/providers/${provider.id}`,
                query: {
                  lat: provider.providerLat,
                  lng: provider.providerLng,
                  distance: provider.distance,
                  uselat: userDetailss.lat,
                  uselng: userDetailss.lng,
                  userId: userDetailss.identity,
                  providerId: provider.identity
                }
              }" 
              class="provider-card">
              <img :src="provider.ProfilePicture || '/img/profilepicture.jpeg'" alt="Provider Image" class="provider-image" />
              <div class="provider-info">
                <h3>{{ provider.Firstname + " " + provider.Lastname }}</h3>
                <p>📌 {{ provider.ServiceType }}</p>
                <p>📍 {{ provider.distance }} km away</p>
                <a :href="`tel:${provider.PhoneNumber}`" class="phone-button" @click.stop>📞 Contact</a>
              </div>
            </nuxt-link>
          </li>
        </ul>
      </div>
  
      <!-- No Results -->
      <div v-else class="no-results">
        <p>No providers found</p>
      </div>
    </div>


    <div class="otherValue">
      <!-- THE LEFT INFORMATION -->
      <div class="leftValuer">
        <button>Chats</button>
        <button>Bookings</button>
      </div>

      <!-- THE RIGHT INFORMATION -->
      <div class="rightValuer">
        <div class="chatContainer">
          <ul v-for="(chat, index) in usersDet.chatList" :key="index">
            <li>
              <nuxt-link :to="{ path: `/chats/${chat.providerUid}` }">
                <div class="chat-card">
                  <img :src="chat.providerImage || '/img/profilepicture.jpeg'" alt="Provider" class="profile-pic" />
                  <div class="provider-infoSection">
                    <h3>{{ chat.Firstname + " " + chat.Lastname }}</h3>
                    <p class="status">{{chat.serviceType }}</p>
                  </div>
                </div>
              </nuxt-link>
            </li>

          </ul>
        </div>
      </div>
    </div>


  </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useUsersStore } from "@/stores/fetchUserDet";
  const usersDet = useUsersStore();

  const route = useRoute();
  const router = useRouter();

  const params = route.params.params || [];
  const [userRegId] = params;

  
  const resultIn = ref({
    profilePicture: "",
    displayName: "",
    distance : "",
    serviceType: "",
    phone: "",
  })


  
  // Contact Provider
  const contactProvider = (phone) => {
    alert(`Calling ${phone}...`);
  };


  const options = ref(["Mechanic", "Tailor", "Taxi", "Hairdresser", "Plumber", "Electrician", "Carpenter", "Painter", "Gardener", "Chef", "Barber", "Makeup Artist", "Photographer", "Tutor", "Driver"]);
  const searchTerm = ref("");
  const isOpen = ref(false);
  const selectedOption = ref("");

const filteredOptions = computed(() => {
  return options.value.filter(option =>
    option.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const selectOption = (option) => {
  selectedOption.value = option;
  searchTerm.value = option;
  isOpen.value = false;
};

const closeDropdown = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 200);
};

const userDetailss = ref({
  profilePicture: "",
  displayName: "",
  email: "",
  identity: "",
  lat : "",
  lng: ""
})

// FUNCTION TO UPDATE PROFILE DETAILS IN THE UI
const updateProfile = () => {
  // console.log(usersDet.userDetails)
  userDetailss.value.displayName = usersDet.userDetails.Fullname
  userDetailss.value.profilePicture = usersDet.userDetails.ProfilePicture
  userDetailss.value.email = usersDet.userDetails.Email
  userDetailss.value.lat = usersDet.userDetails.lat
  userDetailss.value.lng = usersDet.userDetails.lng
  userDetailss.value.identity = usersDet.userDetails.identification
}



// FUNCTION TO SEARCH
const logSelectedOption = async () => {
  const latitudes = userDetailss.value.lat
  const longitudes = userDetailss.value.lng
  console.log("Selected Option:", selectedOption.value, latitudes, longitudes);
  await usersDet.getProviderFromSearch(selectedOption.value, latitudes, longitudes)
  await logValue()
};

const incoming = ref([])

// FETCH THE INCOMING VALUE
const logValue = async () => {
  incoming.value = usersDet.providers
  console.log("Providers loaded:", incoming.value);
}






onMounted(async () => {
  // console.log(userRegId)
      await usersDet.userDetailsFetch(userRegId)
      await usersDet.fetchChats(userRegId)
      await updateProfile()
      
      // console.log("User details after mount:", userDetailss.value);
  })


  </script>
  
  <style scoped>
body{
    background-color: black;
    color: white;
}

.chat-card{
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 10px;
    background-color: #007bff;
    border-radius: 10px;
    margin-bottom: 10px;
    cursor: pointer;
}

.chat-card>img{
  width: 70px;
  height: 70px;
  border-radius: 50%;
}
.provider-infoSection{
  color: white;
}















.animatedLoad{
    height: 80px;
    width: 80px;
    background-color: #007bff;
    position: absolute;
    margin: auto;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 50%;
    box-shadow: 0 0 0 -7px #007bff,
    0 0 0 -7px #007bff,
    0 0 0 -15px #007bff,
    0 0 0 -15px #007bff;
    animation: split 1.5s forwards infinite;
}

@keyframes split{
    25%{
        box-shadow: 90px 0 0 -7px #007bff,
                    -90px 0 0 -7px #007bff,
                    90px 0 0 -15px #007bff,
                    -90px 0 0 -15px #007bff;
    }
    50%{
        box-shadow: 90px 0 0 -7px #ffffff,
                    -90px 0 0 -7px #ffffff,
                    180px 0 0 -15px #ffffff,
                    -180px 0 0 -15px #ffffff;
    }
    75%{
        box-shadow: 90px 0 0 -7px #007bff,
                    -90px 0 0 -7px #007bff,
                    90px 0 0 -15px #007bff,
                    -90px 0 0 -15px #007bff;
    }
    100%{
        box-shadow: 0px 0 0 -7px #ffffff,
                    0px 0 0 -7px #ffffff,
                    0px 0 0 -15px #ffffff,
                    0px 0 0 -15px #ffffff;
    }
}
  .userInfoDiv{
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 20px;
    margin-bottom: 20px;
    background-color: #007bff;
    padding: 10px;
    width: 100lvw;
  }
  .imgDiv>img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .otherUserDetails{
    color: white;
    font-size: 20px;
  }

















.dropdown {
  position: relative;
  width: 250px;
}
.input-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90vw;
}
/* .search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
} */
.log-button {
  margin-left: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  background: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}
.dropdown-menu {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  border-radius: 4px;
  margin-top: 2px;
  padding: 0;
  list-style: none;
}
.dropdown-menu li {
  padding: 8px;
  cursor: pointer;
}
.dropdown-menu li:hover {
  background: #007bff;
  color: white;
}
.no-results {
  padding: 8px;
  text-align: center;
  color: #007bff;
}

.phone-button{
  color: white;
  background-color: #007bff;
  padding: 5px;
  margin: 5px 0;
  border-radius: 20px;
}
.phone-button:hover{
  background-color: white;
  color: #007bff;
}































  .search-page {
    padding: 20px;
  }
  
  .search-container {
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 80%;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #007bff;
    border-radius: 5px;
  }

  
  .results {
    margin-top: 20px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  .provider-card {
    display: flex;
    align-items: center;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    width: 100%;
    justify-content: space-between;
    cursor: pointer;
    gap: 30px;
  }

  li{
    list-style-type: none;
  }
  a{
    text-decoration: none;
  }
  
  .provider-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 0 15px;
  }
  
  .provider-info {
    flex-grow: 1;
    gap: 5px;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
  
  .no-results {
    text-align: center;
    color: gray;
    font-style: italic;
  }

  .otherValue{
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .leftValuer{
    display: flex;
    flex-direction: column;
    justify-content: start;
    /* align-items: center; */
    gap: 10px;
    width: 30%;
    height: 100vh;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 5px;
    box-sizing: border-box;
    background-color: #007bff;
    color: white;
  }

  .leftValuer>button{
    background-color: #ffffff;
    color: #007bff;
  }
  .rightValuer{
    width: 70%;
    height: 100vh;
    overflow-y: auto;
    scroll-behavior: smooth;
    padding: 5px;
    box-sizing: border-box;
  }


  @media (max-width: 768px){
    /* .userInfoDiv{
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: auto;
    } */
    .imgDiv>img{
      width: 50px;
      height: 50px;
    }
    .otherUserDetails{
      font-size: 15px;
    }
  }
  </style>
  