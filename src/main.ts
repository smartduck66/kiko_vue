import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";

// Composants graphiques
import PrimeVue from "primevue/config";
import "primevue/resources/themes/saga-blue/theme.css";
import "primevue/resources/primevue.min.css";
//import "primeicons/primeicons.css";

const app = createApp(App);

app.use(PrimeVue).use(createPinia()).mount("#app");
