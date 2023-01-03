

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
  
  
  
  dataProvider.searchForUsers(newSearchText).then((v) =>  {
    //console.log(v); 
    let arr = v.Response.searchResults;
    
    for (let item of arr) {
      let name = item.bungieGlobalDisplayName;
      let code = item.bungieGlobalDisplayNameCode;
      let bungieMemberId = 25075509;
      let destinyMemberId = item.destinyMemberships[0].membershipId;
      
      let str = `${name}#${code}\r\n${destinyMemberId}`;
      console.log(str);
      
    }
    
    // console.log(JSON.stringify(v.Response));
    
  });
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