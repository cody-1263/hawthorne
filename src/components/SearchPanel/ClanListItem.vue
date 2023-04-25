

<script setup lang="ts">

import { ref, watch } from 'vue';
import type { DestinyClanProfile } from '@/domain/ProfileDataItems';
import { getTimeAgoText } from '@/model/Utils';



const props = defineProps<{
  clanProfile: DestinyClanProfile,
}>();

const emit = defineEmits<{
  (e: 'itemClicked', item: DestinyClanProfile): void
}>();


function onButtonClick(event: MouseEvent) {
  emit('itemClicked', props.clanProfile);
}


</script>



<template>

<div class="clanitem-wrap">
  <img class="clanitem-icon" src="https://www.bungie.net/common/destiny2_content/icons/3ab038f27fc631038abf223408f3074a.png"/>
  <div class="clanitem-captionsblock">
    <div class="clanitem-caption-1">{{ clanProfile.name }}</div>
    <div class="clanitem-caption-2">{{ clanProfile.clanCallsign }}  /  {{ clanProfile.groupId }}</div>
  </div>
  <button class="clanitem-btn" v-on:click="onButtonClick">
    <img class="clanitem-btn-icon" src="../../../public/icons8-plus-math-64.png"/>
  </button>
</div>

  
</template>



<style scoped>


.clanitem-wrap {
  display: grid;
  grid-template-areas: "icon captions addbtn";
  grid-template-columns: 3rem 1fr 3rem;
  align-items: center;
  padding-left: 0.5rem;
  height: 4rem;
  background: #1D1D1D;
  border: 1pt solid #000000;
  border-radius: 0.5rem;
  transition: all 0.2s;
}
.clanitem-wrap:hover {
  background: #272727;
}

.clanitem-icon {
  width: 2rem;
  height: 2rem;
  grid-area: icon;
}

.clanitem-captionsblock {
  display: flex;
  flex-direction: column;
  grid-area: captions;
}

.clanitem-caption-1 {
  font-size: 1rem;
}

.clanitem-caption-2 {
  font-size: 0.8rem;
  opacity: 0.5;
}

.clanitem-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #478242;
  border: 1px solid #000000;
  border-radius: 8px;
  padding: 0;
  opacity: 0.0;
  grid-area: addbtn;
  transition: all 0.2s;
}
.clanitem-btn:hover {
  background: #4E9048;
}
.clanitem-btn:active {
  background: #41783C;
}
.clanitem-wrap:hover .clanitem-btn {
  opacity: 1;
}

.clanitem-btn-icon {
  width: 1rem;
  height: 1rem;
  margin: auto;
}

</style>