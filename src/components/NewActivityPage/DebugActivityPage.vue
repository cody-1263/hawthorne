<script setup lang="ts">

import { htKeys } from '@/services/HtKeys';
import { ref, inject } from 'vue';
import { ActivityCalculatorNew } from '@/model/ActivityCalculatorNew';
import LoadingIndicator from '../Common/LoadingIndicator.vue';
import { HtActivityType, HtPeriodMode } from '@/services/HtAppService';

// services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;
const appService = serviceContainer.htAppService;

// const
const someStringNumbers = ['0','4','8','12','16','20','24'];

</script>

<template>
  
  <div style="height: 2rem;"></div>
  <div><img src="@/assets/sticker-01.png"></div>
  <div style="height: 2rem;"></div>
  <button>_ reload all _</button>
  <div style="height: 2rem;"></div>
  
  <div> my custom text </div>
  <div> my custom text </div>
  <div> my custom text </div>
  <div> my custom text </div>
  <div> my custom text </div>
  
</template>



<style scoped>


* {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 10pt;
  color: #fff9;
}

.clan-page-root {
  position: relative;
  border: dashed 0px orange;
  border-radius: 0.4rem;
}

.clan-page-root-debugcaption {
  position: absolute;
  left:0rem;
  top:-0.3rem;
  color: orange;
  font-size: 9pt; 
  opacity: 0;
}


.clan-page-nodata-container {
  height: 24rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  /* border: dashed 2px blueviolet;
  border-radius: 0.4rem; */
}

</style>