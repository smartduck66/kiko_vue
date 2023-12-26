// State Management avec Pinia (futur vuex5)
import { defineStore } from "pinia";
import { ref } from "vue";

// Responsive
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
const breakpoints = useBreakpoints(breakpointsTailwind);

// Data
import fc from "../../data/fc.json";
import drias from "../../data/drias_H1.json";
import seveso from "../../data/seveso.json";
import cnpe from "../../data/centrales.json";

const drias_checked = ref(false); // case à cocher permettant l'affichages des données climatiques issues de la DRIAS
const nb_occurences = ref(0);     // Nombre de fiches climatiques retournées lors d'une recherche

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

      // Définition des breakpoints responsive
      // 'sm': 640, 'md': 768, 'lg': 1024,'xl': 1280, '2xl': 1536,
      sm: breakpoints.smaller("sm"),
      md: breakpoints.between("sm", "md"),
      lg: breakpoints.between("md", "lg"),
      xl: breakpoints.between("lg", "xl"),
      xxl: breakpoints.between("xl", "2xl"),
      xxxl: breakpoints["2xl"],

      fc, drias, seveso, cnpe, drias_checked, nb_occurences
    };
  },
});
