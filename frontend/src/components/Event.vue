<template>

        <div v-if="updated_events.length === 0" class="container">
            <p>No events</p>
        </div>
        <div v-else v-for="event in updated_events" class="event-container">
            <button class="close-button">&#215;</button>
            <p>{{ event.start_time }}-{{ event.end_time }}</p>
            <p class="title">{{ event.title }}</p>
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

</script>

<style scoped>

p {

    margin: 0;
    color: white;

}

.title {

    width: 35vw;

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

</style>