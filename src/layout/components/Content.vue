<template>
  <div class="_content">
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      closable
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <component :is="item.content"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "vContent",
  props: {
    tabActiveName: {
      type: String,
      dafault: () => "0",
    },
    editableTabs: {
      type: Array,
      dafault: () => [],
    },
    removeTab: {
      type: Function,
      default: null,
    },
  },
  components: {
    // SQLEditor,
    // TableEditor,
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleRemoveTab(targetName) {
      this.removeTab(targetName);
    },
  },
  watch: {
    tabActiveName: {
      immediate: true,
      handler(val) {
        this.activeName = val;
      },
    },
  },
};
</script>


<style >
.el-tabs {
  width: 100%;
}
._content .el-tabs .el-tabs__header {
  margin: 0;
}
</style>