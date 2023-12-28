<script setup lang="ts">
import Footer from "./Footer.vue";
import { RouterLink } from "vue-router";
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
      <li>Le premier bloc expose la station météo de référence (Trappes par défaut, modifiable pour la session)</li>
      <li>Le second permet de borner 4 critères principaux</li>
      <li>Le troisième autorise des recherches immédiates (saisie de plusieurs départements : les séparer par un ;)</li>
      <i>Seules les nappes aquifères toujours mesurées au 1er janvier de l'année n-1 sont affichées</i>
    </ul>
    <br />
    La recherche renvoie une liste de stations météo 'complètes' avec les données suivantes, sur une période comprise entre 1991 et 2020 : <br /><br />
    <ul>
      <li>Température moyenne (moyenne en °C)</li>
      <li>Température minimale (moyenne en °C)</li>
      <li>Température maximale (moyenne en °C)</li>
      <li>Nombre moyen de jours caniculaires (température maximale >= 30°C)</li>
      <li>Hauteur moyenne mensuelle de précipitations (mm/mois)</li>
      <li>Durée d'insolation (moyenne en heures/an)</li>
      <li>Nombre moyen de jours avec rafales de vent (vitesse >= 16 m/s, soit 58 km/h)</li>
      <li>Distance de la centrale nucléaire la plus proche (kilomètres, à vol d'oiseau)</li>
      <li>Prix moyen au m2 des maisons (calcul approximatif - vérifier plus finement sur seloger.com par exemple)</li>
    </ul>
    <br />
    Si la case 'Horizon 2050' est cochée, les prévisions climatiques issues de la DRIAS s'affichent (RPC 4.5* - Horizon H1 2021-2050)<br />
    Les données sont comparables, exceptée pour la colonne 'canicule' qui est comparée au nombre de nuits tropicales (temp > 20°C)<br />
    <i>* Scénario avec stabilisation des émissions avant la fin du XXIe siècle à un niveau faible</i>

    <br /><br />
    <h4>Source des données utilisées :</h4>
    <br />
    <ul>
      <li>Nombre de stations météo référencées : {{ store.fc.length }}</li>
      <li><a target="_blank" href="https://donneespubliques.meteofrance.fr" aria-label="Météo France">Statistiques en provenance de Météo France (MF)</a></li>
      <li><a target="_blank" href="https://www.drias-climat.fr/" aria-label="La DRIAS">Prévisions climatiques en provenance de la DRIAS</a></li>
      <li><a target="_blank" href="https://hubeau.eaufrance.fr/page/api-piezometrie#/" aria-label="Hub Eau">API Hub'Eau utilisée pour les mesures des nappes aquifères</a></li>
      <li>
        <a target="_blank" href="https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres" aria-label="Valeurs foncières"
          >Valeurs foncières complètes de l'année 2022</a
        >
      </li>
    </ul>
    <br />
    <br />
    <RouterLink to="/"><span class="Home"> > Retour à Kikō </span></RouterLink>
  </div>
  <Footer />
</template>

<style scoped>
a {
  outline: none;
  color: grey;
  text-decoration: none;
  padding: 2px 1px 0;
}

.Home {
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.33;
  letter-spacing: normal;
  text-align: left;
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
  padding-top: 20px;
}
</style>
