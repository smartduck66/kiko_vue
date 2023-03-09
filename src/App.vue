<script setup lang="ts">
import Station78 from "./components/Station78.vue";
import Selection from "./components/Selection.vue";
import Masthead from "./components/Masthead.vue";
import Footer from "./components/Footer.vue";
import data from "./data/fc.json";
import { useStore } from "./assets/mixins/store.js";
const store = useStore();

// Constitution des valeurs de référence
const station = data[data.findIndex((x: { indicatif: string }) => x.indicatif == "78621001")]; // Station météo de Trappes

let val_ref_78: string[] = [];
val_ref_78.push("Réf. : " + station.indicatif + " - " + station.ville + " (alt. : " + station.altitude + " m)");
val_ref_78.push(station.temp_moy + "°");
val_ref_78.push(station.temp_min + "°");
val_ref_78.push(station.temp_max + "°");
val_ref_78.push(station.distance_cnpe + " kms");
val_ref_78.push(isNaN(Number(station.ensoleillement)) ? "-" : store.milliers_0.format(station.ensoleillement) + " h/an");
val_ref_78.push(isNaN(Number(station.pluie)) ? "-" : store.milliers_0.format(station.pluie) + " mm/mois");
val_ref_78.push(isNaN(Number(station.vent)) ? "-" : store.milliers_0.format(station.vent) + " j/an");
val_ref_78.push(isNaN(Number(station.prix_maisons)) ? "-" : store.euros_0.format(station.prix_maisons) + "/m2");
</script>

<template>
  <Masthead />
  <div v-bind:class="{ FlexWrapperMobile: store.sm, FlexWrapper: !store.sm }">
    <Station78 v-bind="{ valeur_ref: val_ref_78 }" />
    <Selection />
  </div>
  <Footer />
</template>

<style>
.FlexWrapper {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: left;
  gap: 30px;
}

.FlexWrapperMobile {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  gap: 10px;
}
</style>
