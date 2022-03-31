<template>
  <TreeNode :treeData="treeData" @queryRoot="queryRoot"/>
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
    queryRoot:Function
  },
});
</script>
