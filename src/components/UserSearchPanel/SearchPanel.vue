

<script setup lang="ts">

import { ref, watch } from 'vue';

import UserListPanel from './UserListPanel.vue';
import SearchBar from './SearchBar.vue';
import UserDataProvider from '@/model/UserDataProvider';
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';

const emit = defineEmits<{
  (e: 'itemClicked', item: DestinyUserDescriptor): void
}>();

const dataProvider = new UserDataProvider();
const data = dataProvider.GetUsersTest();

const searchTextRef = ref('');
const dataListRef = ref();
dataListRef.value = data;

watch(searchTextRef, async (newSearchText, oldSearchText) => {
  // let dataItems = dataProvider.GetUsersTest();
  // dataListRef.value = dataItems.filter((o) => o.bungieGlobalDisplayName.includes(newSearchText));
  
  if (newSearchText.includes('#')) {
    dataProvider.searchDestinyPlayerByBungieName(newSearchText).then((userDescriptor) => {
      // console.log(userDescriptor);
      dataListRef.value = [ userDescriptor ];
    });
  }
  else {
    dataProvider.searchForUsers(newSearchText).then((userCollection) =>  {
      // console.log(userCollection);
      dataListRef.value = userCollection;
    });
  }
  
  
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
    <UserListPanel :userList="dataListRef" @item-clicked="onInnerItemClicked"/>
  </div>
  
</template>




<style scoped>
  .my-div {background: transparent;}
  
  .searchBar {  
    width: 90%;
  }
</style>