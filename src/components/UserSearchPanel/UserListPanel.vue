
<script>
export default {
  props:  {
    caption: String,
    userList: Array,
  }
}
</script>



<script setup>
import UserListItem from './UserListItem.vue';
</script>




<template>
  
  <p> {{ caption }} </p>
  
  <div v-for="userItem in userList">
    <UserListItem :shortUserName="userItem.displayName" :fullUserName="userItem.bungieGlobalDisplayName" :iconUrl="userItem.iconPath"/>
  </div>
  
</template>