




<script setup lang="ts">
import type { DestinyUserDescriptor, DestinyCharacterDescriptor } from '@/model/DestinyUserDescriptor';

const props = defineProps<{
  userDescriptor: DestinyUserDescriptor | null
}>();

const emit = defineEmits<{
  (e: 'itemClicked', item: DestinyUserDescriptor): void
}>();

</script>




<template>
  <div v-if="userDescriptor != null">
    <h1>{{ userDescriptor.bungieGlobalDisplayName }}</h1>
  </div>
  <div v-else>
    <p>Select user</p>
  </div>
</template>




<style scoped>


</style>