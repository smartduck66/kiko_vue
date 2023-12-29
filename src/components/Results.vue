<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Card from "primevue/card";
import { ref, Ref } from "vue";
import { useStore } from "../assets/mixins/store.js";
import AreaChart from "./AreaChart.vue";
//import { mesures_nappe } from "../assets/mixins/types";
const store = useStore();

const props = defineProps(["occurences", "results_rows"]);
const nbOccurences = props.occurences.toString() + " résultats";
const max_width = window.innerWidth < 1920 ? window.innerWidth - 15 : 1100; // On détermine la taille maximum du tableau des résultats

// Définition des colonnes des résultats en valeurs réactives
let results_mesures_nappe: Ref<mesures_nappe[]> = ref([]);
const selectedStation = ref();
const selectedForage = ref();
const open = ref(false); //gestion de la fenêtre modale de la fiche climatique complète
const modal_content = ref("");

class mesures_nappe {
  date_mesure: string;
  timestamp: number;
  niveau_nappe_eau: string;
  profondeur_nappe_eau: string;

  constructor() {
    this.date_mesure = "";
    this.timestamp = 0;
    this.niveau_nappe_eau = "";
    this.profondeur_nappe_eau = "";
  }
}

const onRowSelect_FC = (event: any) => {
  if (store.xxxl) {
    fetch("/ficheclim/" + event.data.col1.substr(0, 8) + ".data")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur de chargement du fichier: ${response.statusText}`);
        }
        return response.text();
      })
      .then((content) => {
        // Afficher le contenu du fichier brut en modale (ATTENTION : que sur grand écran)
        modal_content.value = content;
        open.value = true; // Affichage de la modale
      })
      .catch((error) => {
        console.error("Erreur:", error.message);
      });
  } else {
    alert("La visualisation d'une fiche climatique ne peut se faire que sur un écran full HD");
  }
  selectedStation.value = null;
};

const onRowSelect_Forage = async (event: any) => {
  if (store.xxxl) {
    modal_content.value =  "Evolution de la profondeur (en m) de la nappe d'eau souterraine\n";
    modal_content.value += "---------------------------------------------------------------\n\n";
    modal_content.value += "Code piézomètre            : " + event.data.col1 + "\n";
    modal_content.value += "Altitude de la station     : " + event.data.col2 + "\n";
    modal_content.value += "Nombre de mesures          : " + event.data.col3 + "\n";
    modal_content.value += "Commune "+"("+event.data.col4 + ")            : " + event.data.col5 + "\n";
    modal_content.value += "Première mesure effectuée  : " + event.data.col6 + "\n";
    modal_content.value += "Dernière mesure effectuée  : " + event.data.col7 + "\n";


    const API_URL = "https://hubeau.eaufrance.fr/api/v1/niveaux_nappes/chroniques?&sort=desc&code_bss=" + event.data.col1; // On prend les 5.000 dernières mesures au maximum
    const response = await fetch(API_URL);

    if (!response.ok) {
      alert("Une erreur technique est survenue !");
    } else {
      const mesures = (await response.json()).data;
      results_mesures_nappe = mesures.map((item: any) => {
        const c = new mesures_nappe(); // note the "new" keyword here
        c.date_mesure = item.date_mesure;
        c.timestamp = Date.parse(c.date_mesure);
        c.niveau_nappe_eau = item.niveau_nappe_eau;
        c.profondeur_nappe_eau = item.profondeur_nappe;

        return c;
      });
      
    }

    open.value = true; // Affichage de la modale
  } else {
    alert("La visualisation du graphique d'évolution d'une nappe ne peut se faire que sur un écran full HD");
  }
  selectedForage.value = null;
};
</script>

<template>
  <div v-if="occurences">
    <!-- Le template de résultats ne s'affiche que s'il y a au moins UN résultat  -->
    <Card :style="{ 'max-width': max_width + 'px' }">
      <template #title>
        {{ nbOccurences }}
      </template>
      <template #content>
        <div v-if="store.forages_search">
          <DataTable
            v-model:selection="selectedForage"
            :value="props.results_rows"
            tableStyle="min-width: 65rem"
            scrollable
            paginator
            :rows="20"
            :rowsPerPageOptions="[10, 20, 50]"
            selectionMode="single"
            :metaKeySelection="false"
            dataKey="id"
            @rowSelect="onRowSelect_Forage"
          >
            <Column field="col1" sortable header="Piézomètre"></Column>
            <Column field="col2" sortable header="Altitude"></Column>
            <Column field="col3" sortable header="Nb mesures"></Column>
            <Column field="col4" sortable header="Insee"></Column>
            <Column field="col5" sortable header="Commune"></Column>
            <Column field="col6" sortable header="1ère mesure"></Column>
            <Column field="col7" sortable header="Dernière mesure"></Column>
          </DataTable>
        </div>

        <div v-else>
          <div v-if="!store.drias_checked">
            <DataTable
              v-model:selection="selectedStation"
              :value="props.results_rows"
              tableStyle="min-width: 65rem"
              scrollable
              paginator
              :rows="20"
              :rowsPerPageOptions="[10, 20, 50]"
              selectionMode="single"
              :metaKeySelection="false"
              dataKey="id"
              @rowSelect="onRowSelect_FC"
            >
              <Column field="col1" sortable header="Station météo"></Column>
              <Column field="col2" sortable header="T° moy"></Column>
              <Column field="col3" sortable header="T° min"></Column>
              <Column field="col4" sortable header="T° max"></Column>
              <Column field="col5" sortable header="Cani."></Column>
              <Column field="col6" sortable header="Pluie"></Column>
              <Column field="col7" sortable header="Soleil"></Column>
              <Column field="col8" sortable header="Vent"></Column>
              <Column field="col9" sortable header="CNPE"></Column>
              <Column field="col10" sortable header="Prix"></Column>
            </DataTable>
          </div>
          <div v-else>
            <DataTable
              v-model:selection="selectedStation"
              :value="props.results_rows"
              tableStyle="min-width: 65rem"
              scrollable
              paginator
              :rows="20"
              :rowsPerPageOptions="[10, 20, 50]"
              selectionMode="single"
              :metaKeySelection="false"
              dataKey="id"
              @rowSelect="onRowSelect_FC"
            >
              <Column field="col1" sortable header="Station météo"></Column>
              <Column field="col2" sortable header="T° moy"></Column>
              <Column field="col3" sortable header="T° moy" style="color: red"></Column>
              <Column field="col4" sortable header="T° min"></Column>
              <Column field="col5" sortable header="T° min" style="color: red"></Column>
              <Column field="col6" sortable header="T° max"></Column>
              <Column field="col7" sortable header="T° max" style="color: red"></Column>
              <Column field="col8" sortable header="Cani."></Column>
              <Column field="col9" sortable header="Trop." style="color: red"></Column>
              <Column field="col10" sortable header="Pluie"></Column>
              <Column field="col11" sortable header="Pluie" style="color: red"></Column>
            </DataTable>
          </div>
        </div>
      </template>
    </Card>
  </div>
  <div v-else>
    <Card :style="{ 'max-width': max_width + 'px' }">
      <template #content>
        <div class="mention">Veuillez effectuer une recherche pour afficher des résultats...</div>
      </template>
    </Card>
  </div>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <div @click="open = false">
        <img src="../assets/img/close.png" class="Close" />
      </div>
      <div class="FlexWrapper_modal">
        <textarea id="story" name="story" rows="50" cols="100"
          >{{ modal_content }}
        </textarea>
        <AreaChart v-if="store.forages_search" v-bind="{ values: results_mesures_nappe, width: 1300, height: 500, color: '#0a94a8' }" />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.mention {
  width: 100%;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 22px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: center;
  color: grey;
  padding: 0.5em;
}

.modal {
  position: fixed;
  z-index: 999;
  top: 3%;
  left: 25%;
  margin-left: -150px;
  width: 1355px;
  height: 800px;
  flex-grow: 0;
  border-radius: 10px;
  background-color:#fbcfdc;
}

img.Close {
  width: 32px;
  height: 32px;
  flex-grow: 0;
  margin: 16px 0px 2px 1305px;
  object-fit: contain;
}
.FlexWrapper_modal {
  width: 1300px;
  height: 730px;
  flex-grow: 0;
  display: flex;
  gap: 20px;
  margin: 0px 0px 0px 32px;
  flex-direction: column;
  justify-content: flex-start;
  color: #eee;
  font-family: Courier;
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: center;
}

textarea {
  padding: 10px;
  max-width: 100%;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 1px #999;
}
</style>
