

<script setup>
import { ref, watch } from 'vue';

const innerSearchTextRef = ref('');
const emit = defineEmits(['searchTextUpdated'])

watch(innerSearchTextRef, async (newSearchText, oldSearchText) => {
  emit('searchTextUpdated', newSearchText);
});


</script>


<script>



</script>


<template>
  
  <input type="text" v-model="innerSearchTextRef"/>
  
  <div>{{ innerSearchTextRef }}</div>
  
</template>