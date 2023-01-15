

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { DestinyClanProfile } from '@/domain/ProfileDataItems';
import { getTimeAgoText } from '@/model/Utils';

let activeTextRef = ref('');

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
  
<button v-on:click="onButtonClick">
  <div class="wrap">
    <!-- <img :src="userDescriptor.iconPath" class="icon"/> -->
    <div class="captions-div">
      <div class="captions-line1">
        <p class="caption-name">{{ clanProfile.name }}</p>
        <p class="caption-hash"></p>
        <p class="caption-code"></p>
        <p class="caption-clan"></p>
      </div>
      <div class="captions-line2">
        <p class="caption-lastactive">{{ clanProfile.groupId }} // {{ clanProfile.clanCallsign }}</p>
      </div>
    </div>
  </div>
</button>

  
</template>



<style scoped>

button {
  background: transparent;
  border-radius: 0.5rem;
  border: none;
  padding: 0;
  width: 100%;
}
button:hover {
  background: #fff1;
}
button:active {
  background: #fff2;
}

.wrap {
  display: grid;
  grid-template-areas: "icon captions";
  grid-template-columns: 3rem 1fr;
  height: 4rem;
}

.icon {
  grid-area: icon;
  width: 2rem;
  height: 2rem;
  margin: auto;
  border-radius: 0.5rem;
  border: 1px solid black;
}

.captions-div {
  grid-area: captions;
  display: grid;
  grid-template-rows: 1fr 1fr;
}

.captions-line1 {
  grid-row: 1;
  display: flex;
  flex-direction: row;
  margin-top: auto;
  overflow: hidden;
}

.captions-line2 {
  grid-row: 2;
  display: flex;
  flex-direction: row;
  margin-bottom: auto;
}

.caption-name {
  opacity: 1;
}


.caption-hash {
  margin-left: 0.2rem;
  font-size: 0.8rem;
  line-height: 1.2rem;
  color: #479ce4cc;
  
}
.caption-code {
  font-size: 0.8rem;
  line-height: 1.2rem;
  color: #479ce4cc;
}

.caption-clan {
  margin-left: 0.5rem;
  opacity: 0.2;
  white-space: nowrap
}

.caption-lastactive {
  font-size: 0.8rem;
  line-height: 1.3rem;
  opacity: 0.5;
}

</style>