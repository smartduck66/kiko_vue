<script setup lang="ts">
import { database } from "../assets/mixins/utils.js";
import Résultats from "./Results.vue";
import { ref, Ref } from "vue";
import Panel from "primevue/panel";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { fiche_climatique, results } from "../assets/mixins/types";
import fc from "../data/fc.json";
import seveso from "../data/seveso.json";
import cnpe from "../data/centrales.json";
import { site_dangereux_le_plus_proche } from "../assets/mixins/distances.js";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();

// Stockage local des fichiers json pour les réutiliser lors de cette session
localStorage.fc = JSON.stringify(fc);
localStorage.seveso = JSON.stringify(seveso);
localStorage.cnpe = JSON.stringify(cnpe);

const open = ref(false); //gestion de la fenêtre modale des risques

// Définition des colonnes des résultats en valeurs réactives
const nb_occurences = ref(0);
let results_table: Ref<results[]> = ref([]);
const danger_ville = ref("");
const danger_cnpe = ref("");
const danger_seveso = ref("");

// Définition des valeurs par défaut des critères de sélection des sites climatiques et de la recherche rapide
const min_temp = ref(10);
const max_temp = ref(20);
const min_soleil = ref(1700);
const max_soleil = ref(2200);
const min_pluie = ref(600);
const max_pluie = ref(900);
const min_vent = ref(0);
const max_vent = ref(50);
const dpt = ref(78);
const commune = ref(78190);

// Schéma de validation
// https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
const schema_selection = Yup.object().shape({
  min_temp: Yup.number().max(40).positive().integer(),
  max_temp: Yup.number().max(40).positive().integer(),
  min_soleil: Yup.number().max(4000).positive().integer(),
  max_soleil: Yup.number().max(4000).positive().integer(),
  min_pluie: Yup.number().max(2000).positive().integer(),
  max_pluie: Yup.number().max(2000).positive().integer(),
  min_vent: Yup.number().min(0).max(999).integer(),
  max_vent: Yup.number().max(999).positive().integer(),
});

const schema_fast_Dpt = Yup.object().shape({
  dpt: Yup.number().max(1000).positive().integer(),
});

const schema_fast_Commune = Yup.object().shape({
  commune: Yup.number().max(99999).positive().integer(),
});

function affichage_fiches<Type extends fiche_climatique[]>(results: Type): void {
  // Fonction de construction de l'affichage des fiches par colonne

  // Reset de l'array des résultats
  results_table.value.splice(0);

  results_table.value = results.map((r) => {
    const row: results = Object.create(results);
    const ref: string = r.indicatif;
    row.site = ref + " " + r.ville + " (" + r.altitude.toString() + " m)";
    row.tmoy = r.temp_moy;
    row.tmin = r.temp_min;
    row.tmax = r.temp_max;
    isNaN(Number(r.ensoleillement)) ? (row.soleil = "-") : (row.soleil = store.milliers_0.format(Number(r.ensoleillement)));
    isNaN(Number(r.pluie)) ? (row.pluie = "-") : (row.pluie = store.milliers_0.format(Number(r.pluie)));
    isNaN(Number(r.vent)) ? (row.vent = "-") : (row.vent = store.milliers_0.format(Number(r.vent)));
    row.cnpe = r.distance_cnpe;
    isNaN(Number(r.prix_maisons)) ? (row.prix = "-") : (row.prix = store.euros_0.format(Number(r.prix_maisons)));
    return row;
  });

  nb_occurences.value = results.length; //.toString()+" résultats";
}

function onSearch(criteres: any) {
  // Appui sur le bouton 'Recherche' : affichage des fiches climatiques correspondantes

  // Dé-référencement de l'objet pour récupérer les valeurs
  let p1 = Number(Object(criteres).min_temp);
  let p2 = Number(Object(criteres).max_temp);
  let p3 = Number(Object(criteres).min_soleil);
  let p4 = Number(Object(criteres).max_soleil);
  let p5 = Number(Object(criteres).min_pluie);
  let p6 = Number(Object(criteres).max_pluie);
  let p7 = Number(Object(criteres).min_vent);
  let p8 = Number(Object(criteres).max_vent);

  const data = JSON.parse(localStorage.fc); // Récupération locale des fiches climatiques

  // Sélection des fiches climatiques et tri ascendant
  let results = data;
  if (p1 + p2 > 0) {
    results = results.filter((x: { temp_moy: number }) => x.temp_moy >= p1 && x.temp_moy <= p2);
    results.sort(function (a: { temp_moy: number }, b: { temp_moy: number }) {
      return a.temp_moy - b.temp_moy;
    });
  }
  if (p3 + p4 > 0) {
    results = results.filter((x: { ensoleillement: number }) => x.ensoleillement >= p3 && x.ensoleillement <= p4);
    results.sort(function (a: { ensoleillement: number }, b: { ensoleillement: number }) {
      return a.ensoleillement - b.ensoleillement;
    });
  }
  if (p5 + p6 > 0) {
    results = results.filter((x: { pluie: number }) => x.pluie >= p5 && x.pluie <= p6);
    results.sort(function (a: { pluie: number }, b: { pluie: number }) {
      return a.pluie - b.pluie;
    });
  }
  if (p7 + p8 > 0) {
    results = results.filter((x: { vent: number }) => x.vent >= p7 && x.vent <= p8);
    results.sort(function (a: { vent: number }, b: { vent: number }) {
      return a.vent - b.vent;
    });
  }

  affichage_fiches(results);
}

function onFastSearchDpt(criteres: any) {
  // Appui sur le 1er bouton 'GO' : affichage des fiches climatiques correspondantes au département saisi

  let p1 = Object(criteres).dpt; // Dé-référencement de l'objet pour récupérer les valeurs

  const data = JSON.parse(localStorage.fc); // Récupération locale des fiches climatiques

  // Sélection des fiches climatiques
  let results = data;
  results = results.filter((x: { departement: string }) => x.departement == p1);
  affichage_fiches(results);
}

async function onFastSearchCommune(criteres: any) {
  // Affichage d'une modale contenant les risques liés à la commune (code postal saisi)
  let cp = Object(criteres).commune.toString(); // Dé-référencement de l'objet pour récupérer les valeurs

  const data_cnpe = JSON.parse(localStorage.cnpe); // Récupération locale des coordonnées des Centrales Nucléaires
  const data_seveso = JSON.parse(localStorage.seveso); // Récupération locale des coordonnées des sites seveso

  const result = await database("communes", cp);
  const ville: string = result[0].ville;
  const lat: number = result[0].latitude;
  const lon: number = result[0].longitude;

  const cnpe = site_dangereux_le_plus_proche(data_cnpe, lat, lon); // Fonction 'importée' de distances.js
  const seveso = site_dangereux_le_plus_proche(data_seveso, lat, lon); // Fonction 'importée' de distances.js

  danger_ville.value = ville + " (" + cp + ")";
  danger_cnpe.value = cnpe.site + " (" + Math.trunc(cnpe.distance) + "  kms)";
  danger_seveso.value = seveso.site + " (" + Math.trunc(seveso.distance) + "  kms)";

  open.value = true; // Affichage de la modale
}

async function onFastSearchCommune_serverless(criteres: any) {
  // Affichage d'une modale contenant les risques liés à la commune (code postal saisi)
  let cp = Object(criteres).commune.toString(); // Dé-référencement de l'objet pour récupérer les valeurs

  const data_cnpe = JSON.parse(localStorage.cnpe); // Récupération locale des coordonnées des Centrales Nucléaires
  const data_seveso = JSON.parse(localStorage.seveso); // Récupération locale des coordonnées des sites seveso

  const API_URL = "/.netlify/functions/database?code_postal=" + cp;
  try {
    const response = await fetch(API_URL);
    const result = (await response.json()).data;
    if (!result) {
      alert("Le code postal " + cp + " n'existe pas dans la base de référence des communes !");
      throw await response.json();
    } else {
      const ville: string = result[0].ville;
      const lat: number = result[0].latitude;
      const lon: number = result[0].longitude;

      const cnpe = site_dangereux_le_plus_proche(data_cnpe, lat, lon); // Fonction 'importée' de distances.js
      const seveso = site_dangereux_le_plus_proche(data_seveso, lat, lon); // Fonction 'importée' de distances.js

      danger_ville.value = ville + " (" + cp + ")";
      danger_cnpe.value = cnpe.site + " (" + Math.trunc(cnpe.distance) + "  kms)";
      danger_seveso.value = seveso.site + " (" + Math.trunc(seveso.distance) + "  kms)";

      open.value = true; // Affichage de la modale
    }
  } catch (err) {
    alert("La base de données de référence des communes n'est pas accessible ! Erreur : " + err);
  }
}

function onInvalidSearch(button: string) {
  // Un ou plusieurs critères sont invalides et ne correspondent pas au schéma défini avec Yup
  const submitBtn = document.querySelector(button);
  submitBtn!.classList.add("invalid");
  setTimeout(() => {
    submitBtn!.classList.remove("invalid");
  }, 1000);
}
</script>

<template>
  <div class="FlexWrapper-panel">
    <Panel header="Critères de sélection des sites">
      <Form @submit="onSearch" :validation-schema="schema_selection" @invalid-submit="onInvalidSearch('.search-btn')">
        <div class="my_grid">
          <div class="c-item-1">
            <span>-----------------------</span>
            <span>Température moyenne :</span>
            <span>Durée d'insolation :</span>
            <span>Précipitations :</span>
            <span>Nb jours avec rafales :</span>
          </div>
          <div class="c-item-2">
            <span><b>min</b></span>
            <Field name="min_temp" class="saisie-valeur" type="text" v-model="min_temp" maxlength="2" />
            <Field name="min_soleil" class="saisie-valeur" type="text" v-model="min_soleil" maxlength="4" />
            <Field name="min_pluie" class="saisie-valeur" type="text" v-model="min_pluie" maxlength="4" />
            <Field name="min_vent" class="saisie-valeur" type="text" v-model="min_vent" maxlength="3" />
          </div>
          <div class="c-item-3">
            <span><b>max</b></span>
            <Field name="max_temp" class="saisie-valeur" type="text" v-model="max_temp" maxlength="2" />
            <Field name="max_soleil" class="saisie-valeur" type="text" v-model="max_soleil" maxlength="4" />
            <Field name="max_pluie" class="saisie-valeur" type="text" v-model="max_pluie" maxlength="4" />
            <Field name="max_vent" class="saisie-valeur" type="text" v-model="max_vent" maxlength="3" />
          </div>
        </div>
        <div class="FlexWrapper-btn">
          <button class="search-btn" type="submit">Rechercher</button>
          <button class="reset-btn" type="reset">Réinitialiser</button>
        </div>
      </Form>
    </Panel>

    <Panel header="Recherche rapide">
      <Form @submit="onFastSearchDpt" :validation-schema="schema_fast_Dpt" @invalid-submit="onInvalidSearch('.go-btn1')">
        <div class="my_fast_grid">
          <div class="c-fast-item-1">
            <span>Fiches département :</span>
          </div>
          <div class="c-fast-item-2">
            <Field name="dpt" class="saisie-valeur" type="text" v-model="dpt" maxlength="3" />
          </div>
          <div class="c-fast-item-3">
            <button class="go-btn1" type="submit">GO</button>
          </div>
        </div>
      </Form>
      <Form @submit="onFastSearchCommune_serverless" :validation-schema="schema_fast_Commune" @invalid-submit="onInvalidSearch('.go-btn2')">
        <div class="my_fast_grid">
          <div class="c-fast-item-1">
            <span>Risques communal (CP) :</span>
          </div>
          <div class="c-fast-item-2">
            <Field name="commune" class="saisie-valeur" type="text" v-model="commune" maxlength="5" />
          </div>
          <div class="c-fast-item-3">
            <button class="go-btn2" type="submit">GO</button>
          </div>
        </div>
      </Form>
    </Panel>
  </div>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <div @click="open = false">
        <img src="../assets/img/close.png" class="Close" />
      </div>
      <div class="FlexWrapper_modal">
        <div></div>
        <span>Commune de {{ danger_ville }}</span>
        <div></div>
        <span>Centrale nucléaire la plus proche :</span>
        <span :style="{ 'font-weight': 'bold' }">{{ danger_cnpe }}</span>
        <div></div>
        <span>Site Seveso le plus proche :</span>
        <span :style="{ 'font-weight': 'bold' }">{{ danger_seveso }}</span>
      </div>
    </div>
  </Teleport>
  <Résultats :key="nb_occurences" v-bind="{ occurences: nb_occurences, results_rows: results_table }" />
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

.FlexWrapper-panel {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  gap: 20px;
  margin-bottom: 20px;
}
.my_grid {
  display: grid;
  grid-template-columns: 175px 75px 75px;
  grid-template-rows: 250px;
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
  justify-content: right;
  text-align: right;
}
.c-item-3 {
  grid-column: 3;
  justify-content: right;
  text-align: right;
}

.my_fast_grid {
  display: grid;
  grid-template-columns: 185px 80px 60px;
  grid-template-rows: 50px;
}

[class^="c-fast-item"] {
  display: inline-grid;
}

.c-fast-item-1 {
  grid-column: 1;
  justify-content: left;
}
.c-fast-item-2 {
  grid-column: 2;
  justify-content: right;
  text-align: right;
}

.c-fast-item-3 {
  grid-column: 3;
  justify-content: right;
  text-align: right;
}
.saisie-valeur {
  width: 60px;
  height: 25px;
  border: solid 1px #f7f8fa;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: right;
  padding: 8px 5px;
}

.FlexWrapper-btn {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: left;
  gap: 60px;
}
.search-btn {
  background: var(--primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 15px;
  text-align: center;
  display: block;
  width: 130px;
  border-radius: 7px;
  margin-top: 10px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}
.search-btn:hover {
  transform: scale(1.1);
}
.search-btn.invalid {
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

.go-btn1 {
  background: var(--primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  display: block;
  width: 50px;
  height: 25px;
  border-radius: 7px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.go-btn1:hover {
  transform: scale(1.1);
}
.go-btn1.invalid {
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

.go-btn2 {
  background: var(--primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  display: block;
  width: 50px;
  height: 25px;
  border-radius: 7px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.go-btn2:hover {
  transform: scale(1.1);
}
.go-btn2:invalid {
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

.reset-btn {
  background: none;
  outline: none;
  border: none;
  font-weight: 500;
  color: #666e8a;
  font-size: 16px;
  padding: 10px 15px;
  text-align: center;
  display: block;
  width: 130px;
  border-radius: 7px;
  margin-top: 10px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}
.reset-btn:hover {
  transform: scale(1.1);
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}

.modal {
  position: fixed;
  z-index: 999;
  top: 10%;
  left: 41.5%;
  margin-left: -150px;
  width: 360px;
  height: 360px;
  flex-grow: 0;
  border-radius: 10px;
  background-color: #e62f44;
}

img.Close {
  width: 32px;
  height: 32px;
  flex-grow: 0;
  margin: 16px 0px 2px 310px;
  object-fit: contain;
}
.FlexWrapper_modal {
  width: 300px;
  height: 470px;
  flex-grow: 0;
  display: flex;
  gap: 20px;
  margin: 0px 0px 0px 32px;
  flex-direction: column;
  justify-content: flex-start;
  color: #eee;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: center;
}
</style>
