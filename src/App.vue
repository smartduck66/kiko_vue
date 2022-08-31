<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import Villacoublay from "./components/Villacoublay.vue";
import data from "./data/fc.json";

// Formatage
const euros = Intl.NumberFormat("fr", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const milliers = Intl.NumberFormat("fr", {
  style: "decimal",
  maximumFractionDigits: 0,
});

// Constitution des valeurs de référence
const station = data[data.findIndex((x: { indicatif: string }) => x.indicatif == "78640001")];

let val_ref_villacoublay: string[] = [];
val_ref_villacoublay.push(station.indicatif + " - " + station.ville + " (alt. : " + station.altitude + " m)");
val_ref_villacoublay.push(station.temp_moy + "°");
val_ref_villacoublay.push(station.temp_min + "°");
val_ref_villacoublay.push(station.temp_max + "°");
val_ref_villacoublay.push(station.distance_cnpe + " kms");
val_ref_villacoublay.push(milliers.format(Number(station.ensoleillement)) + " h/an");
val_ref_villacoublay.push(milliers.format(Number(station.pluie)) + " mm/an");
val_ref_villacoublay.push(milliers.format(Number(station.vent)) + " j/an");
val_ref_villacoublay.push(euros.format(Number(station.prix_maisons)) + "/m2");
</script>

<template>
  <Villacoublay v-bind="{ valeur_ref: val_ref_villacoublay }" />
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
