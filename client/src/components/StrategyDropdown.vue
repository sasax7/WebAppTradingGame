<template>
    <select v-model="selectedStrategy" @change="updateStrategy">
      <option disabled value="">Please select a strategy</option>
      <option v-for="strategy in strategies" :key="strategy.id" :value="strategy.id">
        {{ strategy.name }}
      </option>
    </select>
  </template>
  
  <script setup lang="ts">
  import { defineEmits, defineProps, onMounted, ref } from 'vue';
import { getStrategies } from "../services/databaseService";
  
  const props = defineProps({
    userId: String
  });
  
  const emit = defineEmits(['update:strategy']);
  
  const strategies = ref([]);
  const selectedStrategy = ref("");
  
  onMounted(async () => {
    try {
      strategies.value = await getStrategies(props.userId);
    } catch (error) {
      console.error("Failed to load strategies:", error);
    }
  });
  
  const updateStrategy = () => {
    emit('update:strategy', selectedStrategy.value);
  };
  </script>