<template>
  <div>
    <!-- <p>{{ tabActiveName }}</p><br/> -->
    <el-tabs
      v-model="activeName"
      type="card"
      @tab-click="handleClick"
      closable
      @tab-remove="handleRemoveTab"
    >
      <!-- <el-tab-pane label="SQL编辑器" name="0">
        <SQLEditor />
      </el-tab-pane>
      <el-tab-pane label="查询表数据" name="1">
        <TableEditor />
      </el-tab-pane> -->
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
// import SQLEditor from "../../components/SQLEditor.vue";
// import TableEditor from "../../components/TableEditor.vue";

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


<style scoped>
.table-edit {
  height: 100%;
  background-color: white;
}
.el-table .success-row {
  background-color: #dedede;
}
.el-tabs {
  width: 100%;
}
</style>