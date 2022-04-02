<template>
  <div class="tree-view">
    <el-tree
      :data="treeData"
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
            <img src="../../assets/hgdb16.png" v-if="data.type === 'Server'" />
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
            <span v-if="data.type === 'Server'">
              <span v-html="data.object.displayName"></span>
            </span>
            <span v-else>
              {{ data.object.displayName }}
            </span>
          </div>
          <div class="tree-node-action">
            <el-icon><document-add @click="openObject(data, 0)" /></el-icon>
            <el-icon><edit @click="openObject(data, 1)" /></el-icon>
            <el-icon><delete @click="openObject(data, 2)" /></el-icon>
            <img src="../../assets/refresh.png" />
          </div>
        </div>
      </template>
    </el-tree>
    <!-- ServerGroup弹出框 -->
    <GroupDialogEdit
      :visible="state.groupVisible"
      :groupOldName="state.groupOldName"
      @saveModal="saveServerGroup"
      @closeModal="switchGroupVisable"
    />
    <!-- ServerGroup删除确认框 -->
    <el-dialog
      v-model="state.groupDialogVisible"
      title="删除对象"
      width="30%"
      center
    >
      <span>确定要删除'{{ state.groupOldObject.object.name }}'吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.groupDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleGroupDel">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Server弹出框 -->
    <ServerDialogEdit
      :visible="state.serverVisible"
      :serverObject="state.serverObject"
      @saveModal="saveServer"
      @closeModal="switchServerVisable"
    />
    <!-- Server删除确认框 -->
    <el-dialog
      v-model="state.serverDialogVisible"
      title="删除连接"
      width="30%"
      center
    >
      <span>确定要删除'{{ state.serverObject.object.name }}'吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.serverDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleServerDel">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { DocumentAdd, Edit, Delete } from "@element-plus/icons-vue";

import {
  defineComponent,
  toRefs,
  computed,
  ref,
  watch,
  unref,
  watchEffect,
} from "vue";
import { reactive, onMounted } from "vue";
import { getTreeNodeDel, getTreeNodeRename, editServer } from "@/api/treeNode";
import GroupDialogEdit from "@/components/server-group/ServerGroupDialogEdit.vue";
import ServerDialogEdit from "@/components/server/ServerDialogEdit.vue";

import {
  Server,
  TreeNodeServerGroup,
  ServerGroupForm,
  ServerEditForm,
  ServerObject,
} from "@/types";

interface ServerForm {
  serverObject: ServerObject;
}

interface TreeNodeState {
  //group
  groupVisible: Boolean;
  groupOldObject: TreeNodeServerGroup | undefined;
  groupOldName: String;
  groupDialogVisible: Boolean;
  //server
  serverVisible: Boolean;
  serverObject: TreeNodeServerGroup | undefined;
  serverOld: string;
  serverDialogVisible: Boolean;
}

export default defineComponent({
  name: "treeNode",
  components: {
    GroupDialogEdit,
    ServerDialogEdit,
    DocumentAdd,
    Edit,
    Delete,
  },
  props: {
    treeData: Array,
    queryRoot: Function,
  },

  setup(props, { emit }) {
    console.log("treeNode props", props);
    const state = reactive<TreeNodeState>({
      //group
      groupVisible: false,
      groupOldObject: undefined,
      groupOldName: "",
      groupDialogVisible: false,
      //server
      serverVisible: false,
      serverObject: undefined,
      serverOld: "",
      serverDialogVisible: false,
    });
    /**
     * 节点点击event
     */
    const handleNodeClick = (event: any) => {
      var el = event.currentTarget;
    };
    /**
     * 编辑菜单对象
     * 0-新建，1-编辑，2-删除
     */
    const openObject = (data: any, type: number) => {
      console.log("data", data.type);
      console.log("groupVisible", state.groupVisible);

      if (data.type === "ServerGroup") {
        if (type == 1) handleGroupUpdate(data);
        else if (type == 2) openGroupDelDialog(data);
      } else {
        if (type == 1) handleServerUpdate(data);
        else if (type == 2) openServerDelDialog(data);
      }
    };

    //---------------Group---------------------
    //Group编辑窗口开关
    const switchGroupVisable = (flag: boolean) => (state.groupVisible = flag);
    //打开编辑Group弹窗,并赋值
    const handleGroupUpdate = (row: any) => {
      state.groupOldObject = row; //存储old值，用于save参数
      state.groupOldName = row.object.displayName; //传给子界面
      switchGroupVisable(true);
    };
    //保存Group
    const saveServerGroup = (form: ServerGroupForm) => {
      const data = {
        newName: form.serverGroupName,
        dbObject: state.groupOldObject,
      };
      getTreeNodeRename(data).then(() => {
        switchGroupVisable(false);
        emit("queryRoot");
      });
    };
    //打开删除group弹窗
    const openGroupDelDialog = (row: any) => {
      state.groupDialogVisible = true;
      state.groupOldObject = row;
    };
    //删除group逻辑
    const handleGroupDel = () => {
      const data = {
        delObject: state.groupOldObject, //删除对象
        deleteOptions: { isCascadeDelete: true }, //是否级联
      };
      getTreeNodeDel(data).then(() => {
        state.groupDialogVisible = false;
        emit("queryRoot");
      });
    };

    //---------------Server---------------------
    //Server编辑窗口开关
    const switchServerVisable = (flag: boolean) => (state.serverVisible = flag);
    //打开编辑Server弹窗,并赋值
    const handleServerUpdate = (row: any) => {
      state.serverObject = row; //传给子界面
      state.serverOld = JSON.stringify(row); //存储old值，用于save参数
      switchServerVisable(true);
    };
    //保存Server
    const saveServer = (form: ServerForm) => {
      console.log("saveServer form", form);
      // const oldObject: any = JSON.parse(state.serverOld);
      const data: ServerEditForm = {
        editDBObjectInfo: {
          newObject: form.serverObject,
          oldObject: JSON.parse(state.serverOld),
        },
        serverGroupName: null,
      };
      console.log("saveServer data", data);
      editServer(data).then(() => {
        switchServerVisable(false);
        emit("queryRoot");
      });
    };
    //打开删除server弹窗
    const openServerDelDialog = (row: any) => {
      state.serverDialogVisible = true;
      state.serverObject = row;
    };
    //删除server逻辑
    const handleServerDel = () => {
      const data = {
        delObject: state.serverObject, //删除对象
        deleteOptions: { isCascadeDelete: true }, //是否级联
      };
      getTreeNodeDel(data).then(() => {
        state.serverDialogVisible = false;
        emit("queryRoot");
      });
    };
    return {
      state,
      openObject,
      handleNodeClick,
      handleGroupUpdate,
      saveServerGroup,
      switchGroupVisable,
      handleGroupDel,
      switchServerVisable,
      handleServerUpdate,
      saveServer,
      handleServerDel,
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
      // console.log("node", node, resolve);
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
.tree-view {
  min-width: 12%;
}
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
/**图标间距 */
.tree-node-action .el-icon {
  margin-right: 3px;
}
.el-tree-node__content:hover .tree-node-action,
.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .tree-node-action {
  visibility: visible;
}
</style>