<template>
  <div class="layout-container">
    <Header /> <!-- Include the Header component -->
    <Sidebar @update:drawerWidth="updateDrawerWidth" />
    <main :style="{ 'margin-left': drawerWidth }">
      <slot></slot>
    </main>
  </div>
</template>

<script>
import Sidebar from '../components/Sidebar.vue';
import Header from '../components/Header.vue'; // Corrected import for Header

export default {
  components: {
    Sidebar,
    Header // Register the Header component
  },
  data() {
    return {
      drawerWidth: '220px', 
    };
  },
  methods: {
    updateDrawerWidth(newWidth) {
      this.drawerWidth = newWidth;
    }
  }
};
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column; 
}

main {
  flex-grow: 1; 
  margin-top: 60px;
  padding: 20px;
}
</style>