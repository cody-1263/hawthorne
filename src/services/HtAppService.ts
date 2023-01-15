import type { InjectionKey } from 'vue';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { type HtServiceContainer, HtApplicationResearchObjectMode } from './HtServiceContainer';
import type { DestinyUserProfile, DestinyClanProfile } from '@/domain/ProfileDataItems';



export class HtAppService {
  
  selectedUserProfile : Ref<DestinyUserProfile | null>;
  
  selectedClanProfileCollection : Ref<DestinyClanProfile[]>;
  
  selectedResearchObjectMode : Ref<HtApplicationResearchObjectMode>;
  
  
  constructor() {
    this.selectedUserProfile = ref(null);
    this.selectedClanProfileCollection = ref(new Array<DestinyClanProfile>());
    this.selectedResearchObjectMode = ref(HtApplicationResearchObjectMode.SingleUser);
  }
  
}