<template>
  <div class="theme_flex_column">
    <el-header>
      <v-header @addTreeNode="addTreeNode" @addTable="addTable" @addSQLEditor="addSQLEditor"
        @openTableView="openTableView" />
    </el-header>
    <div class="split_flex_row">
      <vSidebar class="pane_flex left home" :treeData="state.treeData" @addTreeNode="addTreeNode" @addTable="addTable"
        @openTableView="openTableView" ref="ruleFormRef" />
      <div class="resizer_controls" @mousedown="drag($event)"></div>
      <vContent class="pane_flex right home" :tabActiveName="state.tabActiveName" :editableTabs="state.editableTabs"
        @modifyTitle="modifyTitle" @modifyTabCurrent="modifyTabCurrent" @closeTab="closeTab" />
      <!-- :removeTab="removeTab" -->
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, unref, watchEffect } from "vue";
import { reactive, onMounted } from "vue";
import { getRoot } from "@/api/treeNode";
import { ResponseData, TreeNode, ServerGroupForm, TableSimple } from "@/types";

interface TreeNodeState {
  treeData: TreeNode<any>[]; //tree data
  dialogGroupVisible: boolean; //group dialog
  dialogGroupStatus: string; //group create or edit
  dialogGroupObj: ServerGroupForm;
  editableTabs: { name: string, title: string; currentView: any }[];
  tabActiveName: string;
}
import vHeader from "@/layout/components/Header.vue";
import vSidebar from "@/layout/components/Sidebar.vue";
import vContent from "@/layout/components/Content.vue";
import { getNodePath } from "@/utils/tree";
import Node from "element-plus/es/components/tree/src/model/node";
import sqleditor from "../components/SQLEditor.vue";
// import CreateTable from "../components/table/index.vue";
const ruleFormRef = ref<any>();

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
    const openTableView = (id: string, title: string, node : Node) => {
      console.log("layout open table");
      const index = state.editableTabs.findIndex((item) => (item.title == title));
      
      console.log("LayoutIndex openTable index = ", index);
      // TODO 除了index > -1，还应该检查Tab的类型，因为对同一张表的打开表与设计表目前的title一样
      if(index > -1 && title.indexOf('newtable@') != -1) {
        state.tabActiveName = state.editableTabs[index].name;
      } else {
        sessionStorage.setItem("tabId", id);
        const nodePath = getNodePath(node);
        const selectTableNode : TreeNode<TableSimple> = node.data as TreeNode<TableSimple>;
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
     * 添加tabs页
     * 添加SQL编辑器
     * @param id 
     * @param title 
     */
    const addSQLEditor = () => {
      console.log("LayoutIndex addSQLEditor");
      const tabId = 'sql' + new Date().getTime();
      const newTitle = `*<localhost>无标题`;
      state.editableTabs.push({
        title: newTitle,
        name: tabId,
        currentView: sqleditor,
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
    /**
     *
     */
    const toolsEvent = (key: string) => {
      // const currentTime = new Date().getTime();
      // let tabId = "";
      // console.log("toolsEvent key=", key);
      // if (key === "1") {
      //   //event.index=1 新建SQL编辑器
      //   const newTitle = `*<localhost>无标题`;
      //   tabId = "sql" + currentTime;
      //   state.editableTabs.push({
      //     title: newTitle,
      //     name: tabId,
      //     content: sqleditor,
      //   });
      //   // setTimeout(() => {
      //   //   dragControllerSQLEditor();
      //   // }, 500);
      //   // state.editableTabs.push({
      //   //   title: "New Tab",
      //   //   name: "aaaa",
      //   //   content: "New Tab content",
      //   // });
      //   state.tabActiveName = tabId;
      // }else if (event.index === "2") {
      //   /**
      //    * event.index=2 新建表
      //    */
      //   const newTitle = `newTable@postgres.public(localhost)`;
      //   tabId = "create-table" + currentTime;
      //   this.editableTabs.push({
      //     title: newTitle,
      //     name: tabId,
      //     content: <CreateTable />,
      //   });
      //   this.tabActiveName = tabId;
      // }
    };
    const dragControllerSQLEditor = () => {
      // console.log("editableTabs.length = ", this.editableTabs.length);
      // //页面header
      const elHeader = document.getElementsByClassName("el-header")[0];
      //tab页height不知为何获取为0，暂时写固定值40
      // const elTabsHeader = document.getElementsByClassName("el-tabs__header")[0]; //header
      const tabsHeader = { clientHeight: 40 };
      //工具栏高度
      // let toolHeight = 0;
      // this.editableTabs.forEach((element) => {
      //   if (element.name.startsWith("sql")) {
      //     toolHeight = document.getElementById(element.name).clientHeight;
      //   }
      // });
      let toolHeight = 400;

      const topHeight =
        elHeader.clientHeight + tabsHeader.clientHeight + toolHeight; //60+40+76
      //获取拖动层div，绑定事件
      const resize = document.getElementsByClassName("resizer_controls_column");
      // for (var i = 0; i < resize.length; i++) {
      //   const codemirrorObj =
      //     document.getElementsByClassName("codemirror")[i]; //code区域
      //   // 鼠标按下事件
      //   resize[i].onmousedown = function () {
      //     // 鼠标拖动事件
      //     document.onmousemove = function (e) {
      //       const moveY = e.clientY - topHeight; //移动位置-上方距离=sql编辑器高度
      //       // console.log("moveY", topHeight, e.clientY, moveY);
      //       codemirrorObj.style.minHeight = moveY + "px";
      //       codemirrorObj.style.maxHeight = "0px";
      //     };
      //     // 鼠标松开事件
      //     document.onmouseup = function () {
      //       document.onmousemove = null;
      //       document.onmouseup = null;
      //     };
      //     return false;
      //   };
      // }
    };

    return {
      state,
      queryRoot,
      addTreeNode,
      addTable,
      addSQLEditor,
      openTableView,
      drag,
      ruleFormRef,
      modifyTitle,
      modifyTabCurrent,
      closeTab,
    };
  },

  mounted() {
    // this.dragControllerDiv();
  },
  methods: {
    // dragControllerDiv() {
    // const resize = document.getElementsByClassName("resizer_controls")[0];
    // const left = document.getElementsByClassName("left")[0];
    // const mid = document.getElementsByClassName("mid")[0];
    // const box = document.getElementsByClassName("box")[0];
    // },
    //   /**
    //    * SQL编辑器页面，拖动中间层事件
    //    */
    //   dragControllerSQLEditor() {
    //     // console.log("editableTabs.length = ", this.editableTabs.length);
    //     // //页面header
    //     const elHeader = document.getElementsByClassName("el-header")[0];
    //     //tab页height不知为何获取为0，暂时写固定值40
    //     // const elTabsHeader = document.getElementsByClassName("el-tabs__header")[0]; //header
    //     const tabsHeader = { clientHeight: 40 };
    //     //工具栏高度
    //     let toolHeight = 0;
    //     this.editableTabs.forEach((element) => {
    //       if (element.name.startsWith("sql")) {
    //         toolHeight = document.getElementById(element.name).clientHeight;
    //       }
    //     });
    //     const topHeight =
    //       elHeader.clientHeight + tabsHeader.clientHeight + toolHeight; //60+40+76
    //     //获取拖动层div，绑定事件
    //     const resize = document.getElementsByClassName("resizer_controls_column");
    //     for (var i = 0; i < resize.length; i++) {
    //       const codemirrorObj = document.getElementsByClassName("codemirror")[i]; //code区域
    //       // 鼠标按下事件
    //       resize[i].onmousedown = function () {
    //         // 鼠标拖动事件
    //         document.onmousemove = function (e) {
    //           const moveY = e.clientY - topHeight; //移动位置-上方距离=sql编辑器高度
    //           // console.log("moveY", topHeight, e.clientY, moveY);
    //           codemirrorObj.style.minHeight = moveY + "px";
    //           codemirrorObj.style.maxHeight = "0px";
    //         };
    //         // 鼠标松开事件
    //         document.onmouseup = function () {
    //           document.onmousemove = null;
    //           document.onmouseup = null;
    //         };
    //         return false;
    //       };
    //     }
    //   },
    //   /**
    //    * 添加tab
    //    */
    //   toolsEvent(event) {
    //     const currentTime = new Date().getTime();
    //     let tabId = "";
    //     if (event.index === "1") {
    //       /**
    //        * event.index=1 新建SQL编辑器
    //        */
    //       const newTitle = `*<localhost>无标题`;
    //       tabId = "sql" + currentTime;
    //       this.editableTabs.push({
    //         title: newTitle,
    //         name: tabId,
    //         content: <SQLEditor identity={tabId} />,
    //       });
    //       setTimeout(() => {
    //         this.dragControllerSQLEditor();
    //       }, 500);
    //       this.tabActiveName = tabId;
    //     } else if (event.index === "2") {
    //       /**
    //        * event.index=2 新建表
    //        */
    //       const newTitle = `newTable@postgres.public(localhost)`;
    //       tabId = "create-table" + currentTime;
    //       this.editableTabs.push({
    //         title: newTitle,
    //         name: tabId,
    //         content: <CreateTable />,
    //       });
    //       this.tabActiveName = tabId;
    //     } else if (event.index === "3") {
    //       /**
    //        * event.index=3 新建组
    //        */
    //     }
    //   },
    //   /**
    //    * 移除tab
    //    */
    //   removeTab(targetName) {
    //     const tabs = this.editableTabs;
    //     let activeName = this.tabActiveName;
    //     if (activeName === targetName) {
    //       tabs.forEach((tab, index) => {
    //         if (tab.name === targetName) {
    //           const nextTab = tabs[index + 1] || tabs[index - 1];
    //           if (nextTab) {
    //             activeName = nextTab.name;
    //           }
    //         }
    //       });
    //     }
    //     this.tabActiveName = activeName;
    //     this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    //   },
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