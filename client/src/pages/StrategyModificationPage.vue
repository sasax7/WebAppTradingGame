<template>
    <HeaderSidebarLayout>
      <div>
        <h1>Modify Strategy</h1>
        <p>Strategy ID: {{ id }}</p>
  
        <div v-for="name in stopLossNames" :key="name.id">
          <p>{{ name.name }}</p>
        </div>
        <input v-model="newStopLossName" type="text" placeholder="New Stop Loss Name">
        <button @click="addStopLoss">Add Stop Loss Name</button>
  
        <div v-for="name in takeProfitNames" :key="name.id">
          <p>{{ name.name }}</p>
        </div>
        <input v-model="newTakeProfitName" type="text" placeholder="New Take Profit Name">
        <button @click="addTakeProfit">Add Take Profit Name</button>
  
        <div v-for="name in indicatorNames" :key="name.id">
          <p>{{ name.name }}</p>
        </div>
        <input v-model="newIndicatorName" type="text" placeholder="New Indicator Name">
        <button @click="addIndicator">Add Indicator Name</button>
  
        <div v-for="name in pricePointNames" :key="name.id">
          <p>{{ name.name }}</p>
        </div>
        <input v-model="newPricePointName" type="text" placeholder="New Price Point Name">
        <button @click="addPricePoint">Add Price Point Name</button>
      </div>
    </HeaderSidebarLayout>
  </template>
  
  <script setup lang="ts">
  import HeaderSidebarLayout from '@/layouts/HeaderSidebarLayout.vue';
import { addIndicatorName, addPricePointName, addStopLossName, addTakeProfitName, getIndicatorNames, getPricePointNames, getStopLossNames, getTakeProfitNames } from '@/services/databaseService';
import { defineProps, onMounted, ref } from 'vue';
  
  const props = defineProps({
    id: String,
  });
  
  const stopLossNames = ref([]);
  const newStopLossName = ref('');
  
  const takeProfitNames = ref([]);
  const newTakeProfitName = ref('');
  
  const indicatorNames = ref([]);
  const newIndicatorName = ref('');
  
  const pricePointNames = ref([]);
  const newPricePointName = ref('');
  
  onMounted(async () => {
    stopLossNames.value = await getStopLossNames(props.id);
    takeProfitNames.value = await getTakeProfitNames(props.id);
    indicatorNames.value = await getIndicatorNames(props.id);
    pricePointNames.value = await getPricePointNames(props.id);
  });
  
  const addStopLoss = async () => {
    if (newStopLossName.value) {
      await addStopLossName(newStopLossName.value, props.id);
      newStopLossName.value = '';
      stopLossNames.value = await getStopLossNames(props.id);
    }
  };
  
  const addTakeProfit = async () => {
    if (newTakeProfitName.value) {
      await addTakeProfitName(newTakeProfitName.value, props.id);
      newTakeProfitName.value = '';
      takeProfitNames.value = await getTakeProfitNames(props.id);
    }
  };
  
  const addIndicator = async () => {
    if (newIndicatorName.value) {
      await addIndicatorName(newIndicatorName.value, props.id);
      newIndicatorName.value = '';
      indicatorNames.value = await getIndicatorNames(props.id);
    }
  };
  
  const addPricePoint = async () => {
    if (newPricePointName.value) {
      await addPricePointName(newPricePointName.value, props.id);
      newPricePointName.value = '';
      pricePointNames.value = await getPricePointNames(props.id);
    }
  };
  </script>