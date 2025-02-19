<template>
    <div class="overall">
        <!-- REGISTRATION -->
        <div class="formDetails" v-show="showRegistration">
            <h3>Don't have an account? Register as a Provider</h3>

            <h3>Register as a User? <nuxt-link to="/RegisterUsers">User</nuxt-link></h3>
            <input type="text" placeholder="First name" v-model="registrationData.firstName">
            <p v-if="errors.firstName" class="error">{{ errors.firstName }}</p>

            <input type="text" placeholder="Last Name" v-model="registrationData.lastName">
            <p v-if="errors.lastName" class="error">{{ errors.lastName }}</p>

            <input type="number" placeholder="Phone number" v-model="registrationData.phoneNumber">
            <p v-if="errors.phoneNumber" class="error">{{ errors.phoneNumber }}</p>

            <input type="email" placeholder="Email" v-model="registrationData.email">
            <p v-if="errors.email" class="error">{{ errors.email }}</p>

            <input type="number" placeholder="Years of Experience" v-model="registrationData.yearsOfExperience">
            <p v-if="errors.yearsOfExperience" class="error">{{ errors.yearsOfExperience }}</p>

            <input type="text" placeholder="Address" v-model="registrationData.address">
            <p v-if="errors.address" class="error">{{ errors.address }}</p>

            <textarea placeholder="Short Description" v-model="registrationData.description"></textarea>
            <p v-if="errors.description" class="error">{{ errors.description }}</p>

            <label for="servicing">Select Service Type</label>
            <select id="servicing" v-model="registrationData.serviceType">
                <option>Vulcanizer</option>
                <option>Mechanic</option>
                <option>Tailor</option>
                <option>HairDresser</option>
                <option>Plumber</option>
                <option>Taxi</option>
            </select>
            <p v-if="errors.serviceType" class="error">{{ errors.serviceType }}</p>

            <input type="password" placeholder="Password" v-model="registrationData.password">
            <p v-if="errors.password" class="error">{{ errors.password }}</p>
            <button @click="validateData">Register</button>

            <div class="already">
                <h3>Already have an account? <span @click="showSignInButton">Sign-in</span> or sign Up with</h3>
                <button>Google</button>
            </div>
        </div>

        <!-- SIGN IN -->

        <div class="formDetails" v-show="showSignIn">
            <input type="email" placeholder="Email">
            <input type="password" placeholder="Password">
            <button>Sign in</button>

            <div class="already">
                <h3 @click="showPasswordForgot">Forgot password?</h3>
                <h3>Don't have an account? <span @click="showRegister">Register</span></h3>
            </div>
        </div>

        <!-- FORGOT PASSWORD -->

        <div class="formDetails" v-show="passwordForgot">
            <input type="email" placeholder="Email">
            <button>Reset Link.</button>

            <div class="already">
                <h3>Don't have an account? <span @click="showRegister">Register</span></h3>
            </div>
        </div>

    </div>
</template>

<script setup>
    import {ref} from 'vue'
    import validateRegistration from '@/middleware/providerValidation';


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

    // GRAB THE FORM DETAILS
    const registrationData = ref({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        yearsOfExperience: '',
        address: '',
        description: '',
        serviceType: '',
        password: '',
    })

    const errors = ref({})
    // FUNTION TO VALIDATE THE DATA
    const validateData = async () => {
        errors.value = validateRegistration(registrationData.value)
        if(Object.keys(errors.value).length === 0){
            console.log('Data is valid')
            alert('Data is valid')
            // CODE TO PROCEED WITH REGISTRATION
        }else{
            console.log('Data is invalid')

        }
    }































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
        background-color: blue;
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
    .error {
        color: red;
        font-size: 14px;
    }
</style>