

<script setup lang="ts">
import GeneralInfoPanel from '@/components/UserProfilePanel/GeneralInfoPanel.vue';
import ActivityDensityPanel from '@/components/UserProfilePanel/ActivityDensityPanel.vue';
import DomainPanel from './DomainPanel.vue';



</script>




<template>
  
<div class="uspp-scroller">
  <div class="uspp-layout">
    <DomainPanel />
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
  grid-template-rows: auto auto 1fr;
}


</style>