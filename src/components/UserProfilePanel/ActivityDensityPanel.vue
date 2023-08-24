

<script setup lang="ts">
import { ref, watch, inject  } from 'vue';
import { htKeys } from '@/services/HtKeys';
import SectionSelector from '@/components/Common/SectionSelector.vue';
import LoadingIndicator from '@/components/Common/LoadingIndicator.vue';
import HtHistogram from '../Common/HtHistogram.vue';
import type ActivityDensityTimeline from '@/model/ActivityDensityTimeline';
import { ActivityCalculatorNew } from '@/model/ActivityCalculatorNew';

// app services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const appService = serviceContainer.htAppService;
const bnetProvider = serviceContainer.bungieNetProvider;

// refs

const targetUserRef = appService.selectedUserProfile;
const studyPeriod = appService.studyPeriod;
const studyActivity = appService.studyActivity;

const timelinesRef = ref<ActivityDensityTimeline[]|null>(null);
const isLoadingStateRef = ref(false);
const debug_infoRef = ref(['debug_line_01', 'debug_line_02']);

const legendStrings = ['0','2','4','6','8','10','12','14','16','18','20','22','24'];






// actions

function onPeriodSelected (stringName: string, index: number) {
  appService.studyPeriod.value = index;
}
function onActivitySelected (stringName: string, index: number) {
  appService.studyActivity.value = index;
}

/** ijweigruwwigruw */
async function onReloadButtonClick() {
  
  timelinesRef.value = new Array<ActivityDensityTimeline>(); 
  if (targetUserRef.value == null) return;
  
  isLoadingStateRef.value = true;

  const user = targetUserRef.value;
  const period = appService.studyPeriod.value;
  const activityType = appService.studyActivity.value;
  const calc = new ActivityCalculatorNew();
  const newData = await calc.getUserActivityDensity(user, activityType, period, domain, bnetProvider);
  timelinesRef.value = newData;
  
  let debugLines = [];
  let tl = newData[0];
  debugLines.push(`activity count: ${tl.totalActivityCount}`);
  debugLines.push(`oldest: ${tl.minActivityDate}`);
  debugLines.push(`newest: ${tl.maxActivityDate}`);
  debug_infoRef.value = debugLines;
  
  isLoadingStateRef.value = false;
}

// watch

watch(targetUserRef, (newValue, oldValue) => {
  timelinesRef.value = null;
  debug_infoRef.value = ['debug_line_01', 'debug_line_02'];
});

</script>




<template>
<div class="adp-wrap">
  
  
  <div v-if="targetUserRef != null" class="adp-mainpanel">
    
    <!-- - - - - selectors - - - - -->
    
    <div style="height:2rem;"></div>
    <SectionSelector :string-items="appService.studyPeriodCodes" :initial-index="appService.studyPeriod.value" @selected-string-item-changed="onPeriodSelected"/>
    <div style="height:0.5rem;"></div>
    <SectionSelector :string-items="appService.studyActivityCodes" :initial-index="appService.studyActivity.value" @selected-string-item-changed="onActivitySelected"/>
    
    <!-- - - - - DEBUG: data report - - - - -->
    
    <div class="adp-clan-debug-panel-root">
      <p>-</p>
      <p>Study period: {{ studyPeriod }}  ({{ appService.studyPeriodCodes[studyPeriod] }})</p>
      <p>Study activity: {{ studyActivity }}  ({{ appService.studyActivityCodes[studyActivity] }})</p>
      <p>-</p>
      <p v-for="line of debug_infoRef">{{ line }}</p>
      <p>-</p>
    </div>
    
    <!-- - - - - Data - - - - -->
    
    <!-- loading state -->
    <div v-if="isLoadingStateRef" class="adp-nodata-container">
      <LoadingIndicator/>
      <div style="height:1rem;"></div>
      <p style="opacity:0.5">Downloading...</p>
    </div>
    <!-- no-data state -->
    <div v-else-if="timelinesRef == null" class="adp-nodata-container">
      <p style="opacity:0.5">No data yet. Click "Download" to download data</p>
      <div style="height:1rem;"></div>
      <button @click="onReloadButtonClick">Download</button>
    </div>
    <!-- has-data state -->
    <div v-else>
      <button @click="onReloadButtonClick">Reload</button>
      <div style="height:1rem;"></div>
      <div v-for="tl of timelinesRef">
        <div style="height:1rem;"></div>
        <div>{{ tl.name }}</div>
        <div style="height:0.4rem;"></div>
        <HtHistogram :number-items="tl.timelineNormalized" :legend-items="legendStrings" style="height: 8rem"/>
      </div>
    </div>

    
  </div>
  <div v-else>
    <!-- null content -->
  </div>
  
  
</div>
</template>


<style scoped>

.adp-wrap {
  position: relative;
  border: dashed 0px green;
  border-radius: 0.4rem;
}


.adp-nodata-container {
  height: 24rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  /* border: dashed 2px blueviolet;
  border-radius: 0.4rem; */
}

.adp-loading-indicator {
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }


.density-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  height: 72px;
  border: solid 1px #000;
  background-color: #223344;
  margin-top: 8px;
  margin-left: 0;
  margin-right: 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.density-item {
  background-color: #4158D0;
background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);


  width: 1%;
}

.density-legend {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 4px;
  margin-left: 0;
  margin-right: 0;
}



.adp-clan-debug-panel-root {
  color: greenyellow;
  font-family: 'Consolas', sans-serif;
  font-size: 10pt;
  margin: 1rem;
}

</style>