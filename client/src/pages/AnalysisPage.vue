<template>
  <HeaderSidebarLayout>
    <h2 class="text-3xl font-bold mb-4">Analysis</h2>
    <p>
      This is the analysis page where you can view data insights and analytics.
    </p>
    <!-- Dropdown for selecting a strategy -->
    <select v-model="selectedStrategyId" @change="fetchTrades">
      <option disabled value="">Please select a strategy</option>
      <option
        v-for="strategy in strategies"
        :key="strategy.id"
        :value="strategy.id"
      >
        {{ strategy.name }}
      </option>
    </select>
    <!-- Example content: a button to perform some analysis -->
    <button @click="performAnalysis">Perform Analysis</button>
    <!-- Placeholder for analysis results -->
    <div v-if="analysisResult">
      <h3 class="text-2xl font-bold mt-4">Analysis Result:</h3>
      <p>{{ analysisResult }}</p>
    </div>
    <!-- Table for displaying advanced trades -->
    <div v-if="advancedTrades.length">
      <h3 class="text-2xl font-bold mt-4">Advanced Trades:</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Strategy ID</th>
            <th>Pair ID</th>
            <th>Start Date</th>
            <th>Entry Price</th>
            <th>Is Buy</th>
            <th>Triggered Date</th>
            <!-- Add more headers based on the detailedTrade structure -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="trade in advancedTrades" :key="trade.id">
            <td>{{ trade.id }}</td>
            <td>{{ trade.strategy_id }}</td>
            <td>{{ trade.pair_id }}</td>
            <td>{{ trade.start_date }}</td>
            <td>{{ trade.entry_price }}</td>
            <td>{{ trade.is_buy }}</td>
            <td>{{ trade.triggered_date }}</td>
            <!-- Add more data cells based on the detailedTrade structure -->
          </tr>
        </tbody>
      </table>
    </div>
  </HeaderSidebarLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import HeaderSidebarLayout from "../layouts/HeaderSidebarLayout.vue";
import { getStrategies, getAdvancedTrades } from "@/services/databaseService";
import { useCookie } from "vue-cookie-next";

const strategies = ref<Array<{ id: string; name: string }>>([]);
const selectedStrategyId = ref("");
const analysisResult = ref<string | null>(null);
const advancedTrades = ref([]);
const cookie = useCookie();

onMounted(async () => {
  try {
    const userId = cookie.getCookie("userId");
    strategies.value = await getStrategies(userId);
  } catch (error) {
    console.error("Failed to fetch strategies:", error);
  }
});

const fetchTrades = async () => {
  if (selectedStrategyId.value) {
    try {
      advancedTrades.value = await getAdvancedTrades(selectedStrategyId.value);
    } catch (error) {
      console.error("Failed to fetch advanced trades:", error);
    }
  }
};

const performAnalysis = async () => {
  console.log("Performing analysis for strategy ID:", selectedStrategyId.value);
  // Placeholder for analysis logic
  analysisResult.value = "This is the result of the analysis.";
};
</script>

<style scoped>
/* Add any page-specific styles here */
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
</style>
