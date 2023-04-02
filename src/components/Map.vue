<script setup lang="ts">
import { GoogleMap, Marker, MarkerCluster } from "vue3-google-map";
import { results } from "../assets/mixins/types";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
const props = defineProps(["markers"]);

// Centre de la France
const center = { lat: 46.227638, lng: 2.213749 };

// Dimensions de la carte en fonction de la taille de l'écran
const dimension_map = store.sm ? 'width: 100%; height: 500px' : 'width: 100%; height: 1000px';
const zoom_map = store.sm ? 5 : 7;

class coords {
  lat: number;
  lng: number;

  constructor() {
    this.lat = 0;
    this.lng = 0;
  }
}

// Contruction des 'markers' à afficher sur la carte qui sont en fait les coordonnées des stations météo affichées dans les résultats de recherche
const locations = props.markers.map((item: results) => {
  const s = new coords(); // note the "new" keyword here
  s.lat = item.lat;
  s.lng = item.long;

  return s;
});
</script>

<template>
  <GoogleMap api-key="AIzaSyBs8dFKJpbnpPksN0ihjzG_Udlhtt3F7TY" :style="dimension_map" :center="center" :zoom=zoom_map>
    <MarkerCluster>
      <Marker v-for="(location, i) in locations" :options="{ position: location }" :key="i" />
    </MarkerCluster>
  </GoogleMap>
</template>

<style scoped></style>
