<template>
    <nav class="navbar">
        
            <nuxt-link to="/"><i class="fa fa-home"></i>Home</nuxt-link>
            <nuxt-link to="/Account"><i class="fa fa-user"></i>Account</nuxt-link>
            <nuxt-link to="/Notifications"><i class="fa fa-bell"></i>Notifications</nuxt-link>
            <nuxt-link to="/Profile"><i class="fa fa-heart"></i>Profile</nuxt-link>

    </nav>
</template>

<script setup>

</script>

<style scoped>
    .navbar{
        height: 50px;
        display: flex;
        justify-content: start;
        align-items: center;
        border-radius: 20px;
    }
    
    a{
        display: flex;
        align-items: center;
        gap: 5px;
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