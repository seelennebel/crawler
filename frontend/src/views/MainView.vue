<template>

  <NavBar @refresh="(date) => refresh(date)" @date-selection="(date) => {fetch_events(date)}" />

  <main>
    <div id="content-div">
      <Event :events="events" />
    </div>    
  </main>

</template>

<script setup>

import NavBar from "../components/NavBar.vue";
import Event from "../components/Event.vue"; 

import { ref, onMounted } from "vue";
import { RouterView } from "vue-router";

const events = ref([]);
const selected_date = ref("");

// used for ISO strings
const trim_time_string = (time_string) => {
  let new_string = "";
  for (let i = 0; i < 10; ++i) {
    new_string += time_string[i];
  }
  return new_string;
}

const refresh = (date) => {
  if(date == "") {
    fetch_events(trim_time_string(new Date().toISOString()));
  }
  else {
    fetch_events(date);
  }
}

const fetch_events = (date) => {
  const url = `${import.meta.env.APP_SERVER_URL}api/fetch_events_with_errors`;
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

const url = `${import.meta.env.APP_SERVER_URL}api/fetch_events_with_errors`;
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

<style scoped>

main {

  width: 100vw;
  height: fit-content;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  
}

#content-div {

  width: 80vw;
  height: fit-content;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

}

</style>