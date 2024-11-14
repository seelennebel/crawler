<template>
    <div id="popup-div">
       <div id="options-div">
            <div id="option-text" class="column-element">
                <h1 class="noto-sans-button">Select an option</h1>
            </div>
            <div id="parsing-options" class="column-element">
                <button ref="canvas-button" class="noto-sans-button">CANVAS</button>
                <button ref="schedule-button" class="noto-sans-button">SCHEDULE</button>
            </div>
            <div id="generate-div">
                <button class="noto-sans-button">GENERATE</button>
            </div>
            <div id="download-div" class="column-element">
                <button class="noto-sans-button">download</button>
            </div>
       </div> 
    </div>
</template>

<script setup>

import { ref } from "vue";

const selected_option = ref("")

</script>

<style scoped>

.column-element {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

#download-div {
    width: 100%;
    height: fit-content;
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
    height: 60vh;
    width: 70vw;
    background-color: white;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

</style>