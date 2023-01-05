

<script setup lang="ts">

import { ref, watch } from 'vue';

import UserListPanel from './UserListPanel.vue';
import SearchBar from './SearchBar.vue';
import UserDataProvider from '../../model/UserDataProvider.js';

const dataProvider = new UserDataProvider();
const data = dataProvider.GetUsersTest();
const myCaption = 'Huh?';

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

</script>




<template>
  
  <div style="padding: 0.2rem;">
    <SearchBar @searchTextUpdated="(newSearchText) => onSearchTextChanged(newSearchText)"/>
  </div>
  
  <div class="my-div">
    <UserListPanel :userList="dataListRef" :caption="myCaption"/>
  </div>
  
</template>




<style scoped>
  .my-div {background: #222;}
</style>