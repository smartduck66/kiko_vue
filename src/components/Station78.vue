<script setup lang="ts">
import Panel from "primevue/panel";
defineProps<{ valeur_ref: string[] }>();
</script>

<template>
  <Panel v-bind="{ header: valeur_ref[0] }">
    <div class="my_grid">
      <div class="c-item-1">
        <p>
          <div>
            <span class="icon"><i class="fas fa-thermometer-half" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Température moyenne'"></i></span>
            {{ valeur_ref[1] }}
          </div>
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
            <span class="icon"><i class="fas fa-atom" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Distance centrale nucléaire la plus proche'"></i></span>
            {{ valeur_ref[4] }}
          </span>
        </p>
      </div>
      <div class="c-item-2">
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-sun" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="`Durée d'insolation`"></i></span>
            {{ valeur_ref[5] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-cloud-rain" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Précipitations'"></i></span>
            {{ valeur_ref[6] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-wind" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Nombre moyen de jours avec rafales de vent'"></i></span>
            {{ valeur_ref[7] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon"><i class="fas fa-home" :style="{ 'font-family': 'fa-solid' }" v-tooltip.right="'Prix moyen au m2 des maisons'"></i></span>
            {{ valeur_ref[8] }}
          </span>
        </p>
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
  grid-template-columns: 160px 160px;
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
</style>
