<script setup lang="ts">
import { ref, watch } from 'vue';
import SearchPanel from './components/UserSearchPanel/SearchPanel.vue';
import UserSimpleProfilePage from './components/UserSearchPanel/UserSimpleProfilePage.vue';
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
}

</style>


