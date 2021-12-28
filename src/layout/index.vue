<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <v-header :addSQLTab="addSQLTab" />
      </el-header>
      <el-container>
        <v-sidebar class="_pane" style="min-width: 240px" />
        <div class="resizer-controls"></div>
        <v-content
          class="_pane"
          :tabActiveName="tabActiveName"
          :editableTabs="editableTabs"
          :removeTab="removeTab"
        />
      </el-container>
    </el-container>
  </div>
</template>

<script>
import vHeader from "./components/Header.vue";
import vSidebar from "./components/Sidebar.vue";
import vContent from "./components/Content.vue";
import SQLEditor from "../components/SQLEditor.vue";
import TableEditor from "../components/TableEditor.vue";

/**
 * created（创建）-> mounted（加载）-> updated（更新）-> unmounted（卸载）
 * https://v3.vuejs.org/guide/instance.html#lifecycle-diagram
 */
export default {
  name: "Home",
  data() {
    return {
      editableTabs: [], //tab显示数组
      tabActiveName: "", //tab选中页
    };
  },
  components: {
    vHeader,
    vSidebar,
    vContent,
    // SQLEditor,
    // TableEditor
  },
  methods: {
    /**
     * 添加tab
     */
    addSQLTab(event) {
      const name = new Date().getTime();
      if (event.index === "1") {
        const newTabName = `*<localhost>无标题`;
        console.log("name", name);
        this.editableTabs.push({
          title: newTabName,
          name: name,
          content: <SQLEditor />,
        });
      } else {
        const newTabName = `newTable@postgres.public(localhost)`;
        this.editableTabs.push({
          title: newTabName,
          name: name,
          content: <TableEditor />,
        });
      }
      this.tabActiveName = name;
    },
    /**
     * 移除tab
     */
    removeTab(targetName) {
      const tabs = this.editableTabs;
      let activeName = this.tabActiveName;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.tabActiveName = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
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