


<script setup lang="ts">
import {inject} from 'vue'
import { htKeys } from '@/services/HtKeys';
import { HtServiceContainer } from '@/services/HtServiceContainer';

// app services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const appService = serviceContainer.htAppService;
const bnetProvider = serviceContainer.bungieNetProvider;

// refs
const targetClans = appService.selectedClanProfileCollection;
const studyPeriod = appService.studyPeriod;
const studyActivity = appService.studyActivity;


</script>

<template>
  
  <div class="clan-debug-panel-root">
    <p>Selected clans [{{ targetClans.length }}]:</p>
    <div v-for="clanProfile of targetClans">
      <p>{{ clanProfile.groupId }} // {{ clanProfile.clanCallsign }} // {{ clanProfile.name }}</p>
    </div>
    <p>-</p>
    <p>Study period: {{ studyPeriod }}  ({{ appService.studyPeriodCodes[studyPeriod] }})</p>
    <p>Study activity: {{ studyActivity }}  ({{ appService.studyActivityCodes[studyActivity] }})</p>
  </div>
  
</template>


<style>

.clan-debug-panel-root {
  color: greenyellow;
  font-family: 'Consolas', sans-serif;
  font-size: 10pt;
  margin: 1rem;
}

</style>