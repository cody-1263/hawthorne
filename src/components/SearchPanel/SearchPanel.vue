

<script setup lang="ts">

import { inject, ref, watch } from 'vue';
import { htKeys } from '@/services/HtKeys';
import { HtStudyMode } from '@/services/HtAppService';
import type { DestinyUserProfile, DestinyClanProfile } from '@/domain/ProfileDataItems';
import SearchBar from './SearchBar.vue';
import SectionSelector from '../Common/SectionSelector.vue';
import LoadingIndicator from '../Common/LoadingIndicator.vue';
import UserListItem from './UserListItem.vue';
import ClanListItem from './ClanListItem.vue';

// services
const serviceContainer = inject(htKeys.htServiceContainerKey)!;
const domain = serviceContainer.domain;
const bnetProvider = serviceContainer.bungieNetProvider;
const appService = serviceContainer.htAppService;

// constants
const appModeOptions = ['USERS', 'CLANS'];

// refs
const appStudyMode = appService.studyMode;
const selectedUserRef = appService.selectedUserProfile;
const selectedClanCollection = appService.selectedClanProfileCollection;

const loadingIndicator = ref(false);
const searchTextRef = ref('');

const userSearchResultsRef = ref(new Array<DestinyUserProfile>());
const clanSearchResultsRef = ref(new Array<DestinyClanProfile>());

// emits
// const emit = defineEmits<{
//   (e: 'itemClicked', item: DestinyUserProfile): void
// }>();

/** calling this when searchText updates and we have to download new user list */
watch(searchTextRef, async (newSearchText, oldSearchText) => {
  loadingIndicator.value = true;
  
  // opt.1. single user search
  if (appStudyMode.value == HtStudyMode.SingleUser) {
    if (newSearchText.includes('#')) {
      let v = await bnetProvider.searchDestinyPlayerByBungieName(newSearchText, domain);
      if (v != null) userSearchResultsRef.value = [v];
    }
    else {
      let searchResultCollection = await bnetProvider.searchForUsers(newSearchText, domain);
      userSearchResultsRef.value = searchResultCollection;
    }
  }
  // opt.2. clan search
  else {
    let cc = await bnetProvider.searchForClans(newSearchText, domain);
    // console.log(cc);
    clanSearchResultsRef.value = cc;
  }

  loadingIndicator.value = false;
});

/** calling this when user clicks USER/CLAN selector */
function onSelectedModeChanged(stringItem: string, selectedIndex: number) {
  if (selectedIndex == 0) {
    appStudyMode.value = HtStudyMode.SingleUser;
  }
  else if (selectedIndex == 1) {
    appStudyMode.value = HtStudyMode.ClanCollection;
  }
}

/** calling this when SearchBar's search text has been updated */
function onSearchTextChanged(newSearchText : string) {
  searchTextRef.value = newSearchText;
}

/** emitting selected items up to parent */
function onUserItemClicked(userProfile : DestinyUserProfile) {
  selectedUserRef.value = userProfile;
}

/** calling this when user clicks a clan item which adds it to selected clans collection */
function onClanItemClicked(clanItem: DestinyClanProfile) {
  let newClanSelection = new Array<DestinyClanProfile>();
  for (let c of selectedClanCollection.value) {
    if (c != clanItem) {
      newClanSelection.push(c);
    }
  } 
  newClanSelection.push(clanItem);
  selectedClanCollection.value = newClanSelection;
}

</script>




<template>

<div class="wrap">
  
  <!-- logo -->
  <div style="width: 100%">
    <div class="app-logo"> 
      <img style="width: 100%; height: 100%" src="./assets/ht-logo-transp.png"/>
    </div>
    <div class="app-title">cody's HT tool</div>
  </div>
  
  <!-- app mode selector: user/clan mode -->
  <div style="margin-top: 3rem; margin-left: auto; margin-right: auto;">
    <SectionSelector :string-items="appModeOptions" :initial-index="0" @selectedStringItemChanged="onSelectedModeChanged"/>
  </div>
  
  <!-- search text field -->
  <div style="margin-top: 1rem; margin-left: 1rem; margin-right: 1rem;">
    <SearchBar class="searchBar" @searchTextUpdated="(newSearchText) => onSearchTextChanged(newSearchText)"/>
  </div>
  
  <div style="height: 1rem;"></div>
  
  <!-- search results lists -->
  <div class="my-div" style="overflow: scroll;">
    
    <!-- user search results -->
    <div v-if="appStudyMode == HtStudyMode.SingleUser">
      <div v-for="userItem in userSearchResultsRef" style="padding: 0rem 0.5rem;">
        <UserListItem :userDescriptor="userItem" @itemClicked="onUserItemClicked"/>
      </div>
    </div>
    <!-- clan search results -->
    <div v-else-if="appStudyMode == HtStudyMode.ClanCollection">
      <div v-for="clanItem in clanSearchResultsRef" style="padding: 0rem 0.5rem;">
        <ClanListItem :clanProfile="clanItem" @itemClicked="onClanItemClicked"/>
      </div>
    </div>
    <!-- loading indicator -->
    <LoadingIndicator v-if="loadingIndicator" class="loading-indicator"/>
  </div>
</div>

  
  
</template>




<style scoped>

  .wrap {
    display: grid;
    grid-template-rows: auto auto auto auto 1fr;
    height: 100%;
  }


  .app-logo {
    width: 3rem;
    height: 3rem;
    margin-left: auto;
    margin-right: auto;
    margin-top: 2rem;
  }

  .app-title {
    font-size: 1.2rem;
    color: #fff;
    font-weight: 700;
    text-align: center;
    margin-top: 1rem;
  }
  


  .my-div {
    background: transparent;
    scrollbar-width: none;
  }
  .my-div::-webkit-scrollbar { 
    display: none;
  }
  
  .searchBar {  
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .loading-indicator {
    margin-left: auto;
    margin-right: auto;
    margin-top: 4rem;
  }
</style>