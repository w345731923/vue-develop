<template>
  <TreeNode :treeData="treeData" @addTreeNode="addTreeNode" @addTable="addTable" @openTableView="openTableView" />
</template>

<script lang="ts">
import { defineComponent } from "vue"; //
import TreeNode from "@/views/tree-node/index.vue";

export default defineComponent({
  name: "sidebar",
  components: {
    TreeNode,
  },
  props: {
    treeData: Array,
    addTreeNode: Function,
    addTable: Function,
    openTableView: Function,
  },
});
</script>
