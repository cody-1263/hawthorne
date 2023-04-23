

<script setup lang="ts">

import ClanDebugPanel from './ClanDebugPanel.vue';
import SectionSelector from '@/components/Common/SectionSelector.vue';
import { htKeys } from '@/services/HtKeys';
import { ref, inject } from 'vue';
import HtHistogram from '../Common/HtHistogram.vue';
import type { ActivityDensityTimeline } from '@/model/ActivityDensityTimeline';
import { ActivityCalculatorNew } from '@/model/ActivityCalculatorNew';
import LoadingIndicator from '../Common/LoadingIndicator.vue';
import { HtActivityType, HtPeriodMode } from '@/services/HtAppService';
import { GroupActivityStatsTask, type PlayerGroupActivitySummary, ActivityCodes} from '@/model/GroupActivityStatsTask';
import { UserActivityViewItem } from './UserActivityViewItem';

// services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;
const appService = serviceContainer.htAppService;

// const
const someStringNumbers = ['0','4','8','12','16','20','24'];
const activityCodes = new ActivityCodes();

// refs
let displayedPlayerList = ref<UserActivityViewItem[]|null>();
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
  
  isLoadingData.value = true;
  
  const groups = appService.selectedClanProfileCollection.value;
  const activityType = appService.studyActivity.value;
  const periodMode = appService.studyPeriod.value;
  
  let calc = new GroupActivityStatsTask();
  let result = await calc.getClansGroupActivities(groups, activityType, periodMode, domain, bnetProvider);
  
  let viewItems = new Array<UserActivityViewItem>();
  for (let playerData of result.playerSummaries) {
    let viewItem = new UserActivityViewItem();
    viewItem.userData = playerData;
    viewItems.push(viewItem);
  }
  displayedPlayerList.value = viewItems;
  isLoadingData.value = false;
}

</script>

<template>
  
  <div class="clan-page-root">
    <div class="clan-page-root-debugcaption">ClanPage</div>
    
    <ClanDebugPanel/>
    
    <SectionSelector :string-items="appService.studyPeriodCodes" :initial-index="appService.studyPeriod.value" @selected-string-item-changed="onPeriodSelected"/>
    <div style="height:0.5rem;"></div>
    <SectionSelector :string-items="appService.studyActivityCodes" :initial-index="appService.studyActivity.value" @selected-string-item-changed="onActivitySelected"/>
    
    <div style="height:1rem;"></div>
    
    <div v-if="isLoadingData" class="clan-page-nodata-container">
      <LoadingIndicator/>
      <div style="height:1rem;"></div>
      <p style="opacity:0.5">Downloading... oh man, this is going to take a while</p>
    </div>
    <div v-else-if="displayedPlayerList == null" class="clan-page-nodata-container">
      <p>No data present. Click "Download" to download data</p>
      <div style="height:1rem;"></div>
      <button @click="onDownloadButtonClick">Download</button>
    </div>
    <div v-else>
      <div v-for="playerSummary of displayedPlayerList" class="char-card">
        <div>{{ playerSummary.userData.userProfile.bungieGlobalDisplayName }}</div>
        <div style="opacity:0.5">{{ playerSummary.userData.groupActivityTotalCount }} activities  /  {{ Math.round(playerSummary.userData.groupActivityTotalDurationSeconds / 3600)  }} hours</div>
        <div style="height:0.5rem;"></div>
        <div class="expand-data-btn" @click="$event => playerSummary.showActivitiesList = !playerSummary.showActivitiesList"></div>
        <div v-if="playerSummary.showActivitiesList">
          <div v-for="activity of playerSummary.userData.groupActivities"> 
            <div>{{ Math.round(activity.durationSeconds / 60)  }} minutes  /  {{  activity.startDate  }}</div>
            <div class="hor-flex"><div v-for="at of activity.activityTypes"> {{  activityCodes.names.get(at)! }} . </div></div>
            <div class="hor-flex"><div v-for="up of activity.userProfiles"> {{  up.bungieGlobalDisplayName }} . </div></div>
            <div style="height:0.5rem;"></div>
          </div>
        </div>
        <div style="height:0.5rem;"></div>
      </div>
    </div>
  
  </div>
  
</template>



<style scoped>

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



.expand-data-btn {
  width: 1rem;
  height: 1rem;
  border-radius: 0.4rem;
  background-color: brown;
}

.hor-flex {
  display: flex;
  flex-direction: row;
}

</style>