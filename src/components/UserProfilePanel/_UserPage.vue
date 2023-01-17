


<!-- 
  
  This is Single User info main page
  
-->


<script setup lang="ts">
import GeneralInfoPanel     from './GeneralInfoPanel.vue';
import ActivityDensityPanel from './ActivityDensityPanel.vue';



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
  grid-template-rows: auto auto 1fr;
}


</style>