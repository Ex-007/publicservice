<template>
    <div class="overall">
        
        <!-- REGISTRATION -->
        <div class="formDetails" v-show="showRegistration">
            <h3>Don't have an account? Sign Up</h3>
            <input type="text" placeholder="Firstname">
            <input type="text" placeholder="Lastname">
            <input type="text" placeholder="Firstname">
            <input type="text" placeholder="Phone number">
            <input type="email" placeholder="Email">
            <input type="date" placeholder="Password">
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
        background-image: linear-gradient(to bottom, #786477 40%, 
        #242419 70%,
        #447644 100%,
        rgb(26, 49, 195));
    font-family: 'Courier New', Courier, monospace;
    }
    .formDetails{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        background-color: #5a7077;
        margin: 10px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: inset 10px 6px 50px rgb(79, 35, 86);
        outline: 3px solid white;
    }
    input{
        width: 300px;
        border-radius: 10px;
        height: 35px;
        border: none;
        outline: none;
        box-shadow: inset 10px 6px 50px rgb(192, 192, 196);
        padding: 0 5px;
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
        background-color: #447644;
        box-shadow: inset 10px 6px 50px rgb(192, 192, 196);
        color: white;
    }
    h3{
        color: white;
        text-align: center;
    }

</style>