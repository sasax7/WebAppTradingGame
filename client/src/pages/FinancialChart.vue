<template>
  <HeaderSidebarLayout>
    <div ref="chartContainer" class="chart-container"></div>
  </HeaderSidebarLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createChart } from 'lightweight-charts';
import HeaderSidebarLayout from "../layouts/HeaderSidebarLayout.vue";
import { fetchCandlestickData } from "../services/databaseService";

const chartContainer = ref(null);

onMounted(async () => {
  try {
    const rawData = await fetchCandlestickData();
    let data = rawData.map(row => {
      if (typeof row.time !== 'number') {
        throw new Error(`Expected row.time to be a number, but got ${typeof row.time}`);
      }
      const date = new Date(row.time * 1000);
      const timeString = date.toISOString().split('T')[0];
      return {
        time: timeString,
        open: Number(row.open),
        high: Number(row.high),
        low: Number(row.low),
        close: Number(row.close),
      };
    });

    // Sort the data by time in ascending order
    data = data.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    // Manually add a candle with the current time in seconds
    const currentDate = new Date();
    const currentTimeString = currentDate.toISOString().split('T')[0];
    data.push({
      time: currentTimeString, // Use a consistent date string format for the time property
      open: 1.05,
      high: 1.10,
      low: 1.00,
      close: 1.08,
    });

    if (chartContainer.value) {
      const chart = createChart(chartContainer.value, { /* chart configuration */ });
      const candleSeries = chart.addCandlestickSeries();
      candleSeries.setData(data);
    }
  } catch (error) {
    console.error("Failed to load candlestick data:", error);
  }
});
</script>
<style>
.chart-container {
  width: 100%;
  height: 300px;
}
</style>