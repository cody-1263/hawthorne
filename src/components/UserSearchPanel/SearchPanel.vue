

<script setup>

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
  let dataItems = dataProvider.GetUsersTest();
  dataListRef.value = dataItems.filter((o) => o.destinyName.includes(newSearchText));
});

function onSearchTextChanged(newSearchText) {
  searchTextRef.value = newSearchText;
}

</script>




<template>
  
  <div >
    <SearchBar @searchTextUpdated="(newSearchText) => onSearchTextChanged(newSearchText)"/>
  </div>
  
  <div class="my-div">
    <UserListPanel :userList="dataListRef" :caption="myCaption"/>
  </div>
  
</template>




<style scoped>
  .my-div {background: #222;}
</style>