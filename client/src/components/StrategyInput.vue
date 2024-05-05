<template>
  <div>
    <h2>Strategy Input</h2>

    <div class="container">
      <div class="column">
        <div>
          <label for="startDate">Start Date</label>
          <input
            id="startDate"
            v-model="values.startDate"
            type="datetime-local"
          />

          <label for="entryPrice">Entry Price</label>
          <input
            id="entryPrice"
            v-model="values.entryPrice"
            type="number"
            step="0.01"
          />
        </div>
        <h3>Stop Loss Names</h3>
        <div v-for="name in stopLossNames" :key="name.id">
          <label :for="name.id">{{ name.name }}</label>
          <input :id="name.id" v-model="values[name.id]" type="text" />
        </div>
      </div>

      <div class="column">
        <h3>Take Profit Names</h3>
        <div v-for="name in takeProfitNames" :key="name.id">
          <label :for="name.id">{{ name.name }}</label>
          <input :id="name.id" v-model="values[name.id]" type="text" />
        </div>
      </div>

      <div class="column">
        <h3>Indicator Names</h3>
        <div v-for="name in indicatorNames" :key="name.id">
          <label :for="`${name.id}-value`">{{ name.name }} Value</label>
          <input
            :id="`${name.id}-value`"
            v-model="values[name.id].value"
            type="text"
          />

          <label :for="`${name.id}-date`">{{ name.name }} Date</label>
          <input
            :id="`${name.id}-date`"
            v-model="values[name.id].date"
            type="datetime-local"
          />
        </div>
      </div>

      <div class="column">
        <h3>Price Point Names</h3>
        <div v-for="name in pricePointNames" :key="name.id">
          <label :for="`${name.id}-value`">{{ name.name }} Value</label>
          <input
            :id="`${name.id}-value`"
            v-model="values[name.id].value"
            type="text"
          />

          <label :for="`${name.id}-date`">{{ name.name }} Date</label>
          <input
            :id="`${name.id}-date`"
            v-model="values[name.id].date"
            type="datetime-local"
          />
        </div>
      </div>
    </div>

    <button @click="submitValues">Submit</button>
  </div>
</template>

<script setup lang="ts">
import {
  addAdvancedTrade,
  addIndicator,
  addPricePoint,
  addStopLoss,
  addTakeProfit,
  getIndicatorNames,
  getPricePointNames,
  getStopLossNames,
  getTakeProfitNames,
} from "@/services/databaseService";
import { onMounted, reactive, ref, watch, withDefaults } from "vue";
import { toast } from "vue3-toastify";

const props = withDefaults(
  defineProps<{
    strategyId: string;
  }>(),
  {
    strategyId: "",
  }
);

const stopLossNames = ref([]);
const takeProfitNames = ref([]);
const indicatorNames = ref([]);
const pricePointNames = ref([]);
const values = reactive({
  startDate: "",
  entryPrice: "",
  // Initialize price point names and indicator names as objects with value and date properties
  ...pricePointNames.value.reduce(
    (obj, name) => ({ ...obj, [name.id]: { value: "", date: "" } }),
    {}
  ),
  ...indicatorNames.value.reduce(
    (obj, name) => ({ ...obj, [name.id]: { value: "", date: "" } }),
    {}
  ),
});
const fetchNames = async () => {
  stopLossNames.value = await getStopLossNames(props.strategyId);
  takeProfitNames.value = await getTakeProfitNames(props.strategyId);
  indicatorNames.value = await getIndicatorNames(props.strategyId);
  pricePointNames.value = await getPricePointNames(props.strategyId);

  // Initialize the values object
  for (const name of [...stopLossNames.value, ...takeProfitNames.value]) {
    values[name.id] = "";
  }
  for (const name of [...pricePointNames.value, ...indicatorNames.value]) {
    values[name.id] = { value: "", date: "" };
  }

  // Find the stop loss with the name 'default' and initialize values.defaultStopLoss with its id
  const defaultStopLoss = stopLossNames.value.find(
    (name) => name.name === "default stoploss"
  );
  console.log("defaultStopLoss", defaultStopLoss);
  if (defaultStopLoss) {
    values.defaultStopLoss = defaultStopLoss.id;
  }

  values.startDate = "";
  values.entryPrice = "";
};

onMounted(fetchNames);

watch(() => props.strategyId, fetchNames);

const submitValues = async () => {
  console.log("values", values);
  let advancedTrade;
  let stopLossDetails = {};
  // Check if the required fields are entered
  if (
    !values.startDate ||
    !values.entryPrice ||
    !values[values.defaultStopLoss]
  ) {
    toast.error("Please enter Start Date, Entry Price, and Default Stop Loss");
    return;
  }

  // Convert the date to Unix time in seconds
  const dateStart = Math.floor(new Date(values.startDate).getTime() / 1000);

  try {
    // Call the function to add the advanced trade
    advancedTrade = await addAdvancedTrade(
      props.strategyId,
      1,
      dateStart,
      values.entryPrice,
      values[values.defaultStopLoss]
    );
    toast.success("Advanced trade added successfully");
  } catch (error) {
    console.error("Failed to add advanced trade: " + error.message);
    toast.error("Failed to add advanced trade");
  }
  console.log("advancedtrade output", advancedTrade);
  for (const stopLoss of stopLossNames.value) {
    const stopLossPrice = parseFloat(values[stopLoss.id]);
    if (isNaN(stopLossPrice)) continue; // Skip if the stop loss price is not a number

    try {
      // Assuming stopLossNameId is the id of the stop loss name
      const stopLossNameId = stopLoss.id;

      // Call addStopLoss for each stop loss
      console.log(
        "Adding stop loss:",
        stopLossPrice,
        advancedTrade.advancedTradeId,
        stopLossNameId
      );
      const stopLossResult = await addStopLoss(
        1, // Assuming pairId is 1 for demonstration purposes
        parseFloat(values.entryPrice),
        stopLossPrice,
        advancedTrade.tradeType,
        advancedTrade.advancedTradeId,
        advancedTrade.triggeredDate, // Assuming triggeredDate is the start date for simplicity
        stopLossNameId
      );
      toast.success(`Stop loss for ${stopLoss.name} added successfully`);
      stopLossDetails[stopLossNameId] = stopLossResult;
    } catch (error) {
      console.error(
        `Failed to add stop loss for ${stopLoss.name}: ${error.message}`
      );
      toast.error(`Failed to add stop loss for ${stopLoss.name}`);
    }
  }

  for (const takeProfit of takeProfitNames.value) {
    const takeProfitPrice = parseFloat(values[takeProfit.id]);
    if (isNaN(takeProfitPrice)) continue; // Skip if the take profit price is not a number

    try {
      // Assuming takeProfitNameId is the id of the take profit name
      const takeProfitNameId = takeProfit.id;

      // Call addTakeProfit for each take profit
      console.log(
        "Adding take profit:",
        takeProfitPrice,
        advancedTrade.advancedTradeId,
        takeProfitNameId
      );
      await addTakeProfit(
        1, // Assuming pairId is 1 for demonstration purposes
        takeProfitNameId,
        takeProfitPrice,
        advancedTrade.tradeType,
        advancedTrade.advancedTradeId,
        advancedTrade.triggeredDate,
        values.entryPrice,
        stopLossDetails
      );
      toast.success(`Take profit for ${takeProfit.name} added successfully`);
    } catch (error) {
      console.error(
        `Failed to add take profit for ${takeProfit.name}: ${error.message}`
      );
      toast.error(`Failed to add take profit for ${takeProfit.name}`);
    }
  }
  try {
    // Existing code to add the advanced trade...

    // Loop through indicatorNames and add each indicator
    for (const indicator of indicatorNames.value) {
      const indicatorValue = values[indicator.id].value;
      let indicatorTime = values[indicator.id].date;

      // Skip adding the indicator if the value is empty
      if (!indicatorValue) continue;

      // Use current time if the time input is empty
      if (!indicatorTime) {
        indicatorTime = new Date().toISOString();
      }

      // Convert indicatorTime to Unix time in seconds
      const indicatorTimeUnix = Math.floor(
        new Date(indicatorTime).getTime() / 1000
      );

      // Call addIndicator for each indicator
      console.log(
        "indicatorinputs",
        indicatorValue,
        indicatorTimeUnix,
        indicator.id,
        advancedTrade.advancedTradeId
      );
      await addIndicator(
        indicatorValue,
        indicatorTimeUnix,
        indicator.id,
        advancedTrade.advancedTradeId
      );
    }

    toast.success("indicators added successfully");
  } catch (error) {
    console.error(
      "Failed to add advanced trade and indicators: " + error.message
    );
    toast.error("Failed to add advanced trade and indicators");
  }
  // Add price points based on the provided values
  try {
    // Loop through pricePointNames and add each price point
    for (const pricePoint of pricePointNames.value) {
      const pricePointValue = values[pricePoint.id].value;
      let pricePointTime = values[pricePoint.id].date;

      // Skip adding the price point if the value or date is empty
      if (!pricePointValue || !pricePointTime) continue;

      // Convert pricePointTime to Unix time in seconds
      const pricePointTimeUnix = Math.floor(
        new Date(pricePointTime).getTime() / 1000
      );

      // Call addPricePoint for each price point
      console.log(
        "pricePointInputs",
        pricePointValue,
        pricePointTimeUnix,
        pricePoint.id,
        advancedTrade.advancedTradeId
      );
      await addPricePoint(
        pricePointValue,
        pricePointTimeUnix,
        pricePoint.id,
        advancedTrade.advancedTradeId
      );
    }

    toast.success("Price points added successfully");
  } catch (error) {
    console.error("Failed to add price points: " + error.message);
    toast.error("Failed to add price points");
  }
};
</script>
<style scoped>
.container {
  display: flex;
  justify-content: space-between;
}

.column {
  flex: 1;
}
</style>
