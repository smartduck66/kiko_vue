<script setup lang="ts">
import { ref, Ref } from "vue";
import { results } from "../assets/mixins/types";
import { useOffsetPagination } from "@vueuse/core";
import Card from 'primevue/card';
import Button from "primevue/button";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
const props = defineProps(["occurences", "results_rows"]);

const nbOccurences = props.occurences.toString() + " résultats";

// Mécanique de pagination adaptée à 'results_rows' : https://github.com/vueuse/vueuse/blob/main/packages/core/useOffsetPagination/demo.vue
const data: Ref<results[]> = ref([]);
const page = ref(1);
const pageSize = ref((store.sm || store.md)?10:15); // Nombre de lignes affichables par page

function fetch(page: number, pageSize: number) {
  return new Promise<results[]>((resolve, reject) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setTimeout(() => {
      resolve(props.results_rows.slice(start, end));
    }, 100);
  });
}

function fetchData({ currentPage, currentPageSize }: { currentPage: number; currentPageSize: number }) {
  fetch(currentPage, currentPageSize).then((responseData) => {
    data.value = responseData;
  });
}

fetchData({
  currentPage: page.value,
  currentPageSize: pageSize.value,
});

const { currentPage, currentPageSize, pageCount, isFirstPage, isLastPage, prev, next } = useOffsetPagination({
  total: props.results_rows.length,
  page: 1,
  pageSize,
  onPageChange: fetchData,
  onPageSizeChange: fetchData,
});

</script>

<template>
  <div v-if="occurences">
  <!-- Le template de résultats ne s'affiche que s'il y a au moins UN résultat  -->
    <Card :style="store.sm || store.md ? { height: '500px' } : { width: '743px', height:'700px' }">
      <template #title>
        {{nbOccurences}}
      </template>
      <template #content>
        <div v-if="store.sm || store.md">
        <!-- Taille de l'écran inférieure à 768px  -->
        <div class="my_grid_mobile">
          <div class="c-item-mobile-1">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-city"></i></span>
              <span class="label">Site</span>
            </span>
            <div v-for="item in data">
              <div class="site">{{ Object(item).site }}</div>
            </div>
          </div>
          <div class="c-item-mobile-2">
            <div class="container x mandatory-scroll-snapping" dir="ltr">
              <div>
                <div class="icon"><i class="fas fa-thermometer-half"></i></div>
                <div v-for="item in data">
                  <div class="value">{{ Object(item).tmoy }}</div>
                </div>
              </div>
              <div>
                <div class="icon"><i class="fas fa-temperature-low"></i></div>
                <div v-for="item in data">
                  <div class="value">{{ Object(item).tmin }}</div>
                </div>
              </div>
              <div>
                <div class="icon"><i class="fas fa-temperature-high"></i></div>
                <div v-for="item in data">
                  <div class="value">{{ Object(item).tmax }}</div>
                </div>
              </div>
              <div>
                <div class="icon"><i class="fas fa-sun"></i></div>
                <div v-for="item in data">
                  <div class="value">{{ Object(item).soleil }}</div>
                </div>
              </div>
              <div>
                <div class="icon"><i class="fas fa-cloud-rain"></i></div>
                <div v-for="item in data">
                  <div class="value">{{ Object(item).pluie }}</div>
                </div>
              </div>
              <div>
                <div class="icon"><i class="fas fa-wind"></i></div>
                <div v-for="item in data">
                  <div class="value">{{ Object(item).vent }}</div>
                </div>
              </div>
              <div>
                <div class="icon"><i class="fas fa-atom"></i></div>
                <div v-for="item in data">
                  <div class="value">{{ Object(item).cnpe }}</div>
                </div>
              </div>
              <div>
                <div class="icon"><i class="fas fa-home"></i></div>
                <div v-for="item in data">
                  <div class="value">{{ Object(item).prix }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>

    <div v-else>
      <!-- Taille de l'écran supérieure à 768px  -->
        <div class="my_grid">
          <div class="c-item-1">
            <span class="icon-text">
              <span class="icon"><i class="fas fa-city"></i></span>
              <span class="label">Site</span>
            </span>
            <div v-for="item in data">
              <div class="site">{{ Object(item).site }}</div>
            </div>
          </div>
          <div class="c-item-2">
            <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-thermometer-half"></i></span>
            <div v-for="item in data">
              <div class="value">{{ Object(item).tmoy }}</div>
            </div>
          </div>
          <div class="c-item-3">
            <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-temperature-low"></i></span>
            <div v-for="item in data">
              <div class="value">{{ Object(item).tmin }}</div>
            </div>
          </div>
          <div class="c-item-4">
            <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-temperature-high"></i></span>
            <div v-for="item in data">
              <div class="value">{{ Object(item).tmax }}</div>
            </div>
          </div>
          <div class="c-item-5">
            <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-sun"></i></span>
            <div v-for="item in data">
              <div class="value">{{ Object(item).soleil }}</div>
            </div>
          </div>
          <div class="c-item-6">
            <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-cloud-rain"></i></span>
            <div v-for="item in data">
              <div class="value">{{ Object(item).pluie }}</div>
            </div>
          </div>
          <div class="c-item-7">
            <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-wind"></i></span>
            <div v-for="item in data">
              <div class="value">{{ Object(item).vent }}</div>
            </div>
          </div>
          <div class="c-item-8">
            <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-atom"></i></span>
            <div v-for="item in data">
              <div class="value">{{ Object(item).cnpe }}</div>
            </div>
          </div>
          <div class="c-item-9">
            <span class="icon" :style="{ 'text-align': 'center' }"><i class="fas fa-home"></i></span>
            <div v-for="item in data">
              <div class="value">{{ Object(item).prix }}</div>
            </div>
          </div>
        </div>
    
    </div>

    </template>
          
    </Card>

    <div class="FlexWrapper">
        <Button class="ButtonSize p-button-success" :disabled="isFirstPage" @click="prev">&#8249</Button>
        <Button class="ButtonSize p-button-success" v-for="item in pageCount" :key="item" :disabled="currentPage === item" @click="currentPage = item">
        {{ item }}
        </Button>
        <Button class="ButtonSize p-button-success" :disabled="isLastPage" @click="next">&#8250</Button>
    </div>
  
  </div>
  
</template>

<style scoped>
.my_grid_mobile {
  display: grid;
  grid-template-columns: 250px 75px;
  grid-template-rows: 40px;
  
}
[class^="c-item-mobile"] {
  display: inline-grid;
  justify-content: right;
}
.c-item-mobile-1 {
  grid-column: 1;
  justify-content: left;
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
  height: 420px;
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
  line-height: 20px;
  font-size: 14px;
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
  padding: 15px 10px 0px 0px;
  text-align: left;
  color: #071621;
  text-overflow: ellipsis; /* Au cas où le nom du site est trop grand */
  display: -webkit-box;
  -webkit-line-clamp: 1; /* number of lines to show */
  -webkit-box-orient: vertical;
}
.value {
  height: 40px;
  padding: 15px 20px 0px 0px;
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
  margin-top: -6px;
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

.FlexWrapper {
  width: 100%;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: row;
  justify-content: end;
  margin: 10px 60px 40px 0px;
  gap: 5px;
}

.ButtonSize {
  height: 20px;
  width: 20px;
  font-size: 12px;
}
</style>
