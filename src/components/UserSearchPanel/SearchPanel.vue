

<script setup lang="ts">

import { ref, watch } from 'vue';

import UserListPanel from './UserListPanel.vue';
import SearchBar from './SearchBar.vue';
import LoadingIndicator from './LoadingIndicator.vue';
import UserDataProvider from '@/model/UserDataProvider';
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';

const emit = defineEmits<{
  (e: 'itemClicked', item: DestinyUserDescriptor): void
}>();

const dataProvider = new UserDataProvider();
const data = dataProvider.GetUsersTest();

const loadingIndicator = ref(false);
const searchTextRef = ref('');
const dataListRef = ref();
dataListRef.value = data;

/** calling this when searchText updates and we have to download new user list */
watch(searchTextRef, async (newSearchText, oldSearchText) => {
  loadingIndicator.value = true;
  if (newSearchText.includes('#')) {
    let userItem = await dataProvider.searchDestinyPlayerByBungieName(newSearchText);
    dataListRef.value = [ userItem ];
  }
  else {
    let userCollection = await dataProvider.searchForUsers(newSearchText);
    dataListRef.value = userCollection;
  }
  loadingIndicator.value = false;
});

/** calling this when SearchBar's search text has been updated */
function onSearchTextChanged(newSearchText : string) {
  searchTextRef.value = newSearchText;
}

/** emitting selected items up to parent */
function onInnerItemClicked(ud : DestinyUserDescriptor) {
  emit("itemClicked", ud);
}

</script>




<template>
  
  <div style="padding: 0.2rem;">
    <SearchBar class="searchBar" @searchTextUpdated="(newSearchText) => onSearchTextChanged(newSearchText)"/>
  </div>
  
  <div style="height: 1rem;"></div>
  
  <div class="my-div">
    <UserListPanel v-if="loadingIndicator == false" :userList="dataListRef" @item-clicked="onInnerItemClicked"/>
    <LoadingIndicator v-else class="loading-indicator"/>
  </div>
  
</template>




<style scoped>
  .my-div {background: transparent;}
  
  .searchBar {  
    width: 90%;
  }
  
  .loading-indicator {
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }
</style>