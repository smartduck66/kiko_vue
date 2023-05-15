<script setup lang="ts">
import { ref } from "vue";

import TabMenu from "primevue/tabmenu";
const items = ref([
  {
    label: "Kikō",
    to: "/",
  },
  {
    label: "Changelog",
    to: "/changelog",
  },
  {
    label: "A propos",
    to: "/about",
  },
]);
</script>

<template>
  <TabMenu :model="items" :style="{ 'margin-bottom': '10px' }" />
  <router-view />
</template>

<style></style>
