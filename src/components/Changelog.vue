<script setup lang="ts">
import Footer from "./Footer.vue";
</script>

<template>
  <div class="text">
    <h4>Mai 2023</h4>
    <ul>
      <li>Menu et routage</li>
    </ul>
    <br />
    <h4>Avril 2023</h4>
    <ul>
      <li>Implémentation de l'API Google Maps pour afficher les stations météo affichées dans les résultats</li>
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
  padding-top: 50px;
}
</style>
