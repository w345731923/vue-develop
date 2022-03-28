<template>
  <div class="tree-view">
    <el-tree
      :data="state.treeData"
      node-key="id"
      :expand-on-click-node="false"
      highlight-current="true"
      node-expand="handleNodeExpand"
      :load="loadNode"
      lazy
    >
      <template #default="{ node, data }">
        <div
          class="tree-node-row"
          aria-selected="false"
          @click="handleNodeClick($event)"
        >
          <!-- <div class="tree-node-icon"> <img src="../../assets/server.png"></div>         -->
          <div class="tree-node-icon tree-node-icon-gt">
            <img
              src="../../assets/server.png"
              v-if="data.type === 'ServerGroup'"
            />
            <img src="../../assets/hgdb16.png" v-if="data.type === 'server'" />
            <img
              src="../../assets/database.png"
              v-if="data.type === 'db-name'"
            />
            <img
              src="../../assets/folder_schema.png"
              v-if="data.type === 'schema-group'"
            />
            <img src="../../assets/schema.png" v-if="data.type === 'schema'" />
            <img
              src="../../assets/folder_table.png"
              v-if="data.type === 'table-group'"
            />
            <img src="../../assets/table.png" v-if="data.type === 'table'" />
            <img
              src="../../assets/folder_user.png"
              v-if="data.type === 'role-group'"
            />
            <img src="../../assets/user.png" v-if="node.data.type === 'user'" />
          </div>
          <div class="tree-node-name tree-node-name-gt">
            {{ data.object.name }}
          </div>
          <div class="tree-node-action">
            <el-icon><document-add @click="handleGroupCreate" /></el-icon>
            <el-icon><edit @click="handleGroupUpdate(data)" /></el-icon>
            <img src="../../assets/refresh.png" />
          </div>
        </div>
      </template>
    </el-tree>
    <!-- default-expand-all :render-content="renderContent"-->
    <ServerGroupDialog
      :dialogGroupVisible="state.dialogGroupVisible"
      :dialogGroupStatus="state.dialogGroupStatus"
      :dialogGroupObj="dialogGroupObj"
      @updateServerGroupDialog="updateServerGroupDialog"
      :saveServerGroup="saveServerGroup"
      :updateServerGroup="updateServerGroup"
    />
  </div>
</template>

<script lang="ts">
import { DocumentAdd, Edit } from "@element-plus/icons-vue";

import {
  defineComponent,
  // computed, ref, watch, unref, watchEffect
} from "vue";
import { reactive, onMounted } from "vue";
import {
  getRoot,
  addServerGroup,
  getTreeNodeRename,
  // getTreeNodeDel,
} from "@/api/treeNode";
import ServerGroupDialog from "@/components/tree-node/ServerGroupDialog.vue";
import { ResponseData, TreeNodeServerGroup, ServerGroupForm } from "@/types";

interface TreeNodeState {
  treeData: TreeNodeServerGroup[]; //tree data
  dialogGroupVisible: boolean; //group dialog
  dialogGroupStatus: string; //group create or edit
  dialogGroupObj: ServerGroupForm;
}

export default defineComponent({
  name: "treeNode",
  components: {
    ServerGroupDialog,
    DocumentAdd,
    Edit,
  },
  setup() {
    const state = reactive<TreeNodeState>({
      treeData: [],
      dialogGroupVisible: false,
      dialogGroupStatus: "",
      dialogGroupObj: { serverGroupName: "" },
    });
    /**
     * 查询Root根下节点
     */
    const queryRoot = () => {
      getRoot().then((respon: ResponseData<TreeNodeServerGroup[]>) => {
        console.log("respon", respon.data);
        state.treeData = respon.data;
      });
    };
    onMounted(() => {
      console.log("组件挂载完成", state.treeData);
      queryRoot();
    });
    /**
     * 节点点击event
     */
    const handleNodeClick = (event: any) => {
      var el = event.currentTarget;
      console.log("当前对象的内容：", el, state.treeData);
      console.log("state", state);
    };
    /**
     * 打开新建组弹窗
     */
    const handleGroupCreate = () => {
      state.dialogGroupStatus = "create";
      state.dialogGroupVisible = true;
      state.dialogGroupObj = { serverGroupName: "" };
    };
    /**
     * 打开编辑组弹窗
     */
    const handleGroupUpdate = (row: any) => {
      state.dialogGroupObj = Object.assign({}, row); // copy obj
      state.dialogGroupStatus = "update";
      state.dialogGroupVisible = true;
      console.log("dialogGroupObj", state.dialogGroupObj);
    };
    /**
     * 打开/关闭弹窗
     */
    const updateServerGroupDialog = (status: boolean) =>
      (state.dialogGroupVisible = status);
    /**
     * 添加group
     */
    const saveServerGroup = (obj: any) => {
      console.log("handleSaveServerGroup,", obj);
      addServerGroup(obj).then(() => {
        state.dialogGroupVisible = false;
        queryRoot();
      });
    };
    /**
     * 保存编辑节点
     */
    const updateServerGroup = (obj: any) => {
      console.log("handleUpdateServerGroup,", obj);
      getTreeNodeRename({ dbObject: obj, newName: "123" }).then(() => {
        state.dialogGroupVisible = false;
        queryRoot();
      });
    };
    return {
      state,
      handleNodeClick,
      updateServerGroupDialog,
      handleGroupCreate,
      handleGroupUpdate,
      saveServerGroup,
      updateServerGroup,
    };
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  methods: {
    loadNode(node: any, resolve: any) {
      console.log("node", node, resolve);
      if (node.level === 0) {
        return;
      }
      // if (node.level == 1) {
      //   setTimeout(() => {
      //     const data = [
      //       {
      //         label: "leaf",
      //         leaf: true,
      //       },
      //       {
      //         label: "zone",
      //       },
      //     ];

      //     return resolve(data);
      //   }, 500);
      // }
    },
  },
});
</script>

<style scoped>
.el-tree {
  flex: 1;
}
.el-tree-node__content .tree-node-row div {
  margin-right: 6px;
  margin-left: 2px;
}

.tree-node-row {
  width: 100%;
  box-sizing: border-box;
  height: 20px;
  display: flex;
  align-content: center;
  /* padding: 0 5px; */
  user-select: none;
  white-space: nowrap;
  position: static;
  outline: none;
}
.tree-node-icon {
  box-sizing: border-box;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
}
.tree-node-icon-gt {
  position: relative;
}
.tree-node-icon img {
  margin-top: 3px;
}
.tree-node-name {
  box-sizing: border-box;
  padding-right: 16px;
}
.tree-node-name-gt {
  height: 100%;
}
.tree-node-action {
  box-sizing: border-box;
  margin-left: auto !important;
  margin-right: 16px !important;
  visibility: hidden;
}

.el-tree-node__content:hover .tree-node-action,
.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .tree-node-action {
  visibility: visible;
}
</style>