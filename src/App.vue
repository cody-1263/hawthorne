<script setup lang="ts">
import { ref, watch, provide } from 'vue';
import type { Ref } from 'vue';
import { htKeys } from '@/services/HtKeys';
import SearchPanel from './components/SearchPanel/SearchPanel.vue';
import UserSimpleProfilePage from './components/UserProfilePanel/UserSimpleProfilePage.vue';
import type { DestinyUserDescriptor, DestinyCharacterDescriptor } from '@/model/DestinyUserDescriptor';
import { HtServiceContainer } from '@/services/HtServiceContainer';




const selectedUserDescriptorRef = ref<DestinyUserDescriptor|null>(null);


provide(htKeys.selectedUsedDescriptorKey, selectedUserDescriptorRef);

function onInnerItemClicked(ud : DestinyUserDescriptor) {
  selectedUserDescriptorRef.value = ud;
}


</script>




<template>
<div class="main">
  <div>
    <SearchPanel @item-clicked="onInnerItemClicked" />
  </div>
  <div class="main-rightpane">
    <UserSimpleProfilePage :user-descriptor="selectedUserDescriptorRef" />
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

.main-rightpane {
  max-width: 40rem;
}

</style>


