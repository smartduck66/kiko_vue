<script setup lang="ts">
import StationRef from "./Station_ref.vue";
import Selection from "./Selection.vue";
import Footer from "./Footer.vue";
import { useStore } from "../assets/mixins/store.js";
import Masthead from "./Masthead.vue";
const store = useStore();

// Récupération des valeurs de la station de référence
// Par défaut, on choisit la station météo de Trappes, la plus proche de Vaucresson
const station = store.fc[store.fc.findIndex((x: { indicatif: string }) => x.indicatif == "78621001")];

let val_ref_78: string[] = [];
val_ref_78.push(station.indicatif + " - " + station.ville + " (alt. : " + station.altitude + " m)");
val_ref_78.push(station.temp_moy + "°");
val_ref_78.push(station.temp_min + "°");
val_ref_78.push(station.temp_max + "°");
val_ref_78.push(station.canicule + " j/an");
val_ref_78.push(isNaN(Number(station.ensoleillement)) ? "-" : store.milliers_0.format(station.ensoleillement) + " h/an");
val_ref_78.push(isNaN(Number(station.pluie)) ? "-" : store.milliers_0.format(station.pluie) + " mm/mois");
val_ref_78.push(isNaN(Number(station.vent)) ? "-" : store.milliers_0.format(station.vent) + " j/an");
val_ref_78.push(station.distance_cnpe + " kms");
val_ref_78.push(isNaN(Number(station.prix_maisons)) ? "-" : store.euros_0.format(station.prix_maisons) + "/m2");
</script>

<template>

<Masthead />
  <div v-bind:class="{ FlexWrapperMobile: store.sm, FlexWrapper: !store.sm }">

    <StationRef v-bind="{ valeur_ref: val_ref_78 }" />
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
  align-items: start;
  gap: 30px;
}

.FlexWrapperMobile {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  gap: 10px;
}
</style>
