<script setup lang="ts">
import Footer from "./Footer.vue";
import { useStore } from "../assets/mixins/store.js";
const store = useStore();
</script>

<template>
  <div class="text">
    <h1> Données climatiques France & DOM-TOM</h1>
    <br /><br /><br />

    <h2>Kikō (climat, en japonais)</h2>
    <br />
    Cet outil permet de visualiser une sélection de données climatiques et environnementales :
    <br /><br />
    <ul>
      <li>Le premier bloc expose la station météo de référence</li>
      <li>Le second permet de borner 4 critères principaux</li>
      <li>Le troisième autorise des recherches immédiates</li>
    </ul>
    <br />
    La recherche renvoie une liste de stations météo 'complètes' avec les données suivantes, sur une période comprise entre 1994 et 2020 : <br /><br />
    <ul>
      <li>température moyenne</li>
      <li>température minimale</li>
      <li>température maximale</li>
      <li>ensoleillement</li>
      <li>précipitations</li>
      <li>rafales de vent</li>
      <li>distance de la centrale nucléaire la plus proche</li>
      <li>prix moyen au m2 des maisons</li>
    </ul>
    <br /><br />
    <h4>Source des données utilisées :</h4>
    <br />
    <ul>
      <li><a target="_blank" href="https://donneespubliques.meteofrance.fr" aria-label="Météo France">Statistiques en provenance de Météo France (MF)</a></li>
      <li>Nombre de stations météo référencées : {{ store.fc.length }}</li>
      <li>
        <a target="_blank" href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres" aria-label="Valeurs foncières"
          >Valeurs foncières de l'année 2022</a
        >
      </li>
      <li>Valeurs foncières de l'année 2022</li>
    </ul>
  </div>
  <Footer />
</template>

<style scoped>
a {
  outline: none;
  color: black;
  text-decoration: none;
  padding: 2px 1px 0;
}
.text {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 70px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 13px;
  font-weight: 300;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: left;
  color: black;
  padding-top: 50px;
}
</style>
