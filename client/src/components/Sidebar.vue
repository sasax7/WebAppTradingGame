<template>
  <v-navigation-drawer app :width="drawerWidth" permanent>
    <v-list>
      <v-list-item>
        <v-btn text to="/hello-world" block>
          <v-icon left>mdi-home</v-icon>
          <span v-if="!drawerMini">Home</span>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text to="/financial-chart" block>
          <v-icon left>mdi-chart-line</v-icon>
          <span v-if="!drawerMini">Financial Chart</span>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text to="/dashboard" block>
          <v-icon left>mdi-view-dashboard</v-icon>
          <span v-if="!drawerMini">Dashboard</span>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text to="/strategies" block>
          <v-icon left>mdi-strategy</v-icon>
          <span v-if="!drawerMini">Strategies</span>
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text to="/analysis" block>
          <v-icon left>mdi-analysis</v-icon>
          <span v-if="!drawerMini">Analysis</span>
        </v-btn>
      </v-list-item>
      <v-list-item @click="toggleDrawer">
        <v-btn text block>
          <v-icon left>{{
            drawerMini ? "mdi-arrow-right" : "mdi-arrow-left"
          }}</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "Sidebar",
  data() {
    return {
      drawerMini: false,
    };
  },
  computed: {
    drawerWidth() {
      return this.drawerMini ? "80px" : "220px";
    },
  },
  methods: {
    toggleDrawer() {
      this.drawerMini = !this.drawerMini;
      this.$emit("update:drawerWidth", this.drawerWidth);
    },
  },
};
</script>
