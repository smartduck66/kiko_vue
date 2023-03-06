<script setup lang="ts">
import { useStore } from "../assets/mixins/store.js";
const store = useStore();

</script>

<template>
      <img src="/img/fuji.webp" alt="Mont Fuji" v-bind:class="{ Image_masthead_mobile: store.sm,Image_masthead: !store.sm }" />
</template>

<style scoped>
.Image_masthead {
  width: 800px;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-start;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}

.Image_masthead_mobile {
  width: 350px;
  height: auto;
  flex-grow: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  justify-content: flex-start;
  justify-content: center;
  margin-bottom: 20px;
  padding-right: 20px;
}
</style>

