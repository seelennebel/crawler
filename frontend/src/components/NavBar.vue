<template>

  <div id="navbar">
    <div id="left-group">
      <h1 id="logo" class="noto-sans-logo">Crawler</h1>
    </div>
    <div id="right-group">
      <button class="noto-sans-button" id="download-button">download</button>
      <input @input="$emit('date-selection', selected_date)" v-model="selected_date" class="noto-sans-button" type="date" placeholder="search" />
      <button @click="$emit('refresh', selected_date)" class="noto-sans-button" id="refresh-button">&#8635;</button>
    </div>
  </div>

</template>

<script setup>

import { ref } from "vue";

const selected_date = ref("")

</script>

<style scoped>

button {
  margin: 0;
  height: fit-content;
  width: fit-content;
  margin-left: 2vw;
  margin-right: 2vw;
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  color: white;

}

#download-button {

  margin-left: 0;
  padding-left: 0;
}

#refresh-button {

  font-size: 3rem;
  margin-right: 0;
  padding-right: 0;
}

#left-group {

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  height: fit-content;

}

#navbar {

  width: 100vw;
  height: 17vh;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 20vw;
  align-items: center;

}

#logo {

  color: white;
  margin: 0;

}

</style>
