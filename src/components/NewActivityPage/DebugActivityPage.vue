<script setup lang="ts">

import { htKeys } from '@/services/HtKeys';
import { ref, inject } from 'vue';
import LoadingIndicator from '../Common/LoadingIndicator.vue';
import RaidActivityHelper from './RaidActivityHelper';
import type ActivityViewModel from './ActivityViewModel';

// services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;
const appService = serviceContainer.htAppService;

// const

let displayedActivities = ref(new Array<ActivityViewModel>());
let isBungieDataLoading = ref(false);



async function onFullReload() {
  
  isBungieDataLoading.value = true;
  
  let helper = new RaidActivityHelper();
  let activityVms = await helper.getActivities(serviceContainer);
  
  displayedActivities.value = activityVms;
  isBungieDataLoading.value = false;
}

</script>




<template>
  
  <div style="height: 2rem;"></div>
  <div><img src="@/assets/sticker-01.png"></div>
  <div style="height: 2rem;"></div>
  <button @click="(ev) => onFullReload()">_ reload all _</button>
  <div style="height: 2rem;"></div>
  
  <!-- list of activities -->
  <div v-if="isBungieDataLoading == false">
    <div v-for="act of displayedActivities" class="drap-activity-card">
      
      <div class="drap-activity-titleblock">
        <div class="drap-activity-lamp" :style="{ backgroundColor : act.referenceColor }"></div>
        <div class="drap-activity-subtext">{{ act.referenceType }}</div>
        <div>{{ act.referenceName }}</div>
        <div>{{ act.durationText }}</div>
        <div class="drap-activity-subtext">{{ act.startDateText }}</div>
        <div><a v-bind:href="act.reportHyperlink">report</a></div>
      </div>
      
      <div class="drap-activity-playerlist">
        <div v-for="p of act.players"> 
          <div v-if="p.isTargetClanMember"> {{ p.bungieGlobalDisplayName }}  </div>
          <div v-else class="drap-activity-subsubtext"> {{ p.bungieGlobalDisplayName }}  </div>
        </div>
      </div>
      
    </div>
  </div>
  <!-- loader -->
  <div v-else>
    <LoadingIndicator/>
  </div>
  

  
</template>



<style scoped>


* {
  font-family: Consolas, Helvetica, sans-serif;
  font-size: 10pt;
  color: #fff9;
}

.clan-page-root {
  position: relative;
  border: dashed 0px orange;
  border-radius: 0.4rem;
}

.clan-page-root-debugcaption {
  position: absolute;
  left:0rem;
  top:-0.3rem;
  color: orange;
  font-size: 9pt; 
  opacity: 0;
}


.clan-page-nodata-container {
  height: 24rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  /* border: dashed 2px blueviolet;
  border-radius: 0.4rem; */
}







.drap-activity-card {
  display: grid;
  grid-template-rows: 2rem 1fr;
  align-items: center;
  margin-bottom: 2rem;
}

.drap-activity-titleblock {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.drap-activity-playerlist {
  display: flex;
  flex-direction: column;
}

.drap-activity-lamp {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: aqua;
}

.drap-activity-subtext {
  opacity: 0.4;
}

.drap-activity-subsubtext {
  opacity: 0.2;
}



</style>