import type { InjectionKey } from 'vue';
import type { DestinyUserDescriptor } from '@/model/DestinyUserDescriptor';
import type { Ref } from 'vue';



export const selectedUsedDescriptorKey = Symbol() as InjectionKey<Ref<DestinyUserDescriptor|null>>;
