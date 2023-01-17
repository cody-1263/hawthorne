



<script setup lang="ts">

import ClanDebugPanel from './ClanDebugPanel.vue';
import SectionSelector from '@/components/Common/SectionSelector.vue';
import { htKeys } from '@/services/HtKeys';
import { ref, inject } from 'vue';
import HtHistogram from '../Common/HtHistogram.vue';
import type { ActivityDensityTimeline } from '@/model/ActivityDensityTimeline';
import { ActivityCalculatorNew } from '@/model/ActivityCalculatorNew';
import LoadingIndicator from '../Common/LoadingIndicator.vue';
import { HtActivityType } from '@/services/HtAppService';

// services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;
const appService = serviceContainer.htAppService;

// const
let someRandomNumbers = [0.1, 0.4, 0.8, 1.0, 0.9, 0.7, 0.5, 0.0, 0.1, 0.4, 0.3,0.5,0.1,0.45,0.67,0.98];
let someStringNumbers = ['0','4','8','12','16','20','24'];
let currentDate = (new Date());
let filterStartDates = [
  new Date(0),
  new Date((new Date()).setFullYear(currentDate.getFullYear() - 1)),
  new Date((new Date()).setMonth(currentDate.getMonth() - 6)),
  new Date((new Date()).setMonth(currentDate.getMonth() - 3)),
  new Date((new Date()).setMonth(currentDate.getMonth() - 1)),
];

// refs
let displayedTimeline = ref<ActivityDensityTimeline|null>();
let isLoadingData = ref(false);

// functions
function onPeriodSelected (stringName: string, index: number) {
  appService.studyPeriod.value = index;
}
function onActivitySelected (stringName: string, index: number) {
  appService.studyActivity.value = index;
}

/** "Download" button action */
async function onDownloadButtonClick () {
  
  let groups = appService.selectedClanProfileCollection.value;
  let activityType = HtActivityType.Raids;
  
  // let users = bnetProvider.getClanMembers(appService.selectedClanProfileCollection.value[0], domain);
  
  let calc = new ActivityCalculatorNew();
  let minDate = filterStartDates[1];
  let actDensity = await calc.getClansActivityDensity(groups, activityType, minDate, domain, bnetProvider);
  displayedTimeline.value = actDensity;
  
}

</script>

<template>
  
  <div class="clan-page-root">
    <div class="clan-page-root-debugcaption">ClanPage</div>
    <ClanDebugPanel/>
    <SectionSelector :string-items="appService.studyPeriodCodes" :initial-index="appService.studyPeriod.value" @selected-string-item-changed="onPeriodSelected"/>
    <div style="height:0.5rem;"></div>
    <SectionSelector :string-items="appService.studyActivityCodes" :initial-index="appService.studyActivity.value" @selected-string-item-changed="onActivitySelected"/>
  
    <!-- <HtHistogram :number-items="someRandomNumbers" :legend-items="someStringNumbers" style="height: 10rem"/>
    <div style="height:1rem;"></div>
    <HtHistogram :number-items="someRandomNumbers" :legend-items="someStringNumbers" style="height: 6rem"/> -->
    
    <div style="height:1rem;"></div>
    
    <div v-if="isLoadingData">
      <LoadingIndicator />
    </div>
    <div v-else-if="displayedTimeline == null" class="clan-page-nodata-container">
      <p>No data present. Click "Download" to download data</p>
      <div style="height:1rem;"></div>
      <button @click="onDownloadButtonClick">Download</button>
    </div>
    <div v-else>
      <HtHistogram :number-items="displayedTimeline.timelineNormalized" :legend-items="someStringNumbers" style="height: 16rem"/>
    </div>
  
  </div>
  
</template>



<style scoped>

.clan-page-root {
  position: relative;
  border: dashed 2px orange;
  border-radius: 0.4rem;
}

.clan-page-root-debugcaption {
  position: absolute;
  left:0rem;
  top:-0.3rem;
  color: orange;
  font-size: 9pt; 
}


.clan-page-nodata-container {
  height: 24rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  border: dashed 2px blueviolet;
  border-radius: 0.4rem;
}

</style>