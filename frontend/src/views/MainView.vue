<template>

  <NavBar @date-selection="(date) => fetch_events(date)" />

</template>

<script setup>

import NavBar from "../components/NavBar.vue";

import { ref, onMounted } from "vue";
import { RouterView } from "vue-router";

const current_date = ref("");
//const selected_date = ref("");
const events = ref([]);

// used for ISO strings
const trim_time_string = (time_string) => {
  let new_string = "";
  for (let i = 0; i < 10; ++i) {
    new_string += time_string[i];
  }
  return new_string;
}

current_date.value = trim_time_string(new Date().toISOString())

const fetch_events = (date) => {
  const url = `${process.env.VUE_APP_SERVER_URL}api/fetch_events_with_errors`;
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ date : date })
  };

  fetch(url, options)
    .then(res => res.json())
    .then(json => {
      events.value = json.events
    })
    .catch(error => console.log(error));
}

onMounted(() => {

const url = `${process.env.VUE_APP_SERVER_URL}api/fetch_events_with_errors`;
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ date: trim_time_string(new Date().toISOString()) })
};

fetch(url, options)
  .then(res => res.json())
  .then(json => {
    events.value = json.events
  })
  .catch(error => console.log(error));

})

</script>

<style scoped></style>