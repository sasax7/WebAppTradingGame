<template>
    <HeaderSidebarLayout>
      <h2 class="text-3xl font-bold mb-4">Login</h2>
      <form @submit.prevent="login">
        <div>
          <label for="username">Username:</label>
          <input id="username" v-model="username" type="text" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input id="password" v-model="password" type="password" required>
        </div>
        <button type="submit">Login</button>
        <button type="button" @click="goToRegister">Register</button>
      </form>
    </HeaderSidebarLayout>
  </template>
  
  <script setup lang="ts">
  import HeaderSidebarLayout from '@/layouts/HeaderSidebarLayout.vue';
import { loginUser } from '@/services/databaseService';
import { ref } from 'vue';
import { useCookie } from 'vue-cookie-next';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
  
  const username = ref('');
  const password = ref('');
  const router = useRouter();
  const userIdCookie = useCookie();
  console.log(userIdCookie);
  const login = async () => {
    try {
      const user = await loginUser(username.value, password.value);
      toast.success('User logged in successfully');
      // Set a cookie with the user ID
      userIdCookie.setCookie('userId', user.id.toString());
      router.push('/dashboard');
    } catch (error) {
      console.error('Error logging in user:', error);
      toast.error('Error logging in user');
    }
  };
  
  // Define the goToRegister method
  const goToRegister = () => {
    router.push('/register');
  };
  </script>