<script setup lang="ts">
//import { database } from "../assets/mixins/utils.js";
//import Map from "./Map.vue";
import Results from "./Results.vue";
import { ref, Ref } from "vue";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { fiche_climatique, results, niveau_nappe } from "../assets/mixins/types";
import { site_dangereux_le_plus_proche, convert_DMS_DD } from "../assets/mixins/distances";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();

const open = ref(false); //gestion de la fenêtre modale des risques

// Définition des colonnes des résultats en valeurs réactives
let results_table: Ref<results[]> = ref([]);
const danger_ville = ref("");
const danger_cnpe = ref("");
const danger_seveso = ref("");

// Définition des valeurs par défaut (vd) des critères de sélection des sites climatiques et de la recherche rapide
const vd_min_temp = ref(10);
const vd_max_temp = ref(20);
const vd_min_canicule = ref(0);
const vd_max_canicule = ref(30);
const vd_min_soleil = ref(1700);
const vd_max_soleil = ref(2200);
const vd_min_pluie = ref(600);
const vd_max_pluie = ref(1000);
const vd_min_vent = ref(0);
const vd_max_vent = ref(50);
const vd_dpt = ref(78);
const vd_dpt2 = ref(78);
const vd_commune = ref(78190);

// Définition de l'objet 'nappes'
class data_nappes {
  code_bss: string;
  altitude: string;
  nb_mesures_piezo: string;
  code_commune_insee: string;
  nom_commune: string;
  date_debut_mesure: string;
  date_fin_mesure: string;
  latitude: string;
  longitude: string;
  code_departement: string;

  constructor() {
    this.code_bss = "";
    this.altitude = "";
    this.nb_mesures_piezo = "";
    this.code_commune_insee = "";
    this.nom_commune = "";
    this.date_debut_mesure = "";
    this.date_fin_mesure = "";
    this.latitude = "";
    this.longitude = "";
    this.code_departement = "";
  }
}

// Schéma de validation
// https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
const schema_selection = Yup.object().shape({
  min_temp: Yup.number().max(40).integer(),
  max_temp: Yup.number().max(40).integer(),
  min_canicule: Yup.number().min(0).max(300).integer(),
  max_canicule: Yup.number().max(300).integer(),
  min_soleil: Yup.number().max(4000).integer(),
  max_soleil: Yup.number().max(4000).integer(),
  min_pluie: Yup.number().max(2000).integer(),
  max_pluie: Yup.number().max(2000).integer(),
  min_vent: Yup.number().min(0).max(999).integer(),
  max_vent: Yup.number().max(999).integer(),
});

const dptRegex = /^\d+(;\d+)*$/;
const schema_fast_Dpt = Yup.object().shape({
  //dpt: Yup.number().max(1000).positive().integer(),
  dpt: Yup.string().matches(dptRegex),
});

const schema_fast_Commune = Yup.object().shape({
  commune: Yup.number().max(99999).positive().integer(),
});

function affichage_fiches<Type extends fiche_climatique[]>(results: Type): void {
  // Fonction de construction de l'affichage des fiches par colonne

  // Reset de l'array des résultats
  results_table.value.splice(0);

  if (store.drias_checked) {
    results_table.value = results.map((r) => {
      const row: results = Object.create(results);
      const station_drias = store.drias[store.drias.findIndex((x: { indicatif: string }) => x.indicatif == r.indicatif)];
      row.col1 = r.indicatif + " " + r.ville + " (" + r.altitude.toString() + " m)";
      row.col2 = r.temp_moy.toString();
      row.col3 = station_drias.temp_moy.toString();
      row.col4 = r.temp_min.toString();
      row.col5 = station_drias.temp_min.toString();
      row.col6 = r.temp_max.toString();
      row.col7 = station_drias.temp_max.toString();
      isNaN(Number(r.canicule)) ? (row.col8 = "-") : (row.col8 = store.milliers_0.format(Number(r.canicule)));
      row.col9 = station_drias.canicule.toString();
      row.col10 = r.pluie.toString();
      row.col11 = station_drias.pluie.toString();
      return row;
    });
  } else {
    results_table.value = results.map((r) => {
      const row: results = Object.create(results);
      //console.log(convert_DMS_DD(r.latitude)+";",convert_DMS_DD(r.longitude));
      row.col1 = r.indicatif + " " + r.ville + " (" + r.altitude.toString() + " m)";
      row.col2 = r.temp_moy.toString();
      row.col3 = r.temp_min.toString();
      row.col4 = r.temp_max.toString();
      isNaN(Number(r.canicule)) ? (row.col5 = "-") : (row.col5 = store.milliers_0.format(Number(r.canicule)));
      isNaN(Number(r.pluie)) ? (row.col6 = "-") : (row.col6 = store.milliers_0.format(Number(r.pluie)));
      isNaN(Number(r.ensoleillement)) ? (row.col7 = "-") : (row.col7 = store.milliers_0.format(Number(r.ensoleillement)));
      isNaN(Number(r.vent)) ? (row.col8 = "-") : (row.col8 = store.milliers_0.format(Number(r.vent)));
      row.col9 = r.distance_cnpe.toString();
      isNaN(Number(r.prix_maisons)) ? (row.col10 = "-") : (row.col10 = store.euros_0.format(Number(r.prix_maisons)));
      return row;
    });
  }

  store.nb_occurences = results.length; //.toString()+" résultats"; -> Déclenche l'affichage du tableau de résultats dès que la valeur change
  store.forages_search = false;
}

function affichage_forages<Type extends niveau_nappe[]>(results: Type): void {
  // Fonction de construction de l'affichage des forages par colonne

  // Reset de l'array des résultats
  results_table.value.splice(0);
  results_table.value = results.map((r) => {
    const row: results = Object.create(results);
    row.col1 = r.code_bss;
    row.col2 = store.milliers_0.format(r.altitude) + " m";
    row.col3 = store.milliers_0.format(r.nb_mesures_piezo);
    row.col4 = r.code_commune_insee;
    row.col5 = r.nom_commune;
    row.col6 = r.date_debut_mesure;
    row.col7 = r.date_fin_mesure;
    return row;
  });

  store.nb_occurences = results.length; //.toString()+" résultats"; -> Déclenche l'affichage du tableau de résultats dès que la valeur change
  store.forages_search = true;
}

function onSearch(criteres: any) {
  // Appui sur le bouton 'Rechercher' : affichage des fiches climatiques correspondantes

  // Dé-référencement de l'objet pour récupérer les valeurs
  let p1 = Number(Object(criteres).min_temp);
  let p2 = Number(Object(criteres).max_temp);
  let p3 = Number(Object(criteres).min_canicule);
  let p4 = Number(Object(criteres).max_canicule);
  let p5 = Number(Object(criteres).min_soleil);
  let p6 = Number(Object(criteres).max_soleil);
  let p7 = Number(Object(criteres).min_pluie);
  let p8 = Number(Object(criteres).max_pluie);
  let p9 = Number(Object(criteres).min_vent);
  let p10 = Number(Object(criteres).max_vent);

  // Sélection des fiches climatiques
  let results = store.fc;
  if (p1 + p2 > 0) {
    results = results.filter((x: { temp_moy: number }) => x.temp_moy >= p1 && x.temp_moy <= p2);
  }
  if (p3 + p4 > 0) {
    results = results.filter((x: { canicule: number }) => x.canicule >= p3 && x.canicule <= p4);
  }
  if (p5 + p6 > 0) {
    results = results.filter((x: { ensoleillement: number }) => x.ensoleillement >= p5 && x.ensoleillement <= p6);
  }
  if (p7 + p8 > 0) {
    results = results.filter((x: { pluie: number }) => x.pluie >= p7 && x.pluie <= p8);
  }
  if (p9 + p10 > 0) {
    results = results.filter((x: { vent: number }) => x.vent >= p9 && x.vent <= p10);
  }

  // Tri ascendant sur les fiches (par le nombre de jours de canicule)
  affichage_fiches(
    results.sort(function (a: { canicule: number }, b: { canicule: number }) {
      return a.canicule - b.canicule;
    })
  );
}

function onFastSearchDpt(criteres: any) {
  // Appui sur le 1er bouton 'GO' : affichage des fiches climatiques correspondantes au(x) département(s) saisi(s)
  // Il est en effet possible de saisir plusieurs départements séparés par un ;. Ex : 78;79;95

  let results: fiche_climatique[] = [];

  if (Object(criteres).dpt.toString().includes(";")) {
    // Dé-référencement de l'objet pour récupérer les différentes valeurs des départements saisis
    let p1 = Object(criteres).dpt.split(";");

    // Sélection des fiches climatiques, en recherchant les blocs de fiches climatiques de chaque département
    [...p1.values()].map((value) => {
      let array = store.fc.filter((x: { departement: string }) => x.departement == value);

      // Transformation de l'array (= tableau de fiches climatiques) en une suite d'objets distincts
      array.forEach((obj: fiche_climatique) => {
        results.push(obj);
      });
    });
  } else {
    // Dé-référencement de l'objet pour récupérer le département saisi
    let p1 = Object(criteres).dpt;

    // Sélection des fiches climatiques du département unique saisi
    results = store.fc.filter((x: { departement: string }) => x.departement == p1);
  }

  // Tri ascendant sur les fiches (par le nombre de jours de canicule)
  affichage_fiches(
    results.sort(function (a: { canicule: number }, b: { canicule: number }) {
      return a.canicule - b.canicule;
    })
  );
}

async function onFastSearchNappes(criteres: any) {
  // Appui sur le 1er bouton 'GO' : affichage des points de forage actifs au 1er janvier de l'année n-1 du département saisi

  // Dé-référencement de l'objet pour récupérer le département saisi
  let cp = Object(criteres).dpt2;

  // On sélectionne seulement les forages actifs au 1er janvier de l'année précédente
  const last_year = new Date().getFullYear() - 1; // Month	[mm]	(1 - 12)     Day		[dd]	(1 - 31)      Year		[yyyy]
  const API_URL = "https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/stations?code_departement=" + cp + "&date_recherche=" + last_year + "-01-01";
  const response = await fetch(API_URL);

  if (!response.ok) {
    alert("Le département saisi est inconnu ou une erreur technique est survenue ! Veuillez saisir un autre département valide.");
  } else {
    const forages = (await response.json()).data;

    const results: niveau_nappe[] = forages.map((item: any) => {
      const c = new data_nappes(); // note the "new" keyword here
      c.code_bss = item.code_bss;
      c.altitude = item.altitude_station;
      c.nb_mesures_piezo = item.nb_mesures_piezo;
      c.code_commune_insee = item.code_commune_insee;
      c.nom_commune = item.nom_commune;
      c.date_debut_mesure = item.date_debut_mesure.substr(8, 2) + "/" + item.date_debut_mesure.substr(5, 2) + "/" + item.date_debut_mesure.substr(0, 4);
      c.date_fin_mesure = item.date_fin_mesure.substr(8, 2) + "/" + item.date_fin_mesure.substr(5, 2) + "/" + item.date_fin_mesure.substr(0, 4);
      c.latitude = item.geometry.coordinates[1];
      c.longitude = item.geometry.coordinates[0];
      c.code_departement = item.code_departement;
      return c;
    });

    affichage_forages(results);
  }
}

async function onFastSearchCommune_serverless(criteres: any) {
  // Affichage d'une modale contenant les risques liés à la commune (code postal saisi)
  // Appel d'une fonction serveless sécurisée
  let cp = Object(criteres).commune.toString(); // Dé-référencement de l'objet pour récupérer les valeurs

  const API_URL = "/.netlify/functions/database?code_postal=" + cp;
  const response = await fetch(API_URL);
  if (!response.ok) {
    alert(
      "Le code saisi n'existe pas dans la base de référence des communes ou une erreur technique est survenue ! Veuillez saisir un autre code postal valide."
    );
    vd_commune.value = 78190; // Réaffichage du code postal de référence
  } else {
    const result = (await response.json()).data;
    const ville: string = result.ville;
    const lat: number = result.latitude;
    const lon: number = result.longitude;

    const cnpe = site_dangereux_le_plus_proche(store.cnpe, lat, lon); // Fonction 'importée' de distances.js
    const seveso = site_dangereux_le_plus_proche(store.seveso, lat, lon); // Fonction 'importée' de distances.js

    danger_ville.value = ville + " (" + cp + ")";
    danger_cnpe.value = cnpe.site + " (" + Math.trunc(cnpe.distance) + "  kms)";
    danger_seveso.value = seveso.site + " (" + Math.trunc(seveso.distance) + "  kms)";

    open.value = true; // Affichage de la modale
  }
}

async function onFastSearchCommune_serverless1(criteres: any) {
  // Affichage d'une modale contenant les risques liés à la commune (code postal saisi)
  // Appel d'une fonction serveless sécurisée
  // NE FONCTIONNE PAS AU 3/10/2022 -> Tombe systématiquement en erreur
  let cp = Object(criteres).commune.toString(); // Dé-référencement de l'objet pour récupérer les valeurs

  const API_URL = "/.netlify/functions/database?code_postal=" + cp;

  await fetch(API_URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const result = data;
      const ville: string = result.ville;
      const lat: number = result.latitude;
      const lon: number = result.longitude;

      const cnpe = site_dangereux_le_plus_proche(store.cnpe, lat, lon); // Fonction 'importée' de distances.js
      const seveso = site_dangereux_le_plus_proche(store.seveso, lat, lon); // Fonction 'importée' de distances.js

      danger_ville.value = ville + " (" + cp + ")";
      danger_cnpe.value = cnpe.site + " (" + Math.trunc(cnpe.distance) + "  kms)";
      danger_seveso.value = seveso.site + " (" + Math.trunc(seveso.distance) + "  kms)";

      open.value = true; // Affichage de la modale
    })
    .catch(function (error) {
      alert(
        "Le code saisi n'existe pas dans la base de référence des communes ou une erreur technique est survenue ! Veuillez saisir un autre code postal valide."
      );
      vd_commune.value = 78190; // Réaffichage du code postal de référence
    });
}

function onInvalidSearch(button: string) {
  // Un ou plusieurs critères sont invalides et ne correspondent pas au schéma défini avec Yup
  const submitBtn = document.querySelector(button);
  submitBtn!.classList.add("invalid");
  setTimeout(() => {
    submitBtn!.classList.remove("invalid");
  }, 1000);
}

function ResetFiltres(): void {
  vd_min_temp.value = 0;
  vd_max_temp.value = 0;
  vd_min_canicule.value = 0;
  vd_max_canicule.value = 0;
  vd_min_soleil.value = 0;
  vd_max_soleil.value = 0;
  vd_min_pluie.value = 0;
  vd_max_pluie.value = 0;
  vd_min_vent.value = 0;
  vd_max_vent.value = 0;
}
</script>

<template>
  <div class="FlexWrapper-panel">
    <Panel header="Sélection des stations météo">
      <template #icons>
        <button
          name="effacer les valeurs"
          class="fas fa-eraser CTA"
          :style="{ 'font-family': 'fa-solid' }"
          @click="ResetFiltres()"
          v-tooltip.right="'Réinitialiser les filtres'"
        ></button>
      </template>
      <Form @submit="onSearch" :validation-schema="schema_selection" @invalid-submit="onInvalidSearch('.search-btn')">
        <div class="my_grid">
          <div class="c-item-1">
            <span>-----------------------</span>
            <span>Température moyenne :</span>
            <span>Nb jours caniculaires :</span>
            <span>Durée d'insolation :</span>
            <span>Précipitations :</span>
            <span>Nb jours avec rafales :</span>
          </div>
          <div class="c-item-2">
            <span><b>min</b></span>
            <Field name="min_temp" class="saisie-valeur" type="text" v-model="vd_min_temp" maxlength="2" aria-label="Temp. moy. mini" />
            <Field name="min_canicule" class="saisie-valeur" type="text" v-model="vd_min_canicule" maxlength="3" aria-label="Temp. caniculaire" />
            <Field name="min_soleil" class="saisie-valeur" type="text" v-model="vd_min_soleil" maxlength="4" aria-label="Soleil mini" />
            <Field name="min_pluie" class="saisie-valeur" type="text" v-model="vd_min_pluie" maxlength="4" aria-label="Pluie mini" />
            <Field name="min_vent" class="saisie-valeur" type="text" v-model="vd_min_vent" maxlength="3" aria-label="Vent mini" />
          </div>
          <div class="c-item-3">
            <span><b>max</b></span>
            <Field name="max_temp" class="saisie-valeur" type="text" v-model="vd_max_temp" maxlength="2" aria-label="Temp. moy. max" />
            <Field name="max_canicule" class="saisie-valeur" type="text" v-model="vd_max_canicule" maxlength="3" aria-label="Temp. caniculaire" />
            <Field name="max_soleil" class="saisie-valeur" type="text" v-model="vd_max_soleil" maxlength="4" aria-label="Soleil max" />
            <Field name="max_pluie" class="saisie-valeur" type="text" v-model="vd_max_pluie" maxlength="4" aria-label="Pluie max" />
            <Field name="max_vent" class="saisie-valeur" type="text" v-model="vd_max_vent" maxlength="3" aria-label="Vent max" />
          </div>
        </div>
        <div class="FlexWrapper-btn">
          <button class="search-btn" type="submit">Rechercher</button>
        </div>
      </Form>
    </Panel>

    <Panel header="Recherche rapide">
      <Form @submit="onFastSearchDpt" :validation-schema="schema_fast_Dpt" @invalid-submit="onInvalidSearch('.go-btn1')">
        <div class="my_fast_grid">
          <div class="c-fast-item-1">
            <span>Fiches département(s) :</span>
          </div>
          <div class="c-fast-item-2">
            <Field name="dpt" :style="{ width: '90px' }" class="saisie-valeur" type="text" v-model="vd_dpt" maxlength="20" aria-label="Code département" />
          </div>
          <div class="c-fast-item-3">
            <button class="go-btn1" type="submit">GO</button>
          </div>
        </div>
      </Form>
      <Form @submit="onFastSearchNappes" :validation-schema="schema_fast_Dpt" @invalid-submit="onInvalidSearch('.go-btn2')">
        <div class="my_fast_grid">
          <div class="c-fast-item-1">
            <span>Nappes département :</span>
          </div>
          <div class="c-fast-item-2">
            <Field name="dpt2" class="saisie-valeur" type="text" v-model="vd_dpt2" maxlength="20" aria-label="Code département" />
          </div>
          <div class="c-fast-item-3">
            <button class="go-btn2" type="submit">GO</button>
          </div>
        </div>
      </Form>
      <Form @submit="onFastSearchCommune_serverless" :validation-schema="schema_fast_Commune" @invalid-submit="onInvalidSearch('.go-btn2')">
        <div class="my_fast_grid">
          <div class="c-fast-item-1">
            <span>Risques commune (CP) :</span>
          </div>
          <div class="c-fast-item-2">
            <Field name="commune" class="saisie-valeur" type="text" v-model="vd_commune" maxlength="5" aria-label="Code postal" />
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
  <Results :key="store.nb_occurences" v-bind="{ occurences: store.nb_occurences, results_rows: results_table }" />
  <!-- <Map :key="store.nb_occurences" v-bind="{ markers: results_table }" /> -->
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
  color: #022542;
}

.FlexWrapper-panel {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  gap: 20px;
  margin-bottom: 20px;
}
.my_grid {
  display: grid;
  grid-template-columns: 175px 75px 75px;
  grid-template-rows: 250px;
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
  grid-template-rows: 20px;
  padding: 1em;
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
  justify-content: right;
  gap: 30px;
}

.CTA {
  background-color: transparent;
  background-repeat: no-repeat;
  border: none;
  text-align: center;
}
.search-btn {
  background: #022542;
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
  margin-bottom: 10px;
  margin-right: 15px;
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
  background: #022542;
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
  background: #022542;
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
