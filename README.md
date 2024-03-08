# Kikō (climat, en Japonais)

> **Cet outil permet de visualiser une sélection de données climatiques et environnementales**<br>
> Les sources de données proviennent de Météo France, la DRIAS, Hub'Eau et des Finances Publiques<br>
> Démonstrateur : [le site live](https://kiko.andretonic.fr/)<br>
> Framework utilisé : Vue 3<br>
> Derniers travaux : [le changelog](https://kiko.andretonic.fr/changelog)<br>

## Les fonctionnalités

L'application propose 4 fonctionnalités principales :
- **Recherche de stations** : une fois les critères de saisis, la recherche renvoie une liste de stations météo pourvues de 9 indicateurs. Un clic sur une ligne du tableau affiché permet de visualiser la fiche climatique complète fournie par Météo France.
- **Fiches d'un département** : même fonctionnalité que ci-dessus, mais limitée à un seul département
- **Nappes phréatiques d'un département** : cette fois-ci, la liste des piézomètres d'un département est renvoyée avec 6 indicateurs. Un clic sur une ligne du tableau affiché permet de visualiser l'évolution du niveau de la nappe souterraine.
- **Risques d'une commune** : la centrale nucléaire ainsi que le site classé Seveso les plus proches de la commune choisie sont renvoyés

En sus, la case à cocher "horizon 2050" permet d'afficher les prévisions météo pour 5 indicateurs : Température moyenne, minimum et maximum, les jours de canicule et la pluviométrie.

A noter que la station météo de référence peut être modifiée grâce à l'icône "Crayon" situé en haut du cartouche. Une "gomme" située en haut du cartouche 'Sélection des stations météo' remet à zéro les valeurs prédéfinies des critères de recherche.

## Description des répertoires principaux de l'application

- batch : contient les 4 batchs décrits plus bas, écrits en TS (le script pipe_par.js les transforme en js)<br>
- functions : le fichier database.js contient la fonction *serverless* d'appel à la base de données fauna.db, qui stocke les quelques 40 000 communes françaises (utilisée par la fonctionnalité 'Risques d'une commune')<br>
- public : contient principalement les fichiers json statiques décrivant les valeurs à afficher
    - */drias* : les fichiers de prévision présents ont été construits manuellement pour certaines stations météo. En effet, contrairement aux données Météo France, ils ne sont pas aisément accessibles à date.
    - */ficheclim* : fiches cliamtiques issues des données rendues publiques par Météo France
- src : contient les sources de l'application
    - */assets* : fontes, images et scripts partagés
    - */components* : composants Vue
    - */data* : fichiers json nécessaires à l'application
    - */data_source* : données initiales récupérées manuellement (communes, liste des stations météo, sites Seveso, dernières valeurs foncières)

## Modules NPM nécessaires à l'application

- Types Babel : ```npm i -D @babel/types```
- Faunadb : npm install --save faunadb (DB en mode serverless)
- Vue Router : ```npm i vue-router@4```
- VueUse : ```npm i @vueuse/core``` (utilitaires)
- PrimeVue : ```npm i primevue``` (composants graphiques)
- AutoImport PrimeVue : ```npm i unplugin-vue-components -D``` (pour éviter les déclarations manuelles d'importation des composants)
- Vee-validate : npm i vee-validate --save (VeeValidate is the most popular Vue.js form library)
- Yup : npm install -S yup (Yup is a schema builder for runtime value parsing and validation)
- Pinia : ```npm i pinia``` (gestion des états)
- Sharp : ```npm install sharp``` (package utilisé dans le script webp.cjs pour transformer en masse les images png/jpg en webp)
- google-map : ```npm install vue3-google-map``` (package simplifiant l'utilisation de l'API Google Maps - Restricted APIkey in GoogleMaps Console)
- Type Google Maps : ```npm i -D @types/google.maps``` (obligatoire pour le build) - Réf : https://developers.google.com/maps/documentation/javascript/using-typescript
- eCharts : graphiques :  à remplacer par Charts
- vue-echarts : interface Apache echarts : à remplacer par Charts

## Traitements annuels nécessaires, à lancer du répertoire /batch. Une fois/an, lancer dans cet ordre :

- ```node csv_to_json```       : mise à jour du fichier ListeFichesClimatiques.json, basé sur Liste_stations_météo_complètes.txt construit à la main (des stations peuvent 'bouger')
- ```node kiko_init.js mf```   : chargement des données climatiques de Météo France (MF)
- ```node kiko_init.js immo``` : création du fichier prix_maisons_m2.json correspondant aux prix immobiliers des maisons
- ```node kiko_init.js clim``` : création du fichier des fiches climatiques (fc.json) à partir des données de Météo France

