# Cette nouvelle version de kiko (v2) s'appuie sur Vue 3 + Typescript + Vite
# Derniers travaux : voir changelog.vue

---

Nouvelle extension IDE VSCODE installée : Volar
Pour formater un document rapidement via l'extension prettier, la commande de touches ALT + F est configurée

Pour mettre à jour les modules NPM (npm uninstall 'module' pour la désinstallation) :
. npm install npm@latest -g (dernière version NPM)
. npm -g upgrade typescript (update typescript)
. npx npm-check-updates -u (vérification des modules à migrer)
. npm install (migration)
. npm list vue (check dernière version de vue, par exemple)

Pour créer son squelette d'application TS :
. npm create vite@latest bel_vue -- --template vue-ts

Pour développer et tester en local :
. npm run dev
. http://localhost:5173 lance le vite dev server (on bénéficie immédiatement du HMR, Hot Module Reload)

Pour construire le site statique (->dist) qui sera publié sur Netlify :
. npm run build
. npm run preview
. http://localhost:4173 pour tester en local
. git add -A
. git commit -m "new fonctions"
. git push
. Netlify le publie automatiquement en production sur https://musing-ptolemy-db8901.netlify.app/

---

Installations de modules NPM complémentaires :

- Types Babel : npm i -D @babel/types
- Faunadb : npm install --save faunadb (DB en mode serverless)
- Vue Router : npm install vue-router@4
- VueUse : npm i @vueuse/core (utilitaires)
- PrimeVue : npm i primevue (composants graphiques)
- Vee-validate : npm i vee-validate --save (VeeValidate is the most popular Vue.js form library. It takes care of value tracking, validation, errors, submissions and more.)
- Yup : npm install -S yup (Yup is a schema builder for runtime value parsing and validation)
- Pinia : npm install pinia (gestion des états)
- Sharp : npm install sharp (package utilisé dans le script webp.cjs pour transformer en masse les images png/jpg en webp)
- google-map : npm install vue3-google-map (package simplifiant l'utilisation de l'API Google Maps - Restricted APIkey in GoogleMaps Console)
- Type Google Maps : npm i -D @types/google.maps (obligatoire pour le build) - Réf : https://developers.google.com/maps/documentation/javascript/using-typescript
- eCharts : graphiques
- vue-echarts : interface Apache echarts

---

Recommandation : passer le site en production au "checker" HTML régulièrement -> https://validator.w3.org/
Alerte : netlify cli a été désinstallé car il induit des problèmes de sécurité dans les packages NPM au 30/9/2022

---

Traitements annuels nécessaires, à lancer du répertoire /batch. Une fois/an, lancer dans cet ordre :
. node csv_to_json       : mise à jour du fichier ListeFichesClimatiques.json, basé sur Liste_stations_météo_complètes.txt construit à la main (des stations peuvent 'bouger')
. node kiko_init.js mf   : chargement des données climatiques de Météo France (MF)
. node kiko_init.js immo : création du fichier prix_maisons_m2.json correspondant aux prix immobiliers des maisons
. node kiko_init.js clim : création du fichier fc.json à partir des données climatiques de Météo France
