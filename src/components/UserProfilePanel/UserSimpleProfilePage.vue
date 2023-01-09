

<script setup lang="ts">
import { ref, watch, computed  } from 'vue';
import GeneralInfoPanel from '@/components/UserProfilePanel/GeneralInfoPanel.vue';
import ActivityDensityPanel from '@/components/UserProfilePanel/ActivityDensityPanel.vue';
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
    udp.createDensityData(props.userDescriptor, new Date(0)).then((data) =>  {
      timelinesRef.value = data; 
    });
  }
}

</script>




<template>
  
<div class="uspp-scroller">
  <div class="uspp-layout">
    <GeneralInfoPanel />
    <ActivityDensityPanel />
  </div>
</div>
  
</template>




<style scoped>

.uspp-scroller {
  overflow: scroll;
  height: 99vh;
  scrollbar-width: none;
}
.uspp-scroller::-webkit-scrollbar { 
  display: none;
}

.uspp-layout {
  display: grid;
  grid-template-rows: auto 1fr;
}


</style>