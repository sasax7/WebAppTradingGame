// src/plugins/vuetify.js
import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Import Vuetify styles

// Import any Vuetify components you use here
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// Create the Vuetify instance
const vuetify = createVuetify({
  components,
  directives,
  // any additional options
});

// Export the Vuetify plugin
export default vuetify;