

<script setup lang="ts">
import { ref, watch, inject  } from 'vue';
import type { Ref } from 'vue';
import { selectedUsedDescriptorKey } from '@/keys';
import SectionSelector from '@/components/Common/SectionSelector.vue';
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';
import type { ActivityDensityTimeline } from '@/model/ActivityDensityTimeline';
import UserDataProvider from '@/model/UserDataProvider';
import { ActivityCalculator } from  '@/model/ActivityCalculator';
import { getTimeAgoText } from '@/model/Utils';

const userDescriptorRef = inject(selectedUsedDescriptorKey)!;

// watch

watch(userDescriptorRef, (newValue, oldValue) => {
  timelinesRef.value = null;
});

// refs

let timelinesRef = ref<ActivityDensityTimeline[] | null>(null);
let legendRef = ref<string[]>([ '12am', '2am', '4am','6am','8am','10am','12pm','2pm','4pm','6pm','8pm','10pm','12am']);
let filterCollection = [ 'YEAR', '3 MONTHS', 'MONTH' ];
let selectedFilterRef = ref<string>('YEAR');

// actions

function onReloadButtonClick() {
  if (userDescriptorRef.value != null) {
    let udp = new ActivityCalculator();
    udp.createDensityData(userDescriptorRef.value).then((data) =>  {
      timelinesRef.value = data; 
    });
  }
}

function onSelectedFilterChanged(selectedFilter:string) {
  selectedFilterRef.value = selectedFilter;
}

</script>




<template>
<div class="adp-wrap">
  
  <SectionSelector :string-items="filterCollection" @selected-string-item-changed="onSelectedFilterChanged" style="margin-top: 2rem;"/>
  
  <!-- DEBUG: data report -->
  <div style="display: block; padding: 0.5rem 1rem; opacity: 0.75; color: greenyellow; background: #112233;">
    <h3>Data acquisition report</h3>
    <div>Selected filter ---- {{ selectedFilterRef }}</div>
    <div>Activity count ---- {{ 345 }}</div>
    <div>Oldest activity ---- {{ (new Date()).toString() }}</div>
  </div>
  
  <button id="counter" type="button" style="margin-top: 2rem;" @click="onReloadButtonClick" >Reload activity</button>
  
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

.adp-wrap {
  border-radius: 1rem;
  border: dashed 0px red;
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
  border: 1px solid;
  border-color: #000;
  padding: 0.6rem 1.2rem;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #222;
  color: #eee;
  cursor: default;
  transition: border-color 0.25s, background 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:active {
  background: #444;
}

</style>