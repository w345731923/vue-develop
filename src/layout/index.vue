<template>
  <div class="theme_flex_column">
    <el-header>
      <v-header @addTreeNode="addTreeNode" @addTable="addTable" @addSQLEditor="addSQLEditor"
        @openTableView="openTableView" />
    </el-header>
    <div class="split_flex_row">
      <vSidebar class="pane_flex left home" :treeData="state.treeData" @addTreeNode="addTreeNode" @addTable="addTable"
        @openTableView="openTableView" />
      <div class="resizer_controls" @mousedown="drag($event)"></div>
      <vContent class="pane_flex right" :tabActiveName="state.tabActiveName" :editableTabs="state.editableTabs"
        @modifyTitle="modifyTitle" @modifyTabCurrent="modifyTabCurrent" @closeTab="closeTab" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, unref, watchEffect } from "vue";
import { reactive, onMounted } from "vue";
import { getRoot } from "@/api/treeNode";
import { ResponseData, TreeNode, ServerGroupForm, TableSimple, EditableTabs } from "@/types";

interface TreeNodeState {
  treeData: TreeNode<any>[]; //tree data
  dialogGroupVisible: boolean; //group dialog
  dialogGroupStatus: string; //group create or edit
  dialogGroupObj: ServerGroupForm;
  editableTabs: EditableTabs[];
  tabActiveName: string;
}
import vHeader from "@/layout/components/Header.vue";
import vSidebar from "@/layout/components/Sidebar.vue";
import vContent from "@/layout/components/Content.vue";
import { getNodePath, getNodePathServerName } from "@/utils/tree";
import Node from "element-plus/es/components/tree/src/model/node";

/**
 * created（创建）-> mounted（加载）-> updated（更新）-> unmounted（卸载）
 * https://v3.vuejs.org/guide/instance.html#lifecycle-diagram
 */
export default defineComponent({
  name: "LayoutIndex",
  components: {
    vHeader,
    vSidebar,
    vContent,
    // CreateTable,
  },
  setup() {
    onMounted(() => {
      // dragSQLEditor();
      //清空缓存数据
      sessionStorage.setItem("tabId", '');
      sessionStorage.setItem("create-sqleditor", '');
      sessionStorage.setItem("table-design-session", "");
    });
    //TreeNodeState
    const state: TreeNodeState = reactive({
      treeData: [], //树形菜单
      dialogGroupVisible: false,
      dialogGroupStatus: "",
      dialogGroupObj: { serverGroupName: "" },
      editableTabs: [], //tab显示数组
      tabActiveName: "", //tab选中页
    });
    /**
     * 查询Root根下节点
     */
    const queryRoot = () => {
      getRoot().then((respon: ResponseData<TreeNode<any>[]>) => {
        state.treeData = respon.data;
      });
    };
    /**
     * 树形菜单添加节点
     */
    const addTreeNode = (type: string, parent: any, node: any) => {
      if (type == "ServerGroup") {
        state.treeData.push(node);
      } else if (type == "Server") {
        if (parent) {
          alert("addTreeNode parent");
        } else {
          state.treeData.push(node);
        }
      }
      console.log(state.treeData);
    };

    // 打开表
    const openTableView = (id: string, title: string, node: Node) => {
      console.log("layout open table");
      const index = state.editableTabs.findIndex((item) => (item.title == title));

      console.log("LayoutIndex openTable index = ", index);
      // TODO 除了index > -1，还应该检查Tab的类型，因为对同一张表的打开表与设计表目前的title一样
      if (index > -1 && title.indexOf('newtable@') != -1) {
        state.tabActiveName = state.editableTabs[index].name;
      } else {
        sessionStorage.setItem("tabId", id);
        const nodePath = getNodePath(node);
        const selectTableNode: TreeNode<TableSimple> = node.data as TreeNode<TableSimple>;
        selectTableNode.nodePath = nodePath;
        sessionStorage.setItem("openTableNode", JSON.stringify(selectTableNode)),
          state.editableTabs.push({
            title: title,
            name: id,
            currentView: "table-editor",
          });

        state.tabActiveName = id;
      }
    }
    /**
     * 添加tabs页,SQL编辑器
     */
    const addSQLEditor = () => {
      console.log("LayoutIndex addSQLEditor");
      const tabId = 'sql' + new Date().getTime();
      let newTitle = `*<localhost>无标题`;
      //获取左侧树形菜单的数据
      const val = sessionStorage.getItem("create-sqleditor");
      if (val) {
        const treeData = JSON.parse(val);
        console.log('treeData', treeData.nodePath)
        //是否打开连接，打开连接才会传默认值
        if (treeData.connectionId != null && treeData.connectionId != '')
          newTitle = '<' + getNodePathServerName(treeData.nodePath) + '>无标题';
      }
      state.editableTabs.push({
        title: newTitle,
        name: tabId,
        currentView: "sqleditor",
        // content: <SQLEditor identity={tabId} />,        
      });
      state.tabActiveName = tabId;
    };
    //添加tabs页
    const addTable = (id: string, title: string) => {
      console.log("LayoutIndex addTable state.editableTabs = ", title, state.editableTabs);
      const index = state.editableTabs.findIndex((item) => (item.title == title));
      console.log("LayoutIndex addTable index = ", index);

      if (index > -1 && title.indexOf('newtable@') == -1) {
        //不是新建表，并且设计表已经打开过
        state.tabActiveName = state.editableTabs[index].name;
      } else {
        //首次打开
        sessionStorage.setItem("tabId", id);
        state.editableTabs.push({
          title: title,
          name: id,
          currentView: "table-create",
        });
        state.tabActiveName = id;
      }
      console.log("LayoutIndex addTable state.tabActiveName = ", state.tabActiveName);
    };
    //修改tab标题
    const modifyTitle = (tabId: string, title: string) => {
      console.log("LayoutIndex 修改tab标题 tabId，title = ", tabId, title);
      const index = state.editableTabs.findIndex((item) => (item.name == tabId));
      console.log("LayoutIndex 修改tab标题 index = ", index);
      state.editableTabs[index].title = title;
    };
    //切换tab选中页
    const modifyTabCurrent = (tabId) => {
      state.tabActiveName = tabId;
    };
    //关闭tab页
    const closeTab = (tabId: string) => {
      const index = state.editableTabs.findIndex((item) => (item.name = tabId));
      state.editableTabs.splice(index, 1)
    };
    onMounted(() => {
      queryRoot();
    });
    /**
     * 拖动树形菜单的边框
     */
    const drag = (event: any) => {
      const left = document.getElementsByClassName("left")[0] as HTMLElement;
      // 鼠标拖动事件
      document.onmousemove = function (e) {
        const moveX = e.clientX;
        console.log("moveX", moveX);
        left.style.minWidth = moveX + "px";
        left.style.maxWidth = "0px";
      };
      // 鼠标松开事件
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      return false;
    };
    return {
      state,
      queryRoot,
      addTreeNode,
      addTable,
      addSQLEditor,
      openTableView,
      drag,
      modifyTitle,
      modifyTabCurrent,
      closeTab,
    };
  },
  mounted() {
  },
  methods: {
  },
});
</script>
<style>
.el-header {
  background-color: #2a7cb4;
  color: white;
  text-align: center;
}

.split_flex_row .home:first-child {
  position: relative;
  flex: 0 1 auto;
}

.split_flex_row .home:last-child {
  overflow: hidden;
}
</style>