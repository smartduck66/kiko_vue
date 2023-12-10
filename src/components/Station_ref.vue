<script setup lang="ts">
// @ts-nocheck
// Car une erreur TS2698 'Spread types may only be created from object types' s'active sur cette ligne (build only)       
// <div v-if="selectedStationRef" v-bind="newStationRef(selectedStationRef.indicatif)"></div> 
import Panel from "primevue/panel";
import Listbox from "primevue/listbox";
import { ref, Ref } from "vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
const props = defineProps(["valeur_ref"]);

const open = ref(false); //gestion de la fenêtre modale
const refresh = ref(0); //refresh des valeurs de référence affichées après le choix d'une nouvelle station
const selectedStationRef = ref();

// Constitution de la liste "département/ville de la station météo"
// Cette liste va servir à la 'dropdown' de choix d'une nouvelle station de référence
class station_meteo {
  indicatif: string;
  ville: string;

  constructor() {
    this.indicatif = "";
    this.ville = "";
  }
}

const liste_stations: Ref<station_meteo[] | undefined> = ref(undefined);

// Construction des options de la liste - A priori, le passage par une classe (et pas uniquement par un string[] semble obligatoire pour 'options')
liste_stations.value = store.fc.map((item: any) => {
  const s = new station_meteo(); // note the "new" keyword here
  s.indicatif = item.indicatif;
  s.ville = item.departement + " " + item.ville;

  return s;
});

refresh.value += 1; // refresh des valeurs de référence

function newStationRef(new_indicatif_station_ref: string) {
  // On modifie la station de référence pour la durée de la session
  const station = store.fc[store.fc.findIndex((x: { indicatif: string }) => x.indicatif == new_indicatif_station_ref)];

  props.valeur_ref[0] = station.indicatif + " - " + station.ville + " (alt. : " + station.altitude + " m)";
  props.valeur_ref[1] = station.temp_moy + "°";
  props.valeur_ref[2] = station.temp_min + "°";
  props.valeur_ref[3] = station.temp_max + "°";
  props.valeur_ref[4] = station.canicule + " j/an";
  props.valeur_ref[5] = isNaN(Number(station.ensoleillement)) ? "-" : store.milliers_0.format(station.ensoleillement) + " h/an";
  props.valeur_ref[6] = isNaN(Number(station.pluie)) ? "-" : store.milliers_0.format(station.pluie) + " mm/mois";
  props.valeur_ref[7] = isNaN(Number(station.vent)) ? "-" : store.milliers_0.format(station.vent) + " j/an";
  props.valeur_ref[8] = isNaN(Number(station.distance_cnpe)) ? "-" : store.milliers_0.format(station.distance_cnpe) + " kms";
  props.valeur_ref[9] = isNaN(Number(station.prix_maisons)) ? "-" : store.euros_0.format(station.prix_maisons) + "/m2";

  open.value = false; // On ferme la modale
  refresh.value += 1; // refresh des valeurs de référence
  selectedStationRef.value = ""; // RAZ afin de pouvoir rechanger une nouvelle fois la station de référence
}

</script>

<template>
  <Panel v-bind="{ header: valeur_ref[0] }" >
    <template #icons>
      <button class="fas fa-pen CTA" :style="{ 'font-family': 'fa-solid' }" @click="open = true" v-tooltip.right="'Modifier la station météo de référence'"></button>
    </template>
    <div class="my_grid" v-if="refresh">
      <div class="c-item-1">
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-thermometer-half" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Température moyenne'"></i></span>
            {{ valeur_ref[1] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-temperature-low" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Température minimale'"></i></span>
            {{ valeur_ref[2] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-temperature-high" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Température maximale'"></i></span>
            {{ valeur_ref[3] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-temperature-arrow-up" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Canicule (T >= 30°C)'"></i></span>
            {{ valeur_ref[4] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-sun" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="`Durée d'insolation`"></i></span>
            {{ valeur_ref[5] }}
          </span>
        </p>
      </div>
      <div class="c-item-2">
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-cloud-rain" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Précipitations'"></i></span>
            {{ valeur_ref[6] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"
              ><i
                class="fas fa-wind"
                :style="{ 'font-family': 'fa-solid' }"
                v-tooltip.right="'Nombre moyen de jours avec rafales de vent (vitesse > 58 km/h)'"
              ></i
            ></span>
            {{ valeur_ref[7] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"
              ><i class="fas fa-atom" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Distance centrale nucléaire la plus proche'"></i
            ></span>
            {{ valeur_ref[8] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-home" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Prix moyen au m2 des maisons'"></i></span>
            {{ valeur_ref[9] }}
          </span>
        </p>
        <p>
          <span>
            <span>-------------------</span>
          </span>
        </p>
      </div>
    </div>
  </Panel>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <div @click="open = false">
        <img src="../assets/img/close.png" class="Close" />
      </div>
      <div class="FlexWrapper_modal">
        <h2>Station de référence</h2>
        Choisissez la station météo de votre choix pour la durée de la session :
        <Listbox v-model="selectedStationRef" :options="liste_stations" filter optionLabel="ville" listStyle="height:200px" />
      </div>
      <div v-if="selectedStationRef" v-bind="newStationRef(selectedStationRef.indicatif)"></div> 
    </div>
  </Teleport>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.p-panel p {
  line-height: 2;
  margin: 0;
}

.my_grid {
  display: grid;
  grid-template-columns: 160px 160px;
  padding: 1em;
}

[class^="c-item"] {
  display: inline-grid;
}

.c-item-1 {
  grid-column: 1;
  justify-content: left;
}
.c-item-2 {
  grid-column: 2;
  justify-content: left;
}

.modal {
  position: fixed;
  z-index: 999;
  top: 10%;
  left: 43.5%;
  margin-left: -150px;
  width: 360px;
  height: 450px;
  flex-grow: 0;
  border-radius: 10px;
  border: solid 1px lightgrey;
  background-color: white;
}
.CTA {
  background-color: transparent;
  background-repeat: no-repeat;
  border: none;
  text-align: center;
}

img.Close {
  width: 32px;
  height: 32px;
  flex-grow: 0;
  margin: 16px 0px 2px 310px;
  object-fit: contain;
  filter: invert(100%);
}

.FlexWrapper_modal {
  width: 300px;
  height: 400px;
  flex-grow: 0;
  display: flex;
  gap: 20px;
  margin: -20px 0px 0px 20px;
  flex-direction: column;
  justify-content: flex-start;
  color: black;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
}


</style>
