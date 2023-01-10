import type { InjectionKey } from 'vue';
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';
import type { Ref } from 'vue';
import type { HtServiceContainer } from './HtServiceContainer';




class HtKeys {
  
  /** Application service container key */
  htServiceContainerKey = Symbol() as InjectionKey<HtServiceContainer>;
  
   /** Selected user descriptor key */
  selectedUsedDescriptorKey = Symbol() as InjectionKey<Ref<DestinyUserDescriptor|null>>;
  
}




/** Instance of HtKeys to use in components */
export const htKeys = new HtKeys();
