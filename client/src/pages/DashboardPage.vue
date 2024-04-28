<template>
  <HeaderSidebarLayout>
    <h2 class="text-3xl font-bold mb-4">Dashboard</h2>
    <p>Welcome to the dashboard!</p>
    <button @click="logUserId">Log User ID</button>
  </HeaderSidebarLayout>
</template>

<script setup lang="ts">
import { useCookie } from 'vue-cookie-next';
import HeaderSidebarLayout from "../layouts/HeaderSidebarLayout.vue";


const cookie = useCookie();

const logUserId = async () => {
  const userId = cookie.getCookie('userId');
  console.log(userId);


};
</script>