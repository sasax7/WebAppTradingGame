// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "../pages/DashboardPage.vue";
import FinancialChart from "../pages/FinancialChart.vue";
import HelloWorld from "../pages/HelloWorld.vue";
import LoginPage from "../pages/LoginPage.vue";
import RegisterPage from "../pages/RegisterPage.vue";
import StrategiesPage from "../pages/StrategiesPage.vue";
import StrategyModificationPage from "../pages/StrategyModificationPage.vue";
import AnalysisPage from "../pages/AnalysisPage.vue";

const routes = [
  {
    path: "/analysis",
    name: "Analysis",
    component: AnalysisPage,
  },
  {
    path: "/strategies/:id",
    name: "StrategyModification",
    component: StrategyModificationPage,
    props: true,
  },
  {
    path: "/strategies",
    name: "Strategies",
    component: StrategiesPage,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: DashboardPage,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
  },
  {
    path: "/hello-world",
    name: "HelloWorld2",
    component: HelloWorld,
  },
  {
    path: "/",
    name: "HelloWorld",
    component: HelloWorld,
  },
  {
    path: "/financial-chart",
    name: "FinancialChart",
    component: FinancialChart,
  },
  // Define other routes here
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
