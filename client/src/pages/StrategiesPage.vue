<template>
  <HeaderSidebarLayout>
    <h2 class="text-3xl font-bold mb-4">Strategies</h2>
    <div v-for="strategy in strategies" :key="strategy.id">
      <p>{{ strategy.name }}</p>
      <button @click="modifyStrategy(strategy.id)">Modify</button>
    </div>
    <form @submit.prevent="addNewStrategy">
      <input v-model="newStrategyName" placeholder="New strategy name" required />
      <button type="submit">Add Strategy</button>
    </form>
  </HeaderSidebarLayout>
</template>

<script setup lang="ts">
import router from '@/router';
import { addStrategy, getStrategies } from '@/services/databaseService';
import { onMounted, ref } from 'vue';
import { useCookie } from 'vue-cookie-next';
import HeaderSidebarLayout from "../layouts/HeaderSidebarLayout.vue";

const cookie = useCookie();
const strategies = ref([]);
const newStrategyName = ref('');

onMounted(async () => {
  const userId = cookie.getCookie('userId');
  strategies.value = await getStrategies(userId);
});

const addNewStrategy = async () => {
  const userId = cookie.getCookie('userId');
  await addStrategy(newStrategyName.value, userId);
  strategies.value = await getStrategies(userId);
  newStrategyName.value = '';
};

const modifyStrategy = (strategy) => {
  router.push({ name: 'StrategyModification', params: { id: strategy } });
  console.log('Modify strategy:', strategy);
};
</script>
