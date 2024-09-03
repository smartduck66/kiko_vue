import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { router } from "./router";

// Composants graphiques : migration vers PrimeVue 4.0 le 9 juillet 2024
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import Tooltip from "primevue/tooltip";
//import "primeicons/primeicons.css";

const app = createApp(App);

app
  .use(router)
  .use(PrimeVue, {
    locale: {
      emptyFilterMessage: "Aucun résultat trouvé",
    },
    // Default theme configuration
    theme: {
      preset: Aura,
      options: {
        prefix: "p",
        darkModeSelector: "system",
        cssLayer: false,
      },
    },
  })
  .use(createPinia())
  .directive("tooltip", Tooltip)
  .mount("#app");
