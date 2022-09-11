<script setup lang="ts">
import Panel from "primevue/panel";
import InputNumber from "primevue/inputnumber";
</script>

<template>
  <Panel header="Critères de sélection des sites">
    <div class="my_grid">
      <div class="c-item-1">
        <p>---------------------</p>
        <p>Température moyenne :</p>
        <p>Durée d'insolation :</p>
        <p>Précipitations :</p>
        <p>Nb jours avec rafales :</p>
      </div>
      <div class="c-item-2">
        <p>min</p>
        <p>10</p>
        <p>1900</p>
        <p>800</p>
        <p>0</p>
      </div>
      <div class="c-item-3">
        <p>max</p>
        <p>20</p>
        <p>2200</p>
        <p>1000</p>
        <p>30</p>
      </div>
    </div>
  </Panel>
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
  grid-template-columns: 60% 20% 20%;
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
}
.c-item-3 {
  grid-column: 3;
  justify-content: right;
}
</style>
