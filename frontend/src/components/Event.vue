<template>

        <div v-if="updated_events.length === 0" class="container">
            <p id="no-events-text">No events</p>
        </div>
        <div v-else v-for="event in updated_events" class="event-container">
            <button @click="delete_event(event)" class="close-button">&#215;</button>
            <p>{{ event.start_time }}-{{ event.end_time }}</p>

            <p @click="$emit('content', {'errors' : event.errors, 'popup' : true, 'title' : event.title})"
                class="title">{{ event.title }}</p>

            <div id="tutor-div">
                <p v-if="event.tutor != ''">{{ event.tutor }}</p>
                <p v-else class="errors">No tutor</p>
            </div>
            <div v-if="event.errors != ''" v-for="error in Object.keys(extract_errors(event.errors))" class="errors-div">
                <p class="errors">{{ error }}</p>
            </div>
        </div>

</template>

<script setup>

import { ref, computed } from "vue";

const props = defineProps({
  events: Array
})

const updated_events = computed(() => {
    return props.events;
})

const delete_event = (event) => {
    for(let i = 0; i < props.events.length; ++i) {
        if (event.index == props.events[i].index) {
            props.events.splice(i, 1);
        }
    }
}

const extract_errors = (errors) => {
    let extracted = {};
    let keys = Object.keys(errors);

    for(let i = 0; i < keys.length; ++i) {
        if(keys[i] == "location") {
            let location_errors = errors[keys[i]];
            let location_keys = Object.keys(errors[keys[i]]);
            for(let n = 0; n < location_keys.length; ++n) {
                if(location_errors[location_keys[n]] != "") {
                    extracted[location_keys[n]] =location_errors[location_keys[n]];
                }
            }
        }
        else {
            if(errors[keys[i]] != "") {
                extracted[keys[i]] = errors[keys[i]];
            }
        }
    }
    return extracted;
}

</script>

<style scoped>

p {
    margin: 0;
    color: white;
}

.errors {
    color: red;
    font-family: "Noto Sans", sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-style: normal;
    font-size: 2rem;
}

.errors-div {
    color: white;
    border: 1px solid white;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
}

.title {
    width: 30vw;
    border: 1px solid white;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding-left: 0.5rem;
}

.close-button {

    font-size: 3rem;
    background-color: rgba(0, 0, 0, 0);
    color: white;
    border: 0;
    padding: 0;

}

.event-container {

    font-family: "Noto Sans", sans-serif;
    font-optical-sizing: auto;
    font-weight: 200;
    font-style: normal;
    font-size: 2rem;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;

}

#tutor-div {
    width: 12vw;
}

#no-events-text {
    font-size: 3rem;
}

</style>