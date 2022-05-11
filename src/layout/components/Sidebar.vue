<template>
  <TreeNode
    :treeData="treeData"
    @addTreeNode="addTreeNode"
  />
</template>

<script lang="ts" setup>
import { defineComponent, reactive, toRefs } from "vue"; //
import TreeNode from "@/views/tree-node/index.vue";
import { defineProps } from '@vue/runtime-core';
import type { PropType } from '@vue/runtime-core'; 

// type User = { name: string; password: string };
const props = defineProps({
    treeData: Array,
    addTreeNode: Function,
        // type: Object as PropType<User>,
})
// const emit = defineEmits(['change', 'delete'])

</script>
