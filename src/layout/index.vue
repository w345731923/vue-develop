<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <v-header :fatherMethod="fatherMethod" :addSQLTab="addSQLTab" />
      </el-header>
      <el-container>
        <v-sidebar class="_pane" style="min-width: 240px" />
        <div class="resizer-controls"></div>
        <v-content
          class="_pane"
          :isTable="isTable"
          :isSqlEdit="isSqlEdit"
          :editableTabs="editableTabs"
        />
      </el-container>
    </el-container>
  </div>
</template>

<script>
import vHeader from "./components/Header.vue";
import vSidebar from "./components/Sidebar.vue";
import vContent from "./components/Content.vue";
/**
 * created（创建）-> mounted（加载）-> updated（更新）-> unmounted（卸载）
 * https://v3.vuejs.org/guide/instance.html#lifecycle-diagram
 */
export default {
  name: "Home",
  data() {
    return {
      isTable: false,
      isSqlEdit: true,
      editableTabs: [],
    };
  },
  methods: {
    addSQLTab() {
      const newTabName = `${++this.tabIndex}`;
      this.editableTabs.push({
        title: "New Tab",
        name: newTabName,
        content: "New Tab content",
      });
      this.editableTabsValue = newTabName;
    },
    fatherMethod(key) {
      console.log("测试", key === "1");
      if (key === "1") {
        this.isTable = false;
        this.isSqlEdit = true;
      } else {
        this.isTable = true;
        this.isSqlEdit = false;
      }
    },
  },
  components: {
    vHeader,
    vSidebar,
    vContent,
  },
};
</script>
<style>
section.el-container.is-vertical {
  height: calc(100vh - 30px);
}
.el-main::-webkit-scrollbar {
  display: none;
}
.el-header {
  background-color: #2a7cb4;
  color: white;
  text-align: center;
}
.common-layout .el-main {
  /* background-color: #e9eef3; */
  color: var(--el-text-color-primary);
  padding: 0;
}
.common-layout .el-header {
  padding: 0;
}
._pane {
  display: flex;
  flex: 1 1 0%;
  z-index: 0;
}
._pane:first-child {
  position: relative;
  flex: 0 1 auto;
}
._pane:last-child {
  overflow: hidden;
}
.resizer-controls {
  position: relative;
  flex: 0 1 auto;
  width: 2px;
  cursor: col-resize;
  background-color: var(--mdc-theme-background, #dedede);
}
</style>