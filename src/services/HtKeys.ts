import type { InjectionKey } from 'vue';
import type { Ref } from 'vue';
import type { HtServiceContainer } from './HtServiceContainer';
import type { DestinyUserProfile } from '@/domain/ProfileDataItems';




class HtKeys {
  
  /** Application service container key */
  htServiceContainerKey = Symbol() as InjectionKey<HtServiceContainer>;
  
   /** Selected user descriptor key */
  selectedUsedDescriptorKey = Symbol() as InjectionKey<Ref<DestinyUserProfile|null>>;
  
}




/** Instance of HtKeys to use in components */
export const htKeys = new HtKeys();
