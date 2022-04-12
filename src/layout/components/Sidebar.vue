<template>
  <TreeNode
    :treeData="treeData"
    @addTreeNode="addTreeNode"
    @delTreeNode="delTreeNode"
    @editTreeNode="editTreeNode"
    @renameTreeNode="renameTreeNode"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue"; //
import TreeNode from "@/views/tree-node/index.vue";

export default defineComponent({
  name: "sidebar",
  components: {
    TreeNode,
  },
  props: {
    treeData: Array,
    addTreeNode: Function,
    delTreeNode: Function,
    editTreeNode: Function,
    renameTreeNode: Function,    
  },
});
</script>
