<script setup lang="ts">
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Card from "primevue/card";

const props = defineProps(["occurences", "results_rows"]);
const nbOccurences = props.occurences.toString() + " résultats";
const max_width = window.innerWidth < 1920 ? window.innerWidth - 15 : 1100; // On détermine la taille maximum du tableau des résultats

</script>

<template>
  <div v-if="occurences">
    <!-- Le template de résultats ne s'affiche que s'il y a au moins UN résultat  -->
    <Card :style="{ 'max-width': max_width + 'px' }">
      <template #title>
        {{ nbOccurences }}
      </template>
      <template #content>
        <DataTable :value="props.results_rows" tableStyle="min-width: 65rem" scrollable paginator :rows="20" :rowsPerPageOptions="[10, 20, 50]">
          <Column field="site" sortable header="Station météo"></Column>
          <Column field="tmoy" sortable header="T° moy"></Column>
          <Column field="tmin" sortable header="T° min"></Column>
          <Column field="tmax" sortable header="T° max"></Column>
          <Column field="canicule" sortable header="Cani."></Column>
          <Column field="soleil" sortable header="Soleil"></Column>
          <Column field="pluie" sortable header="Pluie"></Column>
          <Column field="vent" sortable header="Vent"></Column>
          <Column field="cnpe" sortable header="CNPE"></Column>
          <Column field="prix" sortable header="Prix"></Column>
        </DataTable>
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
</style>
