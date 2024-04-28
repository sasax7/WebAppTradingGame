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
    await addAdvancedTrade(
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
