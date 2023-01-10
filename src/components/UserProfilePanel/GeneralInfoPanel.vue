

<script setup lang="ts">
import { inject  } from 'vue';
import { htKeys } from '@/services/HtKeys';
import { getTimeAgoText } from '@/model/Utils';

const userDescriptorRef = inject(htKeys.selectedUsedDescriptorKey)!;

</script>


<template>
  
<div class="gip-wrap">
  
  <div v-if="userDescriptorRef != null">
    
    <div class="usertitle">
      <div style="font-weight: 700;">{{ userDescriptorRef.displayName }}</div>
      <div style="margin-left: 1rem;">#</div>
      <div>{{ userDescriptorRef.nameCode }}</div>
    </div>
    
    <div style="margin-top: 4rem;">
      <div v-for="charItem in userDescriptorRef.characterDescriptors" class="char-card">
        <img class="char-icon" :src="charItem.emblemPath"/>
        <div class="char-name" style="width: 3.5rem; margin-left: 1rem;">{{ charItem.className }}</div>
        <div class="char-level" style="margin-left: 1rem; color: #e0bb36;">PL {{ charItem.light }}</div>
        <div class="char-level" style="margin-left: 1rem; opacity: 0.2;">last active: {{ charItem.dateLastPlayed.toDateString() }} ({{ getTimeAgoText(charItem.dateLastPlayed) }})</div>
      </div>
    </div>
    
  </div>
  <!-- <div v-else>
    <p style="margin-top: 8rem; text-align: center; opacity: 0.2;">Select user</p>
  </div> -->
</div>
  
</template>


<style scoped>

.gip-wrap {
  display: grid;
  grid-template-rows: 1fr;
  height: 100%;
  overflow: scroll;
  scrollbar-width: none;
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

</style>