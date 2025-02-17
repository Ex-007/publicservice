<template>
<div class="overall">
        <!-- REGISTRATION -->
        <div class="formDetails" v-show="showRegistration">
            <h3>Don't have an account? Register as a User</h3>
            <h3>Register as a Service Provider? <nuxt-link to="/Account">Service Provider</nuxt-link></h3>
            <input type="text" placeholder="Full Name">
            <input type="text" placeholder="Phone number">
            <input type="email" placeholder="Email">
            <input type="text" placeholder="Address">
            <select>
                <option>Gender</option>
                <option>Male</option>
                <option>Female</option>
            </select>
            <input type="password" placeholder="Password">
            <input type="password" placeholder="Confirm Password">
            <button>Register</button>

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
            <button>Reset Link</button>

            <div class="already">
                <h3>Don't have an account? <span @click="showRegister">Register</span></h3>
            </div>
        </div>

    </div>
</template>

<script setup>
    import {ref} from 'vue'
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