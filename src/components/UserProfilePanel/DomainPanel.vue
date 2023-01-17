



<script setup lang="ts">
import { ref, watch, inject  } from 'vue';
import { htKeys } from '@/services/HtKeys';

const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;

const userDescriptorRef = inject(htKeys.selectedUsedDescriptorKey)!;

const dataText = ref(new Array<string>());

watch(userDescriptorRef, () => {
  let text = new Array<string>();
  text.push(`[DOMAIN] clans (${domain._clanProfilesMap.size})`);
  for (let c of domain._clanProfilesMap) {
    let clan = c[1];
    text.push(`\t${clan.groupId} : [${clan.clanCallsign}] : ${clan.name}`);
  }
  text.push(`[DOMAIN] users (${domain._userProfilesMap.size})`);
  for (let c of domain._userProfilesMap) {
    let user = c[1];
    text.push(`${user.bnetId} : ${user.bungieGlobalDisplayName}`);
  }
  dataText.value = text;
});


</script>


<template>
  
<div style="display: block; font-family: monospace; font-size: 0.9rem; padding: 0.5rem 1rem; opacity: 0.75; color: greenyellow; background: #112233; margin-top: 2rem;">
  
  
  <div v-for="t of dataText"> {{ t }} </div>
  
</div>
  
</template>