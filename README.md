# Cette nouvelle version de kiko s'appuie sur Vue 3 + Typescript + Vite

# Derniers travaux :

01/08/2022 - Ré-Initialisation après 6 mois de pose
30/08/2022 - MAJ modules NPM à part TS qui doit rester en 4.7.4 à cause d'une incomptabilité avec la nouvelle version de Vue 3.2.38
02/09/2022 - corriger absolument l'erreur de "distances" qui empêche le Build <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

---

Nouvelle extension IDE VSCODE installée : Volar
Pour formater un document rapidement via l'extension prettier, la commande de touches ALT + F est configurée

Pour mettre à jour les modules NPM :
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
. http://localhost:5000 pour tester en local
. git add -A
. git commit -m "new fonctions"
. git push
. Netlify le publie automatiquement en production sur https://musing-ptolemy-db8901.netlify.app/

---

Installations de modules NPM complémentaires :

- Types Babel : npm i -D @babel/types
- VueUse : npm i @vueuse/core (utilitaires)
- Librairie de composants graphiques reste à choisir

---

Recommandation : passer le site en production au "checker" HTML régulièrement -> https://validator.w3.org/
