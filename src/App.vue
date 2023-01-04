<script setup lang="ts">
import SearchPanel from './components/UserSearchPanel/SearchPanel.vue'
</script>




<template>
<div class="main">
  <div>
    <SearchPanel />
  </div>
  <div>
    mainPanel
  </div>
</div>
</template>




<style scoped>

.main {
  display: grid;
  grid-template-columns: 20rem 1fr;
}

</style>


