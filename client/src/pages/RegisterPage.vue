<template>
    <HeaderSidebarLayout>
      <h2 class="text-3xl font-bold mb-4">Register</h2>
      <form @submit.prevent="register">
        <div>
          <label for="username">Username:</label>
          <input id="username" v-model="username" type="text" required>
        </div>
        <div>
          <label for="email">Email:</label>
          <input id="email" v-model="email" type="email" required>
        </div>
        <div>
          <label for="password">Password:</label>
          <input id="password" v-model="password" type="password" required>
        </div>
        <button type="submit">Register</button>
      </form>
    </HeaderSidebarLayout>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import HeaderSidebarLayout from "../layouts/HeaderSidebarLayout.vue";
import { registerUser } from '../services/databaseService.js';
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const router = useRouter();
  
  const register = async () => {
    try {
      await registerUser(username.value, email.value, password.value);
      toast.success('User registered successfully');
      setTimeout(() => {
        router.push('/login');
      }, 3000); // Redirect after 3 seconds
    } catch (error) {
      console.error('Error registering user:', error);
      toast.error('Error registering user');
    }
  };
  </script>