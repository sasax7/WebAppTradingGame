<template>
    <div>
      <WidgetsStatsA class="mb-4" />
      <CRow>
        <CCol :md="12">
          <CCard class="mb-4">
            <CCardBody>
              <!-- Other content -->
              <CRow>
                <CandlestickChart />
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <!-- Other components -->
    </div>
  </template>
  
  <script>
import CandlestickChart from './../charts/CandlestickChart.vue';
  import WidgetsStatsA from './../widgets/WidgetsStatsTypeA.vue';

  export default {
    components: {
      CandlestickChart,
      WidgetsStatsA,
      // Other components
    },
  };
  </script>
  