import type { InjectionKey } from 'vue';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { type HtServiceContainer } from './HtServiceContainer';
import type { DestinyUserProfile, DestinyClanProfile } from '@/domain/ProfileDataItems';



export class HtAppService {
  
  selectedUserProfile : Ref<DestinyUserProfile | null>;
  selectedClanProfileCollection : Ref<DestinyClanProfile[]>;
  
  studyMode : Ref<HtStudyMode>;
  studyPeriod : Ref<HtPeriodMode>;
  studyActivity : Ref<HtActivityType>;
  
  
  studyPeriodCodes : string[];
  studyActivityCodes : string[];
  
  
  constructor() {
    this.selectedUserProfile = ref(null);
    this.selectedClanProfileCollection = ref(new Array<DestinyClanProfile>());
    
    this.studyMode = ref(HtStudyMode.SingleUser);
    this.studyPeriod = ref(HtPeriodMode.OneYear);
    this.studyActivity = ref(HtActivityType.All);
    
    this.studyPeriodCodes = ['1 MONTH','3 MONTHS','6 MONTHS','YEAR','ALL TIME'];
    this.studyActivityCodes = ['ALL','RAIDS','PvP','TRIALS','GMs'];
  }
  
}





/** HT app research object: do we work with users or clans */
export enum HtStudyMode {
  SingleUser,
  ClanCollection,
}


/** HT app target period: how much data do we analyze */
export enum HtPeriodMode {
  OneMonth,
  ThreeMonths,
  SixMonths,
  OneYear,
  AllTime
}

/** HT app target activity type: what kind of activities do we use */
export enum HtActivityType {
  All,
  Raids,
  AllPvP,
  Trials,
  GMs,
}