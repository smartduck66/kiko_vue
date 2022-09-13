<script setup lang="ts">
import { ref } from "vue";
import Panel from "primevue/panel";
import { Form, Field } from "vee-validate";
import * as Yup from "yup";

// Définition des valeurs par défaut des critères de sélection des sites climatiques
const min_temp = ref(10);
const max_temp = ref(20);
const min_soleil = ref(1700);
const max_soleil = ref(2200);
const min_pluie = ref(600);
const max_pluie = ref(900);
const min_vent = ref(0);
const max_vent = ref(50);

function onSubmit(values: any) {
  alert(JSON.stringify(values, null, 2));
}

function onInvalidSubmit() {
  const submitBtn = document.querySelector(".submit-btn");
  submitBtn!.classList.add("invalid");
  setTimeout(() => {
    submitBtn!.classList.remove("invalid");
  }, 1000);
}

// Using yup to generate a validation schema
// https://vee-validate.logaretm.com/v4/guide/validation#validation-schemas-with-yup
const schema = Yup.object().shape({
  min_temp: Yup.number().max(40).positive().integer(),
  max_temp: Yup.number().max(40).positive().integer(),
  min_soleil: Yup.number().max(4000).positive().integer(),
  max_soleil: Yup.number().max(4000).positive().integer(),
  min_pluie: Yup.number().max(2000).positive().integer(),
  max_pluie: Yup.number().max(2000).positive().integer(),
  min_vent: Yup.number().min(0).max(999).integer(),
  max_vent: Yup.number().max(999).positive().integer(),
});
</script>

<template>
  <Panel header="Critères de sélection des sites">
    <Form @submit="onSubmit" :validation-schema="schema" @invalid-submit="onInvalidSubmit">
      <div class="my_grid">
        <div class="c-item-1">
          <span>--------------------------</span>
          <span>Température moyenne :</span>
          <span>Durée d'insolation :</span>
          <span>Précipitations :</span>
          <span>Nb jours avec rafales :</span>
        </div>
        <div class="c-item-2">
          <span><b>min</b></span>
          <Field name="min_temp" class="saisie-valeur" type="text" v-model="min_temp" maxlength="2" />
          <Field name="min_soleil" class="saisie-valeur" type="text" v-model="min_soleil" maxlength="4" />
          <Field name="min_pluie" class="saisie-valeur" type="text" v-model="min_pluie" maxlength="4" />
          <Field name="min_vent" class="saisie-valeur" type="text" v-model="min_vent" maxlength="3" />
        </div>
        <div class="c-item-3">
          <span><b>max</b></span>
          <Field name="max_temp" class="saisie-valeur" type="text" v-model="max_temp" maxlength="2" />
          <Field name="max_soleil" class="saisie-valeur" type="text" v-model="max_soleil" maxlength="4" />
          <Field name="max_pluie" class="saisie-valeur" type="text" v-model="max_pluie" maxlength="4" />
          <Field name="max_vent" class="saisie-valeur" type="text" v-model="max_vent" maxlength="3" />
        </div>
      </div>
      <button class="submit-btn" type="submit">Rechercher</button>
    </Form>
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

.my_grid {
  display: grid;
  grid-template-columns: 60% 20% 20%;
  grid-template-rows: 250px;
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
  text-align: right;
}
.c-item-3 {
  grid-column: 3;
  justify-content: right;
  text-align: right;
}

.saisie-valeur {
  width: 60px;
  height: 25px;
  border: solid 1px #f7f8fa;
  background-color: #ffffff;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.17;
  letter-spacing: normal;
  text-align: right;
  padding: 8px 5px;
}

.submit-btn {
  background: var(--primary-color);
  outline: none;
  border: none;
  color: #fff;
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  width: 120px;
  border-radius: 7px;
  margin-top: 10px;
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
}

.submit-btn.invalid {
  animation: shake 0.5s;
  /* When the animation is finished, start again */
  animation-iteration-count: infinite;
}

@keyframes shake {
  0% {
    transform: translate(1px, 1px);
  }
  10% {
    transform: translate(-1px, -2px);
  }
  20% {
    transform: translate(-3px, 0px);
  }
  30% {
    transform: translate(3px, 2px);
  }
  40% {
    transform: translate(1px, -1px);
  }
  50% {
    transform: translate(-1px, 2px);
  }
  60% {
    transform: translate(-3px, 1px);
  }
  70% {
    transform: translate(3px, 1px);
  }
  80% {
    transform: translate(-1px, -1px);
  }
  90% {
    transform: translate(1px, 2px);
  }
  100% {
    transform: translate(1px, -2px);
  }
}

.submit-btn:hover {
  transform: scale(1.1);
}
</style>
