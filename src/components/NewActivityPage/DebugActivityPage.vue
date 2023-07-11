<script setup lang="ts">

import { htKeys } from '@/services/HtKeys';
import { ref, inject } from 'vue';
import { ActivityCalculatorNew } from '@/model/ActivityCalculatorNew';
import LoadingIndicator from '../Common/LoadingIndicator.vue';
import { HtActivityType, HtPeriodMode } from '@/services/HtAppService';
import { DestinyClanProfile } from '@/domain/ProfileDataItems';

// services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;
const appService = serviceContainer.htAppService;

// const
const someStringNumbers = ['0','4','8','12','16','20','24'];
let displayText = ref(['hello world','hello world 222']);

async function onFullReload() {
  let clan1 = new DestinyClanProfile();
  clan1.name = "Pathfinders";
  clan1.groupId = '3909446';
  clan1.clanCallsign = "SGP";
  var members = await bnetProvider.getClanMembers(clan1, domain);
  
  for (let mem of members) {
    if (!mem.bungieGlobalDisplayName.includes('cody#1263')) {
      continue;
    }
    
    var activities = await bnetProvider.getActivities(mem, new Date('2023-06-01T03:24:00'), 4);
    
    // objs.sort((a,b) => (a.last_nom > b.last_nom) ? 1 : ((b.last_nom > a.last_nom) ? -1 : 0))
    
    activities.sort((a,b) => (a.startDate > b.startDate) ? -1 : 1);
    
    let text = new Array<string>();
    for (let act of activities) {
      text.push(act.referenceId + '     ' + act.startDate.toString()+ '     '  + act.durationSeconds/60 + 'm     ');
    }
    
    displayText.value = text;
  }
  
  
}

</script>

<template>
  
  <div style="height: 2rem;"></div>
  <div><img src="@/assets/sticker-01.png"></div>
  <div style="height: 2rem;"></div>
  <button @click="(ev) => onFullReload()">_ reload all _</button>
  <div style="height: 2rem;"></div>
  
  <div v-for="textItem of displayText">
    {{textItem}}
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

</style>