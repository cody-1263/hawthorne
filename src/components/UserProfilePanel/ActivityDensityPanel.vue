

<script setup lang="ts">
import { ref, watch, inject  } from 'vue';
import type { Ref } from 'vue';
import { selectedUsedDescriptorKey } from '@/keys';
import SectionSelector from '@/components/Common/SectionSelector.vue';
import LoadingIndicator from '@/components/Common/LoadingIndicator.vue';
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
let legendRef = ref<string[]>([ '0', '2', '4','6','8','10','12','14','16','18','20','22','24']);
let filterCollection = [ 'ALL TIME', 'YEAR', '6 MONTHS', '3 MONTHS', 'MONTH' ];
let currentDate = (new Date());
let filterStartDates = [
  new Date(0),
  new Date((new Date()).setFullYear(currentDate.getFullYear() - 1)),
  new Date((new Date()).setMonth(currentDate.getMonth() - 6)),
  new Date((new Date()).setMonth(currentDate.getMonth() - 3)),
  new Date((new Date()).setMonth(currentDate.getMonth() - 1)),
];

let selectedFilterRef = ref<string>(filterCollection[1]);
let selectedStartDateRef = ref<Date>(filterStartDates[1])
let isLoadingStateRef = ref<boolean>(false);

let debug_activityCountRef = ref(0);
let debug_activityMinDateRef = ref(new Date(0));
let debug_activityMaxDateRef = ref(new Date(0));

// actions

function onReloadButtonClick() {
  if (userDescriptorRef.value != null) {
    timelinesRef.value = new Array<ActivityDensityTimeline>(); 
    isLoadingStateRef.value = true;
    let udp = new ActivityCalculator();
    udp.createDensityData(userDescriptorRef.value, selectedStartDateRef.value).then((data) =>  {
      timelinesRef.value = data; 
      
      debug_activityCountRef.value = data[0].totalActivityCount;
      debug_activityMaxDateRef.value = data[0].maxActivityDate;
      debug_activityMinDateRef.value = data[0].minActivityDate;
      
      isLoadingStateRef.value = false;
    });
  }
}

function onSelectedFilterChanged(selectedFilter:string) {
  
  for (let i = 0; i < filterCollection.length; i++) {
    if (selectedFilter == filterCollection[i]) {
      selectedFilterRef.value = filterCollection[i];
      selectedStartDateRef.value = filterStartDates[i]
    }
  }
  

}

</script>




<template>
<div class="adp-wrap">
  
  <SectionSelector :string-items="filterCollection" @selected-string-item-changed="onSelectedFilterChanged" style="margin-top: 2rem;"/>
  
  <!-- DEBUG: data report -->
  <div style="display: block; padding: 0.5rem 1rem; opacity: 0.75; color: greenyellow; background: #11223300; margin-top: 2rem;">
    <h3>[DEBUG DATA] // Data acquisition report</h3>
    <div>Selected filter ---- {{ selectedFilterRef }}</div>
    <div>Selected start date ---- {{ selectedStartDateRef }}</div>
    <div>Activity count ---- {{ debug_activityCountRef }}</div>
    <div>Oldest activity ---- {{ debug_activityMinDateRef }}</div>
    <div>Newest activity ---- {{ debug_activityMaxDateRef }}</div>
  </div>
  
  <button id="counter" type="button" style="margin-top: 2rem;" @click="onReloadButtonClick" >Reload activity</button>
  
  <LoadingIndicator v-if="isLoadingStateRef" class="adp-loading-indicator " />
  
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