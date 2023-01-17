

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { DestinyUserProfile } from '@/domain/ProfileDataItems';
import { getTimeAgoText } from '@/model/Utils';

let activeTextRef = ref('');

const props = defineProps<{
  userDescriptor: DestinyUserProfile,
  // shortUserName: string,
  // fullUserName: string,
  // iconUrl1: string | undefined,
  // iconUrl2: string | undefined,
  // iconUrl3: string | undefined,
}>();

const emit = defineEmits<{
  (e: 'itemClicked', item: DestinyUserProfile): void
}>();


function onButtonClick(event : MouseEvent) {
  emit('itemClicked', props.userDescriptor);
}




if (props.userDescriptor?.characters?.length > 0) {
  let dt = new Date(0);
  for (let cd of props.userDescriptor.characters) {
    if (cd.dateLastPlayed != null && cd.dateLastPlayed.getTime() > dt.getTime())
      dt = cd.dateLastPlayed;
  }
  activeTextRef.value = getTimeAgoText(dt);
}


</script>



<template>
  
<button v-on:click="onButtonClick">
  <div class="wrap">
    <img :src="userDescriptor.iconPath" class="icon"/>
    <div class="captions-div">
      <div class="captions-line1">
        <p class="caption-name">{{ userDescriptor.displayName }}</p>
        <p class="caption-hash">#</p>
        <p class="caption-code">{{ userDescriptor.nameCode }}</p>
        <p class="caption-clan">{{ userDescriptor.clanDescriptor?.name }}</p>
      </div>
      <div class="captions-line2">
        <p class="caption-lastactive">last active {{ activeTextRef }}</p>
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
  grid-template-areas: 
  "icon captions";
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