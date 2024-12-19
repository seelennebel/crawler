<template>
    <div id="popup-div">
        <div v-if="props.mode == 'download'" class="options-div">
            <div id="close-button-div">
                <button @click="$emit('show-popup', false)" id="close-button">&#215;</button>
            </div>
           <div id="selection-div">
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
                    <p class="noto-sans-button">{{ filename }}</p>
                </div>
                <div id="download-div" class="column-element">
                    <a ref="download_button" class="noto-sans-button">DOWNLOAD</a>
                </div>
           </div> 
        </div>
        <div v-else id="errors-div">
            <div id="close-button-div">
                <button @click="$emit('show-popup', false)" id="close-button">&#215;</button>
            </div>
            <div id="margin-div">
                <h1 class="noto-sans-button" id="title">{{ props.content.title }}</h1>
                <div v-if="props.content.errors != ''">
                    <h2 class="noto-sans-button" v-if="props.content.errors.location.room_name !='' || props.content.errors.location.reservation != ''">Location errors: </h2>
                    <ul class="noto-sans-button">
                        <li v-if="props.content.errors.location.room_name != ''">Room name: {{ props.content.errors.location.room_name }}</li>
                        <li v-if="props.content.errors.location.reservation != ''">Room reservation: {{ props.content.errors.location.reservation }}</li>
                    </ul>
                    <h2 class="noto-sans-button" v-if="props.content.errors.tutor != ''">Tutor: {{ props.content.errors.tutor }}</h2>
                    <h2 class="noto-sans-button" v-if="props.content.errors.link != ''">Virtual classroom link: {{ props.content.errors.link}}</h2>
                </div>
                <div v-else>
                    <h2 class="noto-sans-button">No errors</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, defineProps, useTemplateRef } from "vue";

const props = defineProps({
    date: Number,
    content: Object,
    mode: String,
    events: Array
});

const selected_option = ref("")
const canvas_option = ref("CANVAS");
const schedule_option = ref("SCHEDULE");
const filename = ref("");

const download_button = useTemplateRef("download_button");

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
        body: JSON.stringify({ date: props.date, option: selected_option.value, events: props.events })
    }
    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            filename.value=json;
            download_button.value.setAttribute("href", `${import.meta.env.APP_SERVER_URL}api/${filename.value}`);
        })
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

#close-button-div {
    position: relative;
    width: 100%;
    height: fit-content;
    text-align: right;
}

#close-button {
    text-align: right;
    margin-right: 2rem;
    margin-top: 2rem;
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

#selection-div {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-around;
    height: 80%;
}

.options-div {
    position: relative;
    height: 30rem;
    width: 40rem;
    background-color: white;
}

#errors-div {
    position: relative;
    height: 40rem;
    width: 60rem;
    background-color: white;
}

#margin-div {
    margin-left: 2rem;
}

#title {
    font-size: 3rem;
}

</style>