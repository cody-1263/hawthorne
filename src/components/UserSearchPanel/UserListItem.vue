

<script lang="ts">

/** My Component! */
export default {
  props: {
    shortUserName: String,
    fullUserName: String,
    iconUrl1: String,
    iconUrl2: String,
    iconUrl3: String,
  }
}

</script>



<template>
  
<div class="wrap">
  <p class="caption1">{{ shortUserName }}</p>
  <p class="caption2">{{ fullUserName }}</p>
  <img v-if="iconUrl1 != null" :src="iconUrl1" class="icon" style="grid-area: icon3"/>
  <img v-if="iconUrl2 != null" :src="iconUrl2" class="icon" style="grid-area: icon2"/>
  <img v-if="iconUrl3 != null" :src="iconUrl3" class="icon" style="grid-area: icon1"/>
</div>
  
</template>



<style scoped>

.wrap {
  background: #162735;
  
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