<script setup lang="ts">
import { ref, provide } from 'vue';
import { htKeys } from '@/services/HtKeys';
import { HtApplicationResearchObjectMode } from '@/services/HtServiceContainer'
import SearchPanel from './components/SearchPanel/SearchPanel.vue';
import ClanPage from './components/ClanProfilePanel/ClanPage.vue';
import UserSimpleProfilePage from './components/UserProfilePanel/UserSimpleProfilePage.vue';
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';
import { HtServiceContainer } from '@/services/HtServiceContainer';
import type { DestinyUserProfile } from './domain/ProfileDataItems';


const selectedUserDescriptorRef = ref<DestinyUserProfile|null>(null);
provide(htKeys.selectedUsedDescriptorKey, selectedUserDescriptorRef);

const serviceContainer = new HtServiceContainer();
provide(htKeys.htServiceContainerKey, serviceContainer);


const researchObjectModeRef = serviceContainer.htAppService.selectedResearchObjectMode;


function onInnerItemClicked(ud : DestinyUserProfile) {
  selectedUserDescriptorRef.value = ud;
}


</script>




<template>
<div class="main">
  <div>
    <SearchPanel @item-clicked="onInnerItemClicked" />
  </div>
  <div class="main-rightpane">
    <UserSimpleProfilePage v-if="researchObjectModeRef == HtApplicationResearchObjectMode.SingleUser" :user-descriptor="selectedUserDescriptorRef" />
    <ClanPage v-if="researchObjectModeRef == HtApplicationResearchObjectMode.ClanCollection"/>
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


