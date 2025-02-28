<template>
<div class="overall">
        <!-- REGISTRATION -->
        <div class="formDetails" v-show="showRegistration">
            <h3>Don't have an account? Register as a User</h3>
            <h3>Register as a Service Provider? <nuxt-link to="/Account">Service Provider</nuxt-link></h3>
            <input type="text" placeholder="Full Name" v-model="userDetails.fullName">
            <input type="text" placeholder="Phone number" v-model="userDetails.phoneNumber">
            <input type="email" placeholder="Email" v-model="userDetails.email">
            <input type="text" placeholder="Address" v-model="userDetails.address">
            <!-- <select v-model="userDetails.gender">
                <option>Male</option>
                <option>Female</option>
            </select> -->
            <input :type="passwordVisible ? 'text' : 'password'" placeholder="Password" v-model="userDetails.password">
            <button @click.prevent="togglePasswordVisibility" type="button">{{ passwordVisible ? 'Hide' : 'Show' }} Password</button>
            <!-- <input type="password" placeholder="Confirm Password"> -->
            <button @click="registerUser">Register</button>

            <div class="already">
                <h3>Already have an account? <span @click="showSignInButton">Sign-in</span> or sign Up with</h3>
                <button>Google</button>
            </div>
        </div>

        <!-- SIGN IN -->

        <div class="formDetails" v-show="showSignIn">
            <input type="email" placeholder="Email" v-model="signDetails.email">
            <input :type="passwordVisible ? 'text' : 'password'"  placeholder="Password" v-model="signDetails.password">
            <button @click.prevent="togglePasswordVisibility" type="button">{{ passwordVisible ? 'Hide' : 'Show' }} Password</button>
            <button @click="loginUser">{{ userStore.isLoading ? "Signing in..." : "Sign in" }}</button>

            <div class="already">
                <h3 @click="showPasswordForgot">Forgot password?</h3>
                <h3>Don't have an account? <span @click="showRegister">Register</span></h3>
            </div>
        </div>

        <!-- FORGOT PASSWORD -->

        <div class="formDetails" v-show="passwordForgot">
            <input type="email" placeholder="Email">
            <button>Reset Link</button>

            <div class="already">
                <h3>Don't have an account? <span @click="showRegister">Register</span></h3>
            </div>
        </div>

    </div>
</template>

<script setup>
    import {ref, watch, onMounted} from 'vue'
    import {useUserStore} from '@/stores/userRegistration'
    import { useRouter } from 'vue-router'
    const router = useRouter()
    const userStore = useUserStore()
    const showRegistration = ref(true)
    const showSignIn = ref(false)
    const passwordForgot = ref(false)


    // SHOW SIGN IN BUTTON
    const showSignInButton = () => {
        showRegistration.value = false
        showSignIn.value = true
        passwordForgot.value = false
    }

    // SHOW REGISTER BUTTON
    const showRegister = () => {
        showRegistration.value = true
        showSignIn.value = false
        passwordForgot.value = false
    }

    // SHOW FORGOT PASSWORD BUTTON
    const showPasswordForgot = () => {
        showSignIn.value = false
        showRegistration.value = false
        passwordForgot.value = true
    }

    // REGISTER USER DETAILS REFERENCE
    const userDetails = ref({
        fullName: '',
        phoneNumber: '',
        email: '',
        address: userStore.addressFetched,
        lat : ref(localStorage.getItem('lat') || null).value,
        lng : ref(localStorage.getItem('lng') || null).value,
        password: '',
    })

    // const passwordVisible = ref(false)

    // const togglePasswordVisibility = () => {
    // passwordVisible.value = !passwordVisible.value
    // }

// REGISTER USER
    const registerUser = async () => {

        await userStore.registerUser(userDetails.value)
    }

    // SIGN IN USERS REFERENCE
    const signDetails = ref({
        email : '',
        password : ''
    })

    const passwordVisible = ref(false)

    const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value
    }
    // SIGN IN USER
    const loginUser = async () => {
        if(signDetails.value.email === '' || signDetails.value.password == '') {
            alert('Please fill all details')
            return
        }
        await userStore.signinUser(signDetails.value)
    }

        // ✅ Watch canProceed and navigate when it turns true and Fetch the userId from the localstorage
    watch(() => userStore.canProceed, (newVal) => {
        if (newVal) {
            const userId = ref(localStorage.getItem('userIdd') || null);
            let userRegId = userId.value
            router.push(`/Userdash/${userRegId}`)
            // router.push(`/Userdash/${userRegId}`)
        }
    });

















    onMounted(async () => {
      await userStore.getLocation()
      
  })


</script>

<style scoped>
     span{
        text-decoration: underline;
        cursor: pointer;
    }
    .already{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
    }
    .already>button{
        background-color: #007bff;
    }
    .overall{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .formDetails{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        margin: 10px;
        padding: 20px;
        border-radius: 10px;
        outline: 3px solid white;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out;
    }
    input, textarea, select{
        width: 300px;
        border-radius: 10px;
        height: 35px;
        border: none;
        outline: none;
        box-shadow: inset 10px 6px 50px rgb(192, 192, 196);
        padding: 0 5px;
    }
    textarea{
        height: 100px;
        resize: none;
        padding: 5px;
    }
    select{
        width: 300px;
        border-radius: 10px;
        height: 35px;
        border: none;
        outline: none;
        box-shadow: inset 10px 6px 50px rgb(192, 192, 196);
    }
    button{
        width: 300px;
        border-radius: 10px;
        height: 35px;
        border: none;
        outline: none;
        background-color: #007bff;
        box-shadow: inset 10px 6px 50px rgb(192, 192, 196);
        color: white;
        cursor: pointer;
    }
    h3{
        color: #666;
        text-align: center;
    }
</style>