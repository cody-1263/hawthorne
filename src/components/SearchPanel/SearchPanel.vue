

<script setup lang="ts">

import { inject, ref, watch } from 'vue';
import { htKeys } from '@/services/HtKeys';
import type { DestinyUserProfile } from '@/domain/ProfileDataItems';
import UserListPanel from './UserListPanel.vue';
import SearchBar from './SearchBar.vue';
import LoadingIndicator from '../Common/LoadingIndicator.vue';


const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;

const emit = defineEmits<{
  (e: 'itemClicked', item: DestinyUserProfile): void
}>();

const loadingIndicator = ref(false);
const searchTextRef = ref('');
const dataListRef = ref(new Array<DestinyUserProfile>());

/** calling this when searchText updates and we have to download new user list */
watch(searchTextRef, async (newSearchText, oldSearchText) => {
  loadingIndicator.value = true;
  
  if (newSearchText.includes('#')) {
    let v = await bnetProvider.searchDestinyPlayerByBungieName(newSearchText, domain);
    if (v != null) dataListRef.value = [v];
  }
  else {
    let searchResultCollection = await bnetProvider.searchForUsers(newSearchText, domain);
    dataListRef.value = searchResultCollection;
  }
  
  
  
  loadingIndicator.value = false;
});

/** calling this when SearchBar's search text has been updated */
function onSearchTextChanged(newSearchText : string) {
  searchTextRef.value = newSearchText;
}

/** emitting selected items up to parent */
function onInnerItemClicked(ud : DestinyUserProfile) {
  emit("itemClicked", ud);
}

</script>




<template>

<div class="wrap">
  <div style="width: 100%">
    <div class="app-logo"> 
      <img style="width: 100%; height: 100%" src="@/assets/ht-logo-transp.png"/>
    </div>
    <div class="app-title">cody's HT tool</div>
  </div>
  
  
  <div style="margin-top: 2rem; margin-left: 1rem; margin-right: 1rem;">
    <SearchBar class="searchBar" @searchTextUpdated="(newSearchText) => onSearchTextChanged(newSearchText)"/>
  </div>
  
  <div style="height: 1rem;"></div>
  
  <div class="my-div" style="overflow: scroll;">
    <UserListPanel v-if="loadingIndicator == false" :userList="dataListRef" @item-clicked="onInnerItemClicked"/>
    <LoadingIndicator v-else class="loading-indicator"/>
  </div>
</div>

  
  
</template>




<style scoped>

  .wrap {
    display: grid;
    grid-template-rows: auto auto auto 1fr;
    height: 100%;
  }


  .app-logo {
    width: 3rem;
    height: 3rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
  }

  .app-title {
    font-size: 1.2rem;
    color: #fff;
    font-weight: 700;
    text-align: center;
    margin-top: 1rem;
  }
  


  .my-div {
    background: transparent;
    scrollbar-width: none;
  }
  .my-div::-webkit-scrollbar { 
    display: none;
  }
  
  .searchBar {  
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .loading-indicator {
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }
</style>