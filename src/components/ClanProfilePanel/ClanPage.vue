



<script setup lang="ts">

import ClanDebugPanel from './ClanDebugPanel.vue';
import SectionSelector from '@/components/Common/SectionSelector.vue';
import { htKeys } from '@/services/HtKeys';
import { inject } from 'vue';
import HtHistogram from '../Common/HtHistogram.vue';

// services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;
const appService = serviceContainer.htAppService;

function onPeriodSelected (stringName: string, index: number) {
  appService.studyPeriod.value = index;
}
function onActivitySelected (stringName: string, index: number) {
  appService.studyActivity.value = index;
}

// const
let someRandomNumbers = [0.1, 0.4, 0.8, 1.0, 0.9, 0.7, 0.5, 0.0, 0.1, 0.4, 0.3,0.5,0.1,0.45,0.67,0.98];
let someStringNumbers = ['1am','21fes','efwe','ewfwfw','235325dssfg'];


</script>

<template>
  
  <div class="clan-page-root">
    <div class="clan-page-root-debugcaption">ClanPage</div>
    <ClanDebugPanel/>
    <SectionSelector :string-items="appService.studyPeriodCodes" :initial-index="appService.studyPeriod.value" @selected-string-item-changed="onPeriodSelected"/>
    <SectionSelector :string-items="appService.studyActivityCodes" :initial-index="appService.studyActivity.value" @selected-string-item-changed="onActivitySelected"/>
  
    <HtHistogram :number-items="someRandomNumbers" :legend-items="someStringNumbers" style="height: 10rem"/>
    <div style="height:1rem;"></div>
    <HtHistogram :number-items="someRandomNumbers" :legend-items="someStringNumbers" style="height: 6rem"/>
  
  </div>
  
</template>



<style>

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

</style>