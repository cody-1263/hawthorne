
<script lang="ts">
export default {
  props:  {
    caption: String,
    userList: Array<DestinyUserDescriptor>,
  }
}
</script>



<script setup lang="ts">
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';
import UserListItem from './UserListItem.vue';
</script>




<template>
  
  <!-- <p> {{ caption }} </p> -->
  
  <div v-for="userItem in userList">
    <UserListItem :shortUserName="userItem.displayName" 
                  :fullUserName="userItem.bungieGlobalDisplayName" 
                  :iconUrl1="userItem.characterDescriptors[0]?.emblemPath"
                  :iconUrl2="userItem.characterDescriptors[1]?.emblemPath"
                  :iconUrl3="userItem.characterDescriptors[2]?.emblemPath"/>
  </div>
  
</template>