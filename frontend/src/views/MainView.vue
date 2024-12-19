<template>

<div id="main" ref="main-div" @keyup.esc="hide">
  <Popup @show-popup="(status) => popup=status" :date="selected_date" :content="popup_content" :mode="component_mode" :events="events" v-if="popup" />

  <div id="main-div">

    <NavBar id="navbar"
      @show-popup="(status) => show_popup(status, 'download')"
      @refresh="(date) => {refresh(date); selected_date = date}"
      @date-selection="(date) => {fetch_events(date); selected_date = date}" />

    <div id="content-div">
      <Event @content="(content) => { popup_content = { 'errors' : content.errors, 'title' : content.title }; show_popup(content.popup, 'event') }" :events="events" />
    </div>    
  </div id="main-div">
</div>

</template>

<script setup>

import NavBar from "../components/NavBar.vue";
import Event from "../components/Event.vue"; 
import Popup from "../components/Popup.vue";

import { ref, onMounted, useTemplateRef } from "vue";
import { RouterView } from "vue-router";

const events = ref([]);
const selected_date = ref("");
const popup = ref(false);
const main_div = useTemplateRef("main-div");
const popup_content = ref();
const component_mode = ref("");

// hides the popup component with the ESC key
const hide = () => {
  popup.value = false;
}

const show_popup = (status, mode) => {
  main_div.value.style.overflowY = "";
  popup.value = status;
  component_mode.value = mode;
}

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
selected_date.value = trim_time_string(new Date().toISOString())
const url = `${import.meta.env.APP_SERVER_URL}api/fetch_events_with_errors`;
const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ date: selected_date.value })
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

#main {
  overflow-y: scroll;
  height: 100vh;
  width: 100vw;
}

#main-div {

  width: 100vw;
  height: fit-content;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  z-index: 0;
}

#navbar {
  z-index: 0;
}

#content-div {

  width: 80vw;
  height: fit-content;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

</style>