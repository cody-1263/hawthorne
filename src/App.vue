
<!-- 
  
  This is App.vue
  
-->



<script setup lang="ts">
import { ref, provide } from 'vue';
import { htKeys } from '@/services/HtKeys';
import SearchPanel from './components/SearchPanel/SearchPanel.vue';
import ClanPage from './components/ClanProfilePanel/ClanPage.vue';
import UserSimpleProfilePage from './components/UserProfilePanel/_UserPage.vue';
import { HtServiceContainer } from '@/services/HtServiceContainer';
import { HtStudyMode } from './services/HtAppService';
import ClanGroupActivitiesPage from './components/ClanProfilePanel/ClanGroupActivitiesPage.vue';

const serviceContainer = new HtServiceContainer();
provide(htKeys.htServiceContainerKey, serviceContainer);

const appStudyMode = serviceContainer.htAppService.studyMode;


</script>




<template>
<div class="main">
  <div>
    <SearchPanel/>
  </div>
  <div class="main-rightpane">
    <UserSimpleProfilePage v-if="appStudyMode == HtStudyMode.SingleUser"/>
    <!-- <ClanPage v-if="appStudyMode == HtStudyMode.ClanCollection"/> -->
    <ClanGroupActivitiesPage v-if="appStudyMode == HtStudyMode.ClanCollection"/>
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


