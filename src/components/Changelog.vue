<script setup lang="ts">
import Footer from "./Footer.vue";
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="text">
    <h1>Changelog de Kikō</h1>
    <br />
    <br />
    <h4>Septembre 2024</h4>
    <ul>
      <li>Implémentation des composants graphiques PrimeVue v4</li>
    </ul>
    <br />
    <h4>Avril 2024</h4>
    <ul>
      <li>Optimisation des batchs, mise à jour des données climatiques</li>
    </ul>
    <br />
    <h4>Mars 2024</h4>
    <ul>
      <li>Passage de l'application en Open Source, licence MIT</li>
    </ul>
    <br />
    <h4>Décembre 2023</h4>
    <ul>
      <li>Intégration des prévisions climatiques issues de la DRIAS et des mesures de nappes aquifères (+ graphique d'évolution)</li>
      <li>Affichage de la fiche climatique complète en sélectionnant une station spécifique des résultats d'une recherche</li>
      <li>Saisie multiple de départements</li>
      <li>Mise à jour des librairies utilisées par le projet et des données climatiques</li>
    </ul>
    <br />
    <h4>Mai 2023</h4>
    <ul>
      <li>Menu et routage</li>
      <li>Pouvoir réinitialiser les filtres de sélection des stations</li>
    </ul>
    <br />
    <h4>Avril 2023</h4>
    <ul>
      <li>Implémentation de l'API Google Maps pour afficher les stations météo affichées dans les résultats (spike)</li>
      <li>Réécriture de Results.vue autour du composant DataTable de PrimeVue</li>
    </ul>
    <br />
    <h4>Mars 2023</h4>
    <ul>
      <li>Création d'un répertoire 'batch' dédié pour les traitements annuels : fc, immo, clim</li>
      <li>MEL sous https://kiko.andretonic.fr</li>
      <li>Reprise des travaux en vue de finaliser une version Beta plus aboutie au cours du S1/2023</li>
      <li>Pouvoir changer sa station de référence pour la session en cours</li>
    </ul>
    <br />
    <h4>S2/2022</h4>
    <ul>
      <li>1ère version alpha avec l'ensemble des fonctionnalités de kiko_web (v1)</li>
      <li>Finalisation serverless function qui masque le secret 'faunadb', saisi d'une manière sécurisée dans la console netlify (variable d'environnement)</li>
      <li>Réécriture de l'interface de saisie avec les composants PrimeVue</li>
      <li>Début de programmation fonctionnelle sur les modules batch</li>
      <li>MAJ modules NPM à part TS qui doit rester en 4.7.4 à cause d'une incompatibilité avec la nouvelle version de Vue 3.2.38</li>
      <li>Ré-Initialisation du projet après 6 mois de pose</li>
    </ul>
    <br />
    <br />
    <RouterLink to="/"><span class="Home"> > Retour à Kikō </span></RouterLink>
  </div>
  <Footer />
</template>

<style scoped>
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
</style>
