<script setup lang="ts">
import Résultats from "./Results.vue";
import { ref, Ref } from "vue";
import Panel from "primevue/panel";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";
import { convert_DMS_DD, site_dangereux_le_plus_proche } from "../assets/mixins/distances.js";
import { fiche_climatique, results } from "../assets/mixins/types";
import fc from "../data/fc.json";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();

// Stockage local des fichiers json pour les réutiliser lors de cette session
localStorage.fc = JSON.stringify(fc);

// Définition des colonnes des résultats en valeurs réactives
const nb_occurences = ref(0);
let results_table: Ref<results[]> = ref([]);

// Définition des valeurs par défaut des critères de sélection des sites climatiques
const min_temp = ref(10);
const max_temp = ref(20);
const min_soleil = ref(1700);
const max_soleil = ref(2200);
const min_pluie = ref(600);
const max_pluie = ref(900);
const min_vent = ref(0);
const max_vent = ref(50);

// Using yup to generate a validation schema
// https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
const schema = Yup.object().shape({
  min_temp: Yup.number().max(40).positive().integer(),
  max_temp: Yup.number().max(40).positive().integer(),
  min_soleil: Yup.number().max(4000).positive().integer(),
  max_soleil: Yup.number().max(4000).positive().integer(),
  min_pluie: Yup.number().max(2000).positive().integer(),
  max_pluie: Yup.number().max(2000).positive().integer(),
  min_vent: Yup.number().min(0).max(999).integer(),
  max_vent: Yup.number().max(999).positive().integer(),
});

function affichage_fiches<Type extends fiche_climatique[]>(results: Type): void {
  // Fonction de construction de l'affichage des fiches par colonne
  
  // Reset de l'array des résultats
  results_table.value.splice(0);

  for (let i = 0; i < results.length; i++) {
    const row = Object.create(results);
    const ref: string = results[i].indicatif;
 
    row.site = ref + " " + results[i].ville + " (" + results[i].altitude.toString() + " m)";  
    row.tmoy = results[i].temp_moy;
    row.tmin=results[i].temp_min;
    row.tmax=results[i].temp_max;
    isNaN(Number(results[i].ensoleillement))?row.soleil="-":row.soleil=store.milliers_0.format(Number(results[i].ensoleillement));
    isNaN(Number(results[i].pluie))?row.pluie="-":row.pluie=store.milliers_0.format(Number(results[i].pluie));
    isNaN(Number(results[i].vent))?row.vent="-":row.vent=store.milliers_0.format(Number(results[i].vent));
    row.cnpe=results[i].distance_cnpe;
    isNaN(Number(results[i].prix_maisons))?row.prix="-":row.prix=store.euros_0.format(Number(results[i].prix_maisons));
    results_table.value.push(row);
    
  }

  nb_occurences.value = results.length //.toString()+" résultats";
}

function onSearch(criteres: any) {
  // Appui sur le bouton 'Recherche' : affichage des fiches climatiques correspondantes

  // Dé-référencement de l'objet pour récupérer les valeurs
  let p1 = Object(criteres).min_temp;
  let p2 = Object(criteres).max_temp;
  let p3 = Object(criteres).min_soleil;
  let p4 = Object(criteres).max_soleil;
  let p5 = Object(criteres).min_pluie;
  let p6 = Object(criteres).max_pluie;
  let p7 = Object(criteres).min_vent;
  let p8 = Object(criteres).max_vent;

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

function onInvalidSearch() {
  // Un ou plusieurs critères sont invalides et ne correspondent pas au schéma défini avec Yup
  const submitBtn = document.querySelector(".search-btn");
  submitBtn!.classList.add("invalid");
  setTimeout(() => {
    submitBtn!.classList.remove("invalid");
  }, 1000);
}
</script>

<template>
  <Panel header="Critères de sélection des sites">
    <Form @submit="onSearch" :validation-schema="schema" @invalid-submit="onInvalidSearch">
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
      <div class="FlexWrapper">
        <button class="search-btn" type="submit">Rechercher</button>
        <button class="reset-btn" type="reset">Réinitialiser</button>
      </div>
    </Form>
  </Panel>

  <Résultats :key="nb_occurences" v-if="nb_occurences" v-bind="{ occurences: nb_occurences, results_rows: results_table }" />
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

.FlexWrapper {
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

.reset-btn {
  background: #da1639;
  outline: none;
  border: none;
  color: #fff;
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
</style>
