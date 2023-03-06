<script setup lang="ts">
import { ref } from "vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
const open = ref(false); //gestion de la fenêtre modale des sources de données
</script>

<template>
  <div v-bind:class="{ FlexWrapperMobile: store.sm, FlexWrapper: !store.sm }">
    <img src="/img/fuji.webp" alt="Mont Fuji" />
    <div>
      <span class="titre">KIKO</span>
      <div class="my_grid">
        <div class="c-item-1">
          <span class="sous-titre">Visualisation de données climatiques</span>
        </div>
        <div class="c-item-1">
          <a class="sous-titre" @click="open = true">Sources des données</a>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="body">
    <div v-if="open" class="modal">
      <div @click="open = false">
        <img src="../assets/img/close.png" class="Close" />
      </div>
      <div class="FlexWrapper_modal">
        Vous pouvez accéder à chaque source de données utilisée dans KIKO, en cliquant sur l'un des liens suivants :
        <a target="_blank" href="https://donneespubliques.meteofrance.fr" aria-label="Météo France">Statistiques Météo France entre 1991 et 2020 (records inclus)</a>
        <a target="_blank" href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres" aria-label="Valeurs foncières">Valeurs foncières mises à jour en S1/2022</a>
        <a target="_blank" href="https://public.opendatasoft.com/explore/dataset/sites-seveso/table" aria-label="Météo France">Sites Seveso</a>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
a {
  outline: none;
  color: white;
  text-decoration: none;
  padding: 2px 1px 0;
}
.FlexWrapper {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: left;
  gap: 10px;
  margin-bottom: 20px;
}

.FlexWrapperMobile {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  gap: 10px;
  margin-bottom: 20px;
}

.titre {
  font-size: 20px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #42b983;
}
.sous-titre {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: grey;
  margin-left: 6px;
}

.my_grid {
  display: grid;
  grid-template-columns: auto;
  grid-template-rows: auto;
}

[class^="c-item"] {
  display: inline-grid;
}

.c-item-1 {
  grid-column: 1;
  justify-content: left;
  margin-top: 5px;
}

.modal {
  position: fixed;
  z-index: 999;
  top: 10%;
  left: 41.5%;
  margin-left: -150px;
  width: 360px;
  height: 360px;
  flex-grow: 0;
  border-radius: 10px;
  background-color: #42b983;
}

img.Close {
  width: 32px;
  height: 32px;
  flex-grow: 0;
  margin: 16px 0px 2px 310px;
  object-fit: contain;
}

img.Eye {
  width: 24px;
  height: 24px;
  flex-grow: 0;
  margin: 17px 0 17px 153px;
  object-fit: contain;
}
.FlexWrapper_modal {
  width: 300px;
  height: 470px;
  flex-grow: 0;
  display: flex;
  gap: 20px;
  margin: 20px 0px 0px 32px;
  flex-direction: column;
  justify-content: flex-start;
  color: #eee;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: center;
}
</style>
