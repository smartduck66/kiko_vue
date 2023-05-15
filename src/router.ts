import { createRouter, createWebHistory } from "vue-router";
import Home from "./components/Accueil.vue";
import Changelog from "./components/Changelog.vue";
import About from "./components/Apropos.vue";


export const router = createRouter({
history: createWebHistory(),
routes: [ { path: "/", component: Home },
{ path: "/changelog", component: Changelog },
{ path: "/about", component: About },
]
});