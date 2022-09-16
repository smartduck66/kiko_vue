<script setup lang="ts">
import Panel from "primevue/panel";
import { results } from "../assets/mixins/types";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
defineProps<{
  occurences: string;
  results_rows: results[];
}>();
</script>

<template>
  <div v-if="store.sm || store.md">
    <Panel header="Résultats">
      <!-- Taille de l'écran inférieure à 768px  -->
      <div class="my_grid_mobile">
        <div class="c-item-mobile-1">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-city"></i></span>
            <span class="label">Site</span>
          </span>
          <div v-for="item in results_rows">
            <div class="site">{{ Object(item).site }}</div>
          </div>
        </div>

        <div class="c-item-mobile-2">
          <div class="container x mandatory-scroll-snapping" dir="ltr">
            <div class="icon"><i class="fas fa-thermometer-half"></i></div>
            <div v-for="item in results_rows">
              <div class="value">{{ Object(item).tmoy }}</div>
            </div>
            <div class="icon"><i class="fas fa-temperature-low"></i></div>
            <div v-for="item in results_rows">
              <div class="value">{{ Object(item).tmin }}</div>
            </div>
            <div class="icon"><i class="fas fa-temperature-high"></i></div>
            <div v-for="item in results_rows">
              <div class="value">{{ Object(item).tmax }}</div>
            </div>
            <div class="icon"><i class="fas fa-sun"></i></div>
            <div v-for="item in results_rows">
              <div class="value">{{ Object(item).soleil }}</div>
            </div>
            <div class="icon"><i class="fas fa-cloud-rain"></i></div>
            <div v-for="item in results_rows">
              <div class="value">{{ Object(item).pluie }}</div>
            </div>
            <div class="icon"><i class="fas fa-wind"></i></div>
            <div v-for="item in results_rows">
              <div class="value">{{ Object(item).vent }}</div>
            </div>
            <div class="icon"><i class="fas fa-atom"></i></div>
            <div v-for="item in results_rows">
              <div class="value">{{ Object(item).cnpe }}</div>
            </div>
            <div class="icon"><i class="fas fa-home"></i></div>
            <div v-for="item in results_rows">
              <div class="value">{{ Object(item).prix }}</div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  </div>

  <div v-else>
    <!-- Taille de l'écran supérieure à 768px  -->
    <Panel v-bind="{ header: occurences }" style="width: 743px">
      <div class="my_grid">
        <div class="c-item-1">
          <span class="icon-text">
            <span class="icon"><i class="fas fa-city"></i></span>
            <span class="label">Site</span>
          </span>
          <div v-for="item in results_rows">
            <div class="site">{{ Object(item).site }}</div>
          </div>
        </div>
        <div class="c-item-2">
          <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-thermometer-half"></i></span>
          <div v-for="item in results_rows">
            <div class="value">{{ Object(item).tmoy }}</div>
          </div>
        </div>
        <div class="c-item-3">
          <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-temperature-low"></i></span>
          <div v-for="item in results_rows">
            <div class="value">{{ Object(item).tmin }}</div>
          </div>
        </div>
        <div class="c-item-4">
          <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-temperature-high"></i></span>
          <div v-for="item in results_rows">
            <div class="value">{{ Object(item).tmax }}</div>
          </div>
        </div>
        <div class="c-item-5">
          <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-sun"></i></span>
          <div v-for="item in results_rows">
            <div class="value">{{ Object(item).soleil }}</div>
          </div>
        </div>
        <div class="c-item-6">
          <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-cloud-rain"></i></span>
          <div v-for="item in results_rows">
            <div class="value">{{ Object(item).pluie }}</div>
          </div>
        </div>
        <div class="c-item-7">
          <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-wind"></i></span>
          <div v-for="item in results_rows">
            <div class="value">{{ Object(item).vent }}</div>
          </div>
        </div>
        <div class="c-item-8">
          <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-atom"></i></span>
          <div v-for="item in results_rows">
            <div class="value">{{ Object(item).cnpe }}</div>
          </div>
        </div>
        <div class="c-item-9">
          <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-home"></i></span>
          <div v-for="item in results_rows">
            <div class="value">{{ Object(item).prix }}</div>
          </div>
        </div>
      </div>
    </Panel>
  </div>
</template>

<style scoped>
.my_grid_mobile {
  display: grid;
  grid-template-columns: 170px 155px;
  grid-template-rows: 40px;
}
[class^="c-item-mobile"] {
  display: inline-grid;
  margin: 15px 0px 0px 0px;
  justify-content: right;
}
.c-item-mobile-1 {
  grid-column: 1;
  justify-content: left;
  background: #da1639;
}
.c-item-mobile-2 {
  grid-column: 2;
}

.container {
  display: flex;
  overflow: auto;
  outline: none;
  flex: none;
  box-shadow: -1px 0 0 #ecedf0;
}

.container.x {
  width: 100%;
  height: 40px;
  flex-flow: row nowrap;
}

/* scroll-snap */
.x.mandatory-scroll-snapping {
  scroll-snap-type: x mandatory;
}

.container > div {
  text-align: center;
  scroll-snap-align: center;
  flex: none;
}

.x.container > div {
  line-height: 40px;
  font-size: 16px;
  width: 100%;
  height: 40px;
}

.site {
  height: 40px;
  align-self: stretch;
  white-space: nowrap;
  flex-grow: 0;
  font-size: 14px;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.14;
  letter-spacing: normal;
  padding: 15px 0px 0px 0px;
  text-align: left;
  color: #071621;
  text-overflow: ellipsis; /* Au cas où le nom du site est trop grand */
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  -webkit-box-orient: vertical;
}
.value {
  height: 40px;
  padding: 15px 0px 0px 0px;
  flex-grow: 1;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: right;
  color: #071621;
}

.label {
  margin: 0px 0px 0px 0px;
  padding: 0px 0px 0px 5px;
}

.my_grid {
  display: grid;
  grid-template-columns: 230px repeat(8, 50px);
  gap: 10px;
  grid-template-rows: 40px;
}
[class^="c-item"] {
  display: inline-grid;
  justify-content: right;
}
.c-item-1 {
  grid-column: 1;
  justify-content: left;
}
.c-item-2 {
  grid-column: 2;
}
.c-item-3 {
  grid-column: 3;
}
.c-item-4 {
  grid-column: 4;
}
.c-item-5 {
  grid-column: 5;
}
.c-item-6 {
  grid-column: 6;
}
.c-item-7 {
  grid-column: 7;
}
.c-item-8 {
  grid-column: 8;
}
.c-item-9 {
  grid-column: 9;
}
</style>
