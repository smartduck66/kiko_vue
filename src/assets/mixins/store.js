// State Management avec Pinia (futur vuex5)
import { defineStore } from "pinia";

export const useStore = defineStore("storeId", {
  // arrow function recommended for full type inference
  state: () => {
    return {

      // Formatage valeurs
      euros_0: Intl.NumberFormat("fr", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 0,
      }),
      euros_2: Intl.NumberFormat("fr", {
        style: "currency",
        currency: "EUR",
        maximumFractionDigits: 2,
      }),
      milliers_0: Intl.NumberFormat("fr", {
        style: "decimal",
        maximumFractionDigits: 0,
      }),
      milliers_2: Intl.NumberFormat("fr", {
        style: "decimal",
        maximumFractionDigits: 2,
      }),
      pourcent_2: Intl.NumberFormat("fr", {
        style: "percent",
        maximumFractionDigits: 2,
      }),
    };
  },
});
