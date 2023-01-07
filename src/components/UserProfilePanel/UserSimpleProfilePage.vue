

<script setup lang="ts">
import { ref, watch, computed  } from 'vue';
import GeneralInfoPanel from '@/components/UserProfilePanel/GeneralInfoPanel.vue';
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';
import type { ActivityDensityTimeline } from '@/model/ActivityDensityTimeline';
import UserDataProvider from '@/model/UserDataProvider';
import { ActivityCalculator } from  '@/model/ActivityCalculator';
import { getTimeAgoText } from '@/model/Utils';

// props

const props = defineProps<{
  userDescriptor: DestinyUserDescriptor | null
}>();

// watch

watch(() => props.userDescriptor, (newValue, oldValue) => {
  timelinesRef.value = null;
});

// refs

let timelinesRef = ref<ActivityDensityTimeline[] | null>(null);
let legendRef = ref<string[]>([ '12am', '2am', '4am','6am','8am','10am','12pm','2pm','4pm','6pm','8pm','10pm','12am']);


// actions

function onReloadButtonClick() {
  if (props.userDescriptor != null) {
    
    // let ds = new UserDataProvider();
    // ds.getGroupForMember(props.userDescriptor);
    
    
    let udp = new ActivityCalculator();
    udp.createDensityData(props.userDescriptor).then((data) =>  {
      timelinesRef.value = data; 
    });
  }
}

</script>




<template>
  
<div class="wrap">
  <!-- <div v-if="userDescriptor != null">
    
    <div class="usertitle">
      <div style="font-weight: 700;">{{ userDescriptor.displayName }}</div>
      <div style="margin-left: 1rem;">#</div>
      <div>{{ userDescriptor.nameCode }}</div>
    </div>
    
    <div style="margin-top: 4rem;">
      <div v-for="charItem in userDescriptor.characterDescriptors" class="char-card">
        <img class="char-icon" :src="charItem.emblemPath"/>
        <div class="char-name" style="width: 3.5rem; margin-left: 1rem;">{{ charItem.className }}</div>
        <div class="char-level" style="margin-left: 1rem; color: #e0bb36;">PL {{ charItem.light }}</div>
        <div class="char-level" style="margin-left: 1rem; opacity: 0.2;">last active: {{ charItem.dateLastPlayed.toDateString() }} ({{ getTimeAgoText(charItem.dateLastPlayed) }})</div>
      </div>
    </div>
    
    
    
  </div>
  <div v-else>
    <p style="margin: auto; text-align: center;">Select user</p>
  </div> -->
  
  <GeneralInfoPanel />
  
  
  <!-- lower part -->
  <button id="counter" type="button" @click="onReloadButtonClick" style="margin-top:8rem">Reload activity</button>
  
  <div v-if="timelinesRef != null" v-for="tl in timelinesRef">
    <div style="margin-top: 1rem;">{{tl.name}}</div>
    <div class="density-container">
			<div v-for="tlItem in tl.timelineNormalized" :style="{height: tlItem * 70 + 'px'}" class="density-item"></div>
		</div>
		<div class="density-legend">
			<div v-for="legItem in legendRef">{{ legItem }}</div>
		</div>
  </div>
</div>
  
  
  
  
</template>




<style scoped>

.wrap {
  display: grid;
  grid-template-rows: 1fr;
  height: 100%;
  overflow: scroll;
  scrollbar-width: none;
}
.wrap::-webkit-scrollbar { 
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
  border-radius: 0px;
}

.density-item {
  background-color: green;
  width: 4px;
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











button {
  border-radius: 0.5rem;
  border: 1px solid transparent;
  padding: 0.6rem 1.2rem;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #222;
  color: #eee;
  cursor: default;
  transition: border-color 0.25s;
  transition: background 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
button:active {
  background: #444;
}

</style>