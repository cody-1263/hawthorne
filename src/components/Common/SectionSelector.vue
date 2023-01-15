

<!-- script setup -->
<script setup lang="ts">
import { ref } from 'vue';
import { SelectorItem } from './SectionSelectorClasses';

const props = defineProps<{
  stringItems: string[],
}>();

const emit = defineEmits<{
  (e: 'selectedStringItemChanged', stringItem: string, selectedIndex: number): void
}>();

const selectorItemsRef = ref<SelectorItem[]>(new Array<SelectorItem>());
const selectedItemRef = ref<SelectorItem | null>(null);

var arr = new Array<SelectorItem>();
for (let str of props.stringItems) {
  let item = new SelectorItem();
  item.stringValue = str;
  item.caption = str;
  arr.push(item);
}
selectorItemsRef.value = arr;

function onItemClick(e : MouseEvent, targetItem : SelectorItem) {
  
  if (targetItem == selectedItemRef.value)
    return;
    
  let selectedIndex = -1;
  
  for (let i = 0; i < selectorItemsRef.value.length; i++) {
    
    let item = selectorItemsRef.value[i];
    
    if (item != targetItem && item.isSelected == true) {
      item.isSelected = false;
    }
    if (item == targetItem && item.isSelected == false) {
      item.isSelected = true;
      selectedIndex = i;
    }
  }
  
  emit('selectedStringItemChanged', targetItem.stringValue, selectedIndex);
}

</script>




<!-- template -->
<template>
<div class="sectionselectorvue-root">
  
  <button v-for="selItem of selectorItemsRef" class="selitem" :class="{ selected: selItem.isSelected, notselected: !selItem.isSelected }" @click="(e) => onItemClick(e, selItem)">
    {{ selItem.caption }}
  </button>
  
</div>
</template>




<!-- styles -->
<style scoped>

.sectionselectorvue-root {
  display: flex;
  flex-direction: row;
  gap: 0.2rem;
}

.selitem {
  height: 2rem;
  border: none;
  border-radius: 0.6rem;
  padding: 0.4rem 1rem; 
}

.selected {
  background: #eee;
  color: #222;
}
.notselected {
  background: #00000000;
}
.notselected:hover {
  background: #fff1;
}


</style>