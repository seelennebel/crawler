<template>
    <div id="popup-div" @keyup.esc="popup=false">
       <div id="options-div">
            <div id="option-text" class="column-element">
                <h1 class="noto-sans-button">SELECT AN OPTION</h1>
            </div>
            <div id="parsing-options" class="column-element">
                <button @click="select_option(canvas_option)" ref="canvas-button" class="noto-sans-button">{{ canvas_option }}</button>
                <button @click="select_option(schedule_option)" ref="schedule-button" class="noto-sans-button">{{ schedule_option }}</button>
                <h1 id="selected-option" class="noto-sans-button">{{ selected_option }}</h1>
            </div>
            <div id="generate-div" class="column-element">
                <button @click="generate_file" class="noto-sans-button">GENERATE</button>
            </div>
            <div id="download-div" class="column-element">
                <button class="noto-sans-button">DOWNLOAD</button>
            </div>
       </div> 
    </div>
</template>

<script setup>

import { ref, defineProps } from "vue";

const props = defineProps({
    date: Number
});

const selected_option = ref("")
const canvas_option = ref("CANVAS");
const schedule_option = ref("SCHEDULE");

const select_option = (option) => {
    selected_option.value = option;
}

const generate_file = () => {
    const url = `${import.meta.env.APP_SERVER_URL}api/download_file`;
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ date: props.date })
    }
    fetch(url, options)
}

</script>

<style scoped>

.column-element {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: fit-content;
    margin-left: 2rem;
}

#selected-option {
    margin-left: 2rem;
    margin-top: 0;
    margin-bottom: 0;
}

#popup-div {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
    position: absolute;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
}

#options-div {
    height: 40vh;
    width: 30vw;
    background-color: white;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

</style>