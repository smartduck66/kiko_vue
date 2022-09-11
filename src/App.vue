<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import Station78 from "./components/Station78.vue";
import Selection from "./components/Selection.vue";
import data from "./data/fc.json";
import { useStore } from "./assets/mixins/store.js";
const store = useStore();

// Constitution des valeurs de référence
const station = data[data.findIndex((x: { indicatif: string }) => x.indicatif == "78621001")]; // Station météo de Trappes

let val_ref_78: string[] = [];
val_ref_78.push(station.indicatif + " - " + station.ville + " (alt. : " + station.altitude + " m)");
val_ref_78.push(station.temp_moy + "°");
val_ref_78.push(station.temp_min + "°");
val_ref_78.push(station.temp_max + "°");
val_ref_78.push(station.distance_cnpe + " kms");
val_ref_78.push(isNaN(Number(station.ensoleillement)) ? "-" : store.milliers_0.format(station.ensoleillement) + " h/an");
val_ref_78.push(isNaN(Number(station.pluie)) ? "-" : store.milliers_0.format(station.pluie) + " mm/an");
val_ref_78.push(isNaN(Number(station.vent)) ? "-" : store.milliers_0.format(station.vent) + " j/an");
val_ref_78.push(isNaN(Number(station.prix_maisons)) ? "-" : store.euros_0.format(station.prix_maisons) + "/m2");
</script>

<template>
  <Station78 v-bind="{ valeur_ref: val_ref_78 }" />
  <p></p>
  <Selection />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin: 1%;
}
</style>
