


<script setup lang="ts">



const props = defineProps<{
  numberItems: number[],
  legendItems: string[],
}>();

// const emit = defineEmits<{
//   (e: 'selectedStringItemChanged', stringItem: string, selectedIndex: number): void,
// }>();

</script>


<template>
  
  <div class="hthist-root">
    <div class="hthist-histcontainer">
			<div v-for="numItem in numberItems" :style="{height: numItem * 100 + '%'}" class="hthist-item"></div>
		</div>
		<div class="hthist-legend">
			<div v-for="legItem in legendItems">{{ legItem }}</div>
		</div>
  </div>
  
</template>


<style scoped>

.hthist-root {
  position: relative;
  border: dashed 0px magenta;
  border-radius: 0.2rem;
  display: grid;
  grid-template-rows: 1fr auto;
}


.hthist-histcontainer {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content:space-between;
  align-items: flex-end;
  gap: 0.0rem;
  border: solid 1px #000;
  background-color: #223344;
  border-radius: 0.5rem;
  overflow: hidden;
}

.hthist-item {
  background-color: #4158D0;
  background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  flex-grow: 1;
  border-radius: 0.0rem;
}

.hthist-legend {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 4px;
  margin-left: 0;
  margin-right: 0;
  font-size: 0.9rem;
  line-height: 0.6rem;
  opacity: 0.5;
}


</style>