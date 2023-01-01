

<script>

/** My Component! */
export default {
  props: {
    shortUserName: String,
    fullUserName: String,
    iconUrl: String,
  }
}

</script>



<template>
  
<div class="wrap">
  <p class="caption1">{{ shortUserName }}</p>
  <p class="caption2">{{ fullUserName }}</p>
  <img :src="iconUrl" class="icon"/>
</div>
  
</template>



<style scoped>

.wrap {
  background: #162735;
  
  display: grid;
  grid-template-areas: 
  "icon caption1"
  "icon caption2";
  grid-template-columns: 3rem 1fr;
  grid-template-rows: 1.5rem 1.5rem;
}

.icon {
  width: 2rem;
  height: 2rem;
  margin: auto;
  grid-area: icon;
  
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