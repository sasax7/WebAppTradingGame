<template>
    <div id="candlestick-chart" style="width: 100%; height: 400px;"></div>
  </template>
  
  <script>
  import { defineComponent, onMounted } from 'vue';
  import { createChart } from 'lightweight-charts';
  import { fetchCandlestickData } from '@/hooks/databaseService'; 
  
  export default defineComponent({
    name: 'CandlestickChart',
    setup() {
      onMounted(async () => {
        const candlestickData = await fetchCandlestickData();
        const chartData = candlestickData.map(item => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }));
  
        const chartContainer = document.getElementById('candlestick-chart');
        const chart = createChart(chartContainer, { width: chartContainer.clientWidth, height: 400 });
        const candlestickSeries = chart.addCandlestickSeries();
  
        candlestickSeries.setData(chartData);
  
        window.addEventListener('resize', () => {
          chart.resize(chartContainer.clientWidth, 400);
        });
      });
  

  
      return {};
    },
  });
  </script>
  
  <style>
  #candlestick-chart {
    position: relative;
  }
  </style>
  