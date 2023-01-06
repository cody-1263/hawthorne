

<script setup lang="ts">
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';

const props = defineProps<{
  userDescriptor: DestinyUserDescriptor,
  shortUserName: string,
  fullUserName: string,
  iconUrl1: string | undefined,
  iconUrl2: string | undefined,
  iconUrl3: string | undefined,
}>();

const emit = defineEmits<{
  (e: 'itemClicked', item: DestinyUserDescriptor): void
}>();


function onButtonClick(event : MouseEvent) {
  emit('itemClicked', props.userDescriptor);
}


</script>



<template>
  
<button v-on:click="onButtonClick">
  <div class="wrap">
    <p class="caption1">{{ fullUserName }}</p>
    <p class="caption2">{{ userDescriptor.clanDescriptor?.name }}</p>
    <img v-if="iconUrl1 != null" :src="iconUrl1" class="icon" style="grid-area: icon3"/>
    <img v-if="iconUrl2 != null" :src="iconUrl2" class="icon" style="grid-area: icon2"/>
    <img v-if="iconUrl3 != null" :src="iconUrl3" class="icon" style="grid-area: icon1"/>
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
  background: #534;
}
button:active {
  background: #765;
}

.wrap {
  display: grid;
  grid-template-areas: 
  "icon1 icon2 icon3 caption1"
  "icon1 icon2 icon3 caption2";
  grid-template-columns: 3rem 3rem 3rem 1fr;
  grid-template-rows: 1.5rem 1.5rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  margin: auto;
  border-radius: 0.5rem;
  border: 1px solid black;
}

.caption1 {
  grid-area: caption1;
  color: #fff;
}

.caption2 {
  grid-area: caption2;
  color: #aaa;
}

</style>