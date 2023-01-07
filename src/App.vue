<script setup lang="ts">
import { ref, watch } from 'vue';
import SearchPanel from './components/SearchPanel/SearchPanel.vue';
import UserSimpleProfilePage from './components/UserProfilePanel/UserSimpleProfilePage.vue';
import type { DestinyUserDescriptor, DestinyCharacterDescriptor } from '@/model/DestinyUserDescriptor';



const selectedUserDescriptor = ref<DestinyUserDescriptor|null>(null);

function onInnerItemClicked(ud : DestinyUserDescriptor) {
  selectedUserDescriptor.value = ud;
}


</script>




<template>
<div class="main">
  <div>
    <SearchPanel @item-clicked="onInnerItemClicked" />
  </div>
  <div>
    <UserSimpleProfilePage :user-descriptor="selectedUserDescriptor" />
  </div>
</div>
</template>




<style scoped>

.main {
  display: grid;
  grid-template-columns: 20rem 1fr;
  grid-template-rows: 100vh;
  grid-gap: 2rem;
  margin-right: 2rem;
}

</style>


