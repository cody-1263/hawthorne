

<script setup lang="ts">
import {inject} from 'vue'
import { htKeys } from '@/services/HtKeys';
import { HtServiceContainer } from '@/services/HtServiceContainer';
import { getTimeAgoText } from '@/model/Utils';

// app services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const appService = serviceContainer.htAppService;
const bnetProvider = serviceContainer.bungieNetProvider;

// refs
const targetUserRef = appService.selectedUserProfile;


</script>


<template>
  
<div class="gip-wrap">
  
  <div v-if="targetUserRef != null">
    <div class="usertitle">
      <div style="font-weight: 700;">{{ targetUserRef.displayName }}</div>
      <div style="margin-left: 1rem;">#</div>
      <div>{{ targetUserRef.nameCode }}</div>
    </div>
    <div style="margin-top: 4rem;">
      <div v-for="charItem in targetUserRef.characters" class="char-card">
        <img class="char-icon" :src="charItem.emblemPath"/>
        <div style="width: 3.5rem; margin-left: 1rem;">{{ charItem.className }}</div>
        <div style="margin-left: 1rem; color: #e0bb36;">PL {{ charItem.light }}</div>
        <div style="margin-left: 1rem; opacity: 0.2;">last active: {{ charItem.dateLastPlayed.toDateString() }} ({{ getTimeAgoText(charItem.dateLastPlayed) }})</div>
      </div>
    </div>
  </div>
  <div v-else class="gip-nulldatadiv">
    <div>Find and select a user to display some info about them</div>
  </div>
</div>
  
</template>


<style scoped>

.gip-wrap {
  display: grid;
  grid-template-rows: 1fr;
  overflow: scroll;
  scrollbar-width: none;
  
  position: relative;
  border: dashed 0px orange;
  border-radius: 0.4rem;
}
.gip-wrap::-webkit-scrollbar { 
  display: none;
}



.usertitle {
  display: flex;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
  margin-top: 3rem;
  justify-content: center;
}

.char-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 0.5rem;
}
.char-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid black;
}


.gip-nulldatadiv {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 24rem;
  opacity: 0.5;
}

</style>