<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
const router = useRouter();

const props = defineProps(["date_maj"]);

const selectedOption = ref();
const optionsMenu = ref([{ name: "Changelog" }, { name: "A propos" }]);

function menu() {
  switch (selectedOption.value.name) {
    case "Changelog":
      router.push("/changelog");
      break;
    case "A propos":
      router.push("/about");
      break;
    default:
      break;
  }
}

function RAZ_occurences() {
  store.nb_occurences = 0;  // On réinitialise le nombre d'occurences de recherche pour forcer l'usager à relancer une recherche sinon les colonnes du tableau ne sont pas les bonnes
}
</script>

<template>
  <div v-bind:class="{ FlexWrapperMobile: store.sm, FlexWrapper: !store.sm }">
    <img v-if="!store.sm" src="/img/fuji.webp" alt="Mont Fuji" />
    <div>
      <span class="titre">Kikō</span>
      <div class="my_grid">
        <div class="c-item-1">
          <span class="sous-titre">Données climatiques France & DOM-TOM (1991-2020), mises à jour le {{ $props.date_maj }}</span>
        </div>
        <div class="FlexWrapper_choix">
          <Dropdown class="menu" v-model="selectedOption" :options="optionsMenu" optionLabel="name" placeholder="v2.01o" @update:modelValue="menu" />
          <Checkbox class="menu2" v-model="store.drias_checked" inputId="drias" :binary="true" @update:modelValue="RAZ_occurences" />
          <label for="drias" class="label"> Horizon 2050 </label>
        </div>
      </div>
    </div>
  </div>
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
  align-items: start;
  gap: 30px;
  margin-bottom: 20px;
}

.FlexWrapperMobile {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  gap: 10px;
  margin-bottom: 20px;
}

.FlexWrapper_choix {
  width: auto;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-start;
  align-items: start;
  gap: 40px;
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

.label {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: red;
  margin-top: 45px;
  margin-left: -30px;
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

.menu {
  background-color: transparent;
  background-repeat: no-repeat;
  width: 110px;
  height: 30px;
  border-radius: 24px;
  border: 1px solid;
  color: lightgray;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.8;
  letter-spacing: normal;
  text-align: center;
  margin-top: 35px;
  padding-top: 0.5em;
}

.menu2 {
  background-color: transparent;
  background-repeat: no-repeat;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 0.8;
  letter-spacing: normal;
  text-align: center;
  margin-top: 35px;
  padding-top: 0.5em;
}
</style>
