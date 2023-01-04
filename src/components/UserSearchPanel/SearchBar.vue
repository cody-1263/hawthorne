

<script setup lang="ts">
import { ref, watch } from 'vue';

const innerSearchTextRef = ref('');
const emit = defineEmits(['searchTextUpdated'])

// watch(innerSearchTextRef, async (newSearchText, oldSearchText) => {
//   emit('searchTextUpdated', newSearchText);
// });

function onInputKeyPress(event : KeyboardEvent) {
  if (event.key === "Enter") {
    event.preventDefault();
    emit('searchTextUpdated', innerSearchTextRef.value);
  }
}


</script>


<script lang="ts">



</script>


<template>
  
  <input type="text" v-model="innerSearchTextRef" @keypress="onInputKeyPress"/>
  
  <div>{{ innerSearchTextRef }}</div>
  
</template>