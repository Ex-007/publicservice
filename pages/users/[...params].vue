<template>
    <div class="search-page">
      <div class="userInfoDiv">
        <div class="imgDiv">
          <img :src="userDetailss.profilePicture || '/img/profilepicture.jpeg'" alt="userImage">
        </div>
        <div class="otherUserDetails">
          <h3 class="displayName">{{ userDetailss.displayName }}</h3>
          <p class="email">{{ userDetailss.email }}</p>
        </div>
      </div>
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
  
      <!-- Results -->
      <div v-if="filteredProviders.length > 0" class="results">
        <h2>Available Providers</h2>
        <ul>
          <li v-for="provider in filteredProviders" :key="provider.id" class="provider-card">
            <img :src="provider.image" alt="Provider Image" class="provider-image" />
            <div class="provider-info">
              <h3>{{ provider.name }}</h3>
              <p>📌 {{ provider.serviceType }}</p>
              <p>📍 {{ provider.distance }} km away</p>
              <button @click="contactProvider(provider.phone)">📞 Contact</button>
            </div>
          </li>
        </ul>
      </div>
  
      <!-- No Results -->
      <div v-else class="no-results">
        <p>No providers found for "{{ searchQuery }}". Try another search.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRouter, useRoute } from "vue-router";
  import { useUsersStore } from "@/store/fetchUserDet";
  const usersDet = useUsersStore();

  const route = useRoute();
  const router = useRouter();

  const params = route.params.params || [];
  const [userRegId] = params;
  
  // Dummy Data
  const providers = ref([
    { id: 1, name: "John Doe", serviceType: "Plumber", phone: "123-456-7890", distance: 2, image: "/img/welder.jpeg" },
    { id: 2, name: "Sarah Smith", serviceType: "Electrician", phone: "987-654-3210", distance: 4, image: "/img/welder.jpeg" },
    { id: 3, name: "Michael Lee", serviceType: "Mechanic", phone: "555-123-4567", distance: 3, image: "/img/mechanic.jpeg" },
    { id: 4, name: "Emma Brown", serviceType: "Tailor", phone: "333-999-0000", distance: 1, image: "/img/tailor.jpeg" }
  ]);
  
  const searchQuery = ref("");
  const filteredProviders = ref(providers.value);
  
  // Search Function
  const searchProviders = () => {
    const query = searchQuery.value.toLowerCase();
    filteredProviders.value = providers.value.filter(provider => 
      provider.serviceType.toLowerCase().includes(query)
    );
  };
  
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

const updateProfile = () => {
  userDetailss.value.displayName = usersDet.userDetails.Fullname
  userDetailss.value.profilePicture = usersDet.userDetails.ProfilePicture
  userDetailss.value.email = usersDet.userDetails.Email
  userDetailss.value.lat = usersDet.userDetails.lat
  userDetailss.value.lng = usersDet.userDetails.lng
  userDetailss.value.identity = usersDet.userDetails.identification
}



const logSelectedOption = () => {
  console.log("Selected Option:", selectedOption.value);
  console.log("userId:", userRegId);
};




















onMounted(async () => {
      await usersDet.userDetailsFetch(userRegId)
      updateProfile()
      
  })


  </script>
  
  <style scoped>
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
  /* input {
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: 2px solid #007bff;
    border-radius: 5px;
  } */
  
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
  }
  
  .provider-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px;
  }
  
  .provider-info {
    flex-grow: 1;
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
  </style>
  