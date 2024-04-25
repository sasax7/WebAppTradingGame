<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createChart } from 'lightweight-charts';
import HeaderSidebarLayout from "../layouts/HeaderSidebarLayout.vue";

const chartContainer = ref(null);

onMounted(async () => {
  const chart = createChart(chartContainer.value, {
    width: chartContainer.value.offsetWidth,
    height: 300,
    layout: {
      textColor: 'rgba(33, 56, 77, 1)',
    },
    grid: {
      vertLines: {
        color: 'rgba(197, 203, 206, 0.7)',
      },
      horzLines: {
        color: 'rgba(197, 203, 206, 0.7)',
      },
    },
  });

  const candleSeries = chart.addCandlestickSeries();

  // Fetch candlestick data from the backend
  const response = await fetch('http://localhost:9000/candlestickData');
  const data = await response.json();

  // Assuming the backend returns the data in the format expected by the chart
  candleSeries.setData(data);
});
</script>

<template>
  <HeaderSidebarLayout>
    <div ref="chartContainer" class="chart-container"></div>
  </HeaderSidebarLayout>
</template>

<style>
.chart-container {
  width: 100%;
  height: 300px;
}
</style>