# Kikō (climat, en Japonais)

> **Cet outil permet de visualiser une sélection de données climatiques et environnementales**<br>
> Les sources de données proviennent de Météo France, la DRIAS, Hub'Eau et des Finances Publiques<br>
> Démonstrateur : [le site live](https://kiko.andretonic.fr/)<br>
> Framework utilisé : Vue 3<br>
> Derniers travaux : [le changelog](https://kiko.andretonic.fr/changelog)<br>

## Les fonctionnalités

L'application propose 4 fonctionnalités principales :
- **Recherche de stations** : ? 
- **Fiches d'un département** : ??
- **Nappes phréatiques d'un département** : ??
- **Risques d'une commune** : ??

Un clic sur une ligne du tableau affiché permet de visualiser la fiche climatique complète fournie par Météo France.

En sus, la case à cocher "horizon 2050" permet d'afficher les prévisions météo pour 5 indicateurs : Température moyenne, minimum et maximum, les jours de canicule et la pluviométrie.

A noter que la station météo de référence peut être modifiée grâce à l'icône "Crayon" situé en haut du cartouche.

## Description des répertoires principaux de l'application

- batch : contient ???<br>
    - *perf.mjs* (aucun paramètre à passer) : ce script calcule les indicateurs lighthouse des pages d'accueil des sites du CAC40 
    - *spot.mjs* (aucun paramètre à passer) : ce script lit le fichier sitemaps.txt qui doit contenir la ou les sitemaps des sites à auditer. Un fichier xml sans URL (ex : 3ds.xml) indique que la sitemap a été générée avec un crawler externe (du type Screaming Frog SEO spider) et est stockée dans le répertoire /sitemaps
- public : contient principalement les fichiers json statiques décrivant les valeurs à afficher
    - */data* : chaque fichier json correspond à une date précise et stocke les indicateurs Lighthouse des sites institutionnels du CAC40
    - */spot* : les 39 fichiers contiennent les valeurs moyennes des indicateurs Lighthouse, calculées sur 100 pages du site audité
- src : contient les sources de l'application
    - */assets* : images et scripts JS partagés
    - */components* : composants Vue
    - */router* : gestion du routage entre pages
    - */views* : écrans principaux

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

