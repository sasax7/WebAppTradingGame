<template>
    <div></div>
  </template>
  
  <script setup lang="ts">
  import { UTCTimestamp } from 'lightweight-charts';
import { defineEmits, onMounted } from 'vue';
import { fetchCandlestickData } from "../services/databaseService";
  
  const emit = defineEmits(['update:data']);
  
  onMounted(async () => {
    try {
      const rawData = await fetchCandlestickData();
      let data = rawData.map(row => {
        if (typeof row.time !== 'number') {
          throw new Error(`Expected row.time to be a number, but got ${typeof row.time}`);
        }
        return {
          time: Math.floor(row.time) as UTCTimestamp, // Convert to seconds and cast to UTCTimestamp
          open: Number(row.open),
          high: Number(row.high),
          low: Number(row.low),
          close: Number(row.close),
        };
      });
  
      // Sort the data by time in ascending order
      data = data.sort((a, b) => a.time - b.time);
  
      emit('update:data', data);
    } catch (error) {
      console.error("Failed to load candlestick data:", error);
    }
  });
  </script>