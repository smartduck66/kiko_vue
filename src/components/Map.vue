<script setup lang="ts">
/* Décembre 2023 : mis de côté car peu d'utilité ergonomique 
import { GoogleMap, Marker, MarkerCluster} from "vue3-google-map";
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


// Distance en train entre deux points (75056 correspond à la gare Montparnasse)
// https://api.sncf.com/v1/coverage/sncf/journeys?from=admin:fr:75056&to=admin:fr:35281&datetime=20230502&count=7&max_nb_transfers=1

// Distance en voiture entre deux points géographiques (la création d'un objet ne fonctionne qu'en chargeant un script google -> Doublon avec vue3-google-map)

let service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [{lat: 55.93, lng: -3.118}, 'Greenwich, England'],
  destinations: ['Stockholm, Sweden', {lat: 50.087, lng: 14.421}],
  travelMode: google.maps.TravelMode['DRIVING'],
  drivingOptions: {
    departureTime: new Date(Date.now()),  // for the time N milliseconds from now.
    trafficModel: google.maps.TrafficModel['OPTIMISTIC']
  }
}, callback);

function callback(response:any, status:any) {
  // See Parsing the Results for
  // the basics of a callback function.
  if (status == 'OK') {
    let origins = response.originAddresses;
    let destinations = response.destinationAddresses;

    for (let i = 0; i < origins.length; i++) {
      let results = response.rows[i].elements;
      for (let j = 0; j < results.length; j++) {
        let element = results[j];
        let distance = element.distance.text;
        let duration = element.duration.text;
        let from = origins[i];
        let to = destinations[j];
      }
    }
  }

}


</script>

<template>
  <GoogleMap api-key="" :style="dimension_map" :center="center" :zoom=zoom_map>
    <MarkerCluster>
      <Marker v-for="(location, i) in locations" :options="{ position: location }" :key="i" />
    </MarkerCluster>
  </GoogleMap>
</template>
*/
<style scoped></style>
