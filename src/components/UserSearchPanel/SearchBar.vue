

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




<template>
  
  <input type="text" class="text-field" v-model="innerSearchTextRef" @keypress="onInputKeyPress"/>
  
  <!-- <div>{{ innerSearchTextRef }}</div> -->
  
</template>


<style scoped>

  .text-field {
    background-color: #333;
    color: #ddd;
    border: solid 2px #111;
    border-radius: 0.3rem;
    min-height: 2rem;
    transition: border-color 0.25s;
  }
  .text-field:focus {
    outline: none;
    border-color: #646cff;
  }

</style>