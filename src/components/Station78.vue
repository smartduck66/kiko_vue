<script setup lang="ts">
defineProps<{ valeur_ref: string[] }>();
</script>

<template>
  <h4>{{ valeur_ref[0] }}</h4>

  <p>
    <span class="icon-text">
      <span class="icon">
        <i class="fas fa-thermometer-half"></i>
      </span>
      <span id="tmoy"></span>
      {{ valeur_ref[1] }}
    </span>
  </p>
  <p>
    <span class="icon-text">
      <span class="icon">
        <i class="fas fa-temperature-low"></i>
      </span>
      <span id="tmin"></span>
      {{ valeur_ref[2] }}
    </span>
  </p>
  <p>
    <span class="icon-text">
      <span class="icon">
        <i class="fas fa-temperature-high"></i>
      </span>
      <span id="tmax"></span>
      {{ valeur_ref[3] }}
    </span>
  </p>
  <p>
    <span class="icon-text">
      <span class="icon">
        <i class="fas fa-atom"></i>
      </span>
      <span id="cnpe"></span>
      {{ valeur_ref[4] }}
    </span>
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
