<template>
    <nav class="navbar">
            <nuxt-link to="/">Home</nuxt-link>
            <nuxt-link to="/Account">Account</nuxt-link>
            <nuxt-link to="/Notifications">Notifications</nuxt-link>
            <nuxt-link to="/Profile">Profile</nuxt-link>

    </nav>
    <!-- <div>
        <ul class="">
            <li><nuxt-link to="/">Home</nuxt-link></li>
            <li><nuxt-link to="/Account">Account</nuxt-link></li>
            <li><nuxt-link to="/Notifications">Notifications</nuxt-link></li>
            <li><nuxt-link to="/Profile">Profile</nuxt-link></li>
        </ul>
    </div> -->
</template>

<script setup>

</script>

<style scoped>
    .navbar{
        height: 50px;
        align-items: center;
        display: flex;
    }
    .navbar{
        display: flex;
        justify-content: start;
        align-items: center;
        border-radius: 20px;
        /* gap: 10px; */
    }
    a{
        list-style-type: none;
        background-color: #007bff;
        color: white;
        padding: 10px;
        border: 2px solid white;
        text-decoration: none;
    }
    a:hover{
        background-color: white;
        color: #007bff;
    }
    .router-link-active{
        background-color: white;
        color: #007bff;
    }
</style>