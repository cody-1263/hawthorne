
<script setup lang="ts">
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';
import UserListItem from './UserListItem.vue';

const props = defineProps<{
  userList: Array<DestinyUserDescriptor>,
}>();

const emit = defineEmits(['itemClicked']);

function onInnerItemClicked(ud : DestinyUserDescriptor) {
  emit('itemClicked', ud);
}

</script>




<template>
  
  <!-- <p> {{ caption }} </p> -->
  
  <div v-for="userItem in userList" style="padding: 0rem 0.5rem;">
    <UserListItem :userDescriptor="userItem"
                  :shortUserName="userItem.displayName" 
                  :fullUserName="userItem.bungieGlobalDisplayName" 
                  :iconUrl1="userItem.characterDescriptors[0]?.emblemPath ?? null"
                  :iconUrl2="userItem.characterDescriptors[1]?.emblemPath ?? null"
                  :iconUrl3="userItem.characterDescriptors[2]?.emblemPath ?? null"
                  @itemClicked="onInnerItemClicked"/>
  </div>
  
</template>