<template>
  <HeaderSidebarLayout>
    
    <GetCandlestickData :strategyId="selectedStrategy" @update:data="setData" />
    <div ref="chartContainer" class="chart-container"></div>
    <StrategyDropdown :userId="userId" @update:strategy="setStrategy" />
    <StrategyInput :strategyId="selectedStrategy.toString()" />
  </HeaderSidebarLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import HeaderSidebarLayout from "../layouts/HeaderSidebarLayout.vue";

import GetCandlestickData from '@/components/GetCandlestickData.vue';
import StrategyDropdown from '@/components/StrategyDropdown.vue';
import StrategyInput from '@/components/StrategyInput.vue'; // Import StrategyInput
import { createChart } from 'lightweight-charts';
import { useCookie } from 'vue-cookie-next';

const chartContainer = ref(null);
const cookie = useCookie();
const userId = cookie.getCookie('userId');
const selectedStrategy = ref("");

const setStrategy = (strategyId) => {
  selectedStrategy.value = strategyId;
};
const setData = (data) => {
  if (chartContainer.value) {
    const chart = createChart(chartContainer.value, { /* chart configuration */ });
    const candleSeries = chart.addCandlestickSeries();
    candleSeries.setData(data);
  }
};
</script>

<style>
.chart-container {
  width: 100%;
  height: 300px;
}
</style>