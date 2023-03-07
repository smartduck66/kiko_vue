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
      <span class="titre">Kikō</span>
      <div class="my_grid">
        <div class="c-item-1">
          <span class="sous-titre">Données climatiques France & DOM-TOM</span>
        </div>
        <div class="c-item-1">
          <button class="CTA" @click="open = true">A propos</button>
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
        <b>Kikō (climat, en japonais)</b>
        Cet outil permet de visualiser une sélection de données climatiques et environnementales :
        <br /><br />
        . Le premier bloc inclut les références de Trappes (78)<br />
        . Le second permet de borner 4 critères principaux<br />
        . Le troisième autorise des recherches immédiates<br />
        <br />
        <i>Source des données utilisées :</i>
        <div>
          <a target="_blank" href="https://donneespubliques.meteofrance.fr" aria-label="Météo France">. Statistiques Météo France 1991-2020</a>
          <br />
          <a target="_blank" href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres" aria-label="Valeurs foncières"
            >. Valeurs foncières du S1/2022</a
          >
          <br />
          <a target="_blank" href="https://public.opendatasoft.com/explore/dataset/sites-seveso/table" aria-label="Météo France">. Sites Seveso</a>
        </div>
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
  font-size: 24px;
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
  font-size: 18px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: grey;
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
  top: 15%;
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

.FlexWrapper_modal {
  width: 300px;
  height: 490px;
  flex-grow: 0;
  display: flex;
  gap: 20px;
  margin: 0px 0px 0px 20px;
  flex-direction: column;
  justify-content: flex-start;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.5;
  letter-spacing: normal;
  text-align: left;
}

.CTA {
  background-color: transparent;
  background-repeat: no-repeat;
  width: 120px;
  height: 30px;
  margin: 10px 20px 0 0;
  padding: 2px 10px 0;
  border-radius: 24px;
  border: none;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  text-align: center;
  color: white;
  background-color: #42b983;
  margin-top: 32px;
}
</style>
