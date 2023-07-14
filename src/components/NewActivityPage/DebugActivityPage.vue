<script setup lang="ts">

import { htKeys } from '@/services/HtKeys';
import { ref, inject } from 'vue';
import { ActivityCalculatorNew } from '@/model/ActivityCalculatorNew';
import LoadingIndicator from '../Common/LoadingIndicator.vue';
import { HtActivityType, HtPeriodMode } from '@/services/HtAppService';
import { DestinyClanProfile } from '@/domain/ProfileDataItems';
import { ActivityItem } from '@/domain/ActivityDataItems';

// services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;
const appService = serviceContainer.htAppService;

// const
const someStringNumbers = ['0','4','8','12','16','20','24'];
let displayText = ref(['hello world','hello world 222']);

let displayedActivities = ref(new Array<ActivityItem>());

let a = new ActivityItem();

async function onFullReload() {
  let clan1 = new DestinyClanProfile();
  clan1.name = "Pathfinders";
  clan1.groupId = '3909446';
  clan1.clanCallsign = "SGP";
  let members1 = await bnetProvider.getClanMembers(clan1, domain);
  // 3285991
  let clan2 = new DestinyClanProfile();
  clan2.name = "Juggernauts";
  clan2.groupId = '3285991';
  clan2.clanCallsign = "SGJ";
  let members2 = await bnetProvider.getClanMembers(clan2, domain);
  
  let members = members1.concat(members2);
  
  var usersPromises = new Array<Promise<ActivityItem[]>>();
  
  for (let mem of members) {
    var activityDownloadPromise = bnetProvider.getActivities(mem, new Date('2023-06-01T03:24:00'), 4);
    usersPromises.push(activityDownloadPromise);
  }
  
  let allActivities = await Promise.all(usersPromises);
  
  let activitiesMap = new Map<string, ActivityItem>();
  
  for (let actArray of allActivities) {
    for (let act of actArray) {
      
      if (act.durationSeconds < 60 * 20) {continue;}
        
      
      if (!activitiesMap.has(act.instanceId)) {
        activitiesMap.set(act.instanceId, act);
      }
      else {
        let domainAct = activitiesMap.get(act.instanceId)!;
        if (!domainAct.players.includes(act.players[0])) {
          domainAct.playerProfiles.push(act.playerProfiles[0]);
          domainAct.players.push(act.players[0]);
        }
      }
      
    }
  }
  
  let activitiesCollection = Array.from(activitiesMap.values()).filter(a => a.players.length >= 2);
  activitiesCollection.sort((a,b) => (a.startDate > b.startDate) ? -1 : 1);
  
  displayedActivities.value = activitiesCollection;
}

</script>

<template>
  
  <div style="height: 2rem;"></div>
  <div><img src="@/assets/sticker-01.png"></div>
  <div style="height: 2rem;"></div>
  <button @click="(ev) => onFullReload()">_ reload all _</button>
  <div style="height: 2rem;"></div>
  
  <!-- <div v-for="textItem of displayText">
    {{textItem}}
  </div> -->
  
  <div v-for="act of displayedActivities">
    <div>{{act.instanceId}} // {{ act.referenceId }} / {{ act.startDate }}  /  {{  Math.round(act.durationSeconds / 60) }} m</div>
    <div v-for="pname of act.players">
      <div>. . . {{ pname }}</div>
    </div>
    <div> _ </div>
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