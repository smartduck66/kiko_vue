<script setup lang="ts">
import Panel from "primevue/panel";

defineProps<{ valeur_ref: string[] }>();
</script>

<template>
  <Panel v-bind="{ header: valeur_ref[0] }" :toggleable="true">
    <div class="my_grid">
      <div class="c-item-1">
        <p>
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-thermometer-half"></i>
            </span>
            <span id="tmoy"></span>
            {{ valeur_ref[1] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-temperature-low"></i>
            </span>
            <span id="tmin"></span>
            {{ valeur_ref[2] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-temperature-high"></i>
            </span>
            <span id="tmax"></span>
            {{ valeur_ref[3] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-atom"></i>
            </span>
            <span id="cnpe"></span>
            {{ valeur_ref[4] }}
          </span>
        </p>
      </div>
      <div class="c-item-2">
        <p>
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-sun"></i>
            </span>
            <span id="soleil"></span>
            {{ valeur_ref[5] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-cloud-rain"></i>
            </span>
            <span id="pluie"></span>
            {{ valeur_ref[6] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-wind"></i>
            </span>
            <span id="vent"></span>
            {{ valeur_ref[7] }}
          </span>
        </p>
        <p>
          <span class="icon-text">
            <span class="icon">
              <i class="fas fa-home"></i>
            </span>
            <span id="prix"></span>
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
  grid-template-columns: auto auto;
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
