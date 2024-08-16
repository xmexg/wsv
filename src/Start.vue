<script setup>
import { onMounted } from 'vue';
import 'pagepiling.js';
import 'pagepiling.js/dist/jquery.pagepiling.css';
import 'animate.css';

import PageOne from './components/Start_Pages/PageOne.vue';
import PageTwo from './components/Start_Pages/PageTwo.vue';
import PageThree from './components/Start_Pages/PageThree.vue';
import PageFour from './components/Start_Pages/PageFour.vue';
import PageFive from './components/Start_Pages/PageFive.vue';

import App from './App.vue';
import HelloWorld from './components/HelloWorld.vue';
import TheWelcome from './components/TheWelcome.vue';

onMounted(() => {
  $('#pagepiling').pagepiling({
    passive: true,
    anchors: ['page1', 'page2', 'page3', 'page4', 'page5'],
  });
});
</script>

<template>
    <div id="pagepiling">
      <div class="section" style="background-image: linear-gradient(180deg,rgb(93, 197, 246),rgb(182, 225, 246))"><PageOne/></div>
      <div class="section" style="background-color: rgb(182, 225, 246)"><PageTwo/></div>
      <div class="section" style="background-color: white;"><PageThree/></div>
      <div class="section" style="background-color: yellow;"><PageFour/></div>
      <div class="section" style="background-color: white;"><PageFive/></div>
    </div>
</template>

<style scoped>
html,
body,
#pagepiling {
  height: 100%;
  width: 100%;
  margin: 0;
}

.section {
  height: 100vh;
  text-align: center;
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: auto;
}
</style>