<template>
  <v-app-bar app>
    <v-toolbar-title>Website Title</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon>mdi-account</v-icon>
    </v-btn>
    <div v-if="userName">
      <span>{{ userName }}</span>
      <v-btn @click="logout">Logout</v-btn>
    </div>
    <v-btn v-else @click="goToLogin">Login</v-btn>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getUserInfo } from '@/services/databaseService';
import { useCookie } from 'vue-cookie-next';

const cookie = useCookie();
const router = useRouter();
const userName = ref(null);

onMounted(async () => {
  const userId = cookie.getCookie('userId');
  if (userId) {
    try {
      const userInfo = await getUserInfo(userId);
      userName.value = userInfo.name;
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  }
});

const goToLogin = () => {
  router.push('/login');
};

const logout = () => {
  cookie.removeCookie('userId');
  userName.value = null;
  router.push('/login');
};
</script>