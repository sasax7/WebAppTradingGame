<script setup lang="ts">
import HeaderSidebarLayout from "../layouts/HeaderSidebarLayout.vue";
import { ref, onMounted } from 'vue';
import { createChart } from 'lightweight-charts';

const chartContainer = ref(null);

onMounted(() => {
  if (chartContainer.value) {
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

    const lineSeries = chart.addLineSeries();
    lineSeries.setData([
      { time: '2019-04-11', value: 80.01 },
      { time: '2019-04-12', value: 96.63 },
      { time: '2019-04-13', value: 76.64 },
      { time: '2019-04-14', value: 81.89 },
      { time: '2019-04-15', value: 74.43 },
      { time: '2019-04-16', value: 80.01 },
      { time: '2019-04-17', value: 96.63 },
      { time: '2019-04-18', value: 76.64 },
      { time: '2019-04-19', value: 81.89 },
      { time: '2019-04-20', value: 74.43 },
    ]);
  }
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