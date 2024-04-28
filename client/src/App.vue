<template>
  <v-app>
    <router-view/>
  </v-app>
</template>

<script>
import 'vue3-toastify/dist/index.css';
import Footer from './components/Footer.vue';
import Header from './components/Header.vue';
import Sidebar from './components/Sidebar.vue';
import FinancialChart from './pages/FinancialChart.vue';
import HelloWorld from './pages/HelloWorld.vue';

export default {
  name: 'App',
  components: {
    Header,
    Footer,
    Sidebar,
    HelloWorld,
    FinancialChart
  }
};
</script>

<style>

</style>