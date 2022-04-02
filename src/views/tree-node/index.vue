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
            <el-icon><document-add @click="handleGroupCreate" /></el-icon>
            <el-icon><edit @click="editObject" /></el-icon>
            <el-icon><delete @click="openGroupDelDialog(data)" /></el-icon>
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
      <span>确定要删除{{ state.groupOldObject.object.displayName }}吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="state.groupDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleGroupDel">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <ServerDialogEdit
      :visible="state.serverVisible"
      :groupOldName="state.groupOldName"
      @saveModal="saveServerGroup"
      @closeModal="switchGroupVisable"
    />

    <!-- <ServerDialogEdit
      :visible="state.groupVisible"
      :groupOldName="state.groupOldName"
      @saveModal="saveServerGroup"
      @closeModal="switchGroupVisable"
    />     -->
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
  ResponseData,
  TreeNodeServerGroup,
  ServerGroupForm,
  ServerEditForm,
  ServerObject,
} from "@/types";

interface TreeNodeState {
  //group
  groupVisible: Boolean;
  groupOldObject: TreeNodeServerGroup | undefined;
  groupOldName: String;
  groupDialogVisible: Boolean;
  //server
  serverVisible: Boolean;
  serverOldObject: TreeNodeServerGroup | undefined;
  serverOld: String;
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
      serverOldObject: undefined,
      serverOld: "",
      serverDialogVisible: false,
    });
    const editObject = (data) => {
      console.log('data',data)
      handleGroupUpdate(data);
    };
    /**
     * 节点点击event
     */
    const handleNodeClick = (event: any) => {
      var el = event.currentTarget;
    };

    /**
     * Group编辑窗口开关
     */
    const switchGroupVisable = (flag: boolean) => (state.groupVisible = flag);
    /**
     * 打开编辑Group弹窗,并赋值
     */
    const handleGroupUpdate = (row: any) => {
      state.groupOldObject = row; //存储old值，用于save参数
      state.groupOldName = row.object.displayName; //传给子界面
      switchGroupVisable(true);
    };
    /**
     * 保存Group
     */
    const saveServerGroup = (form: ServerGroupForm) => {
      const data = {
        newName: form.serverGroupName,
        dbObject: state.groupOldObject,
      };
      /**
       * 重命名接口
       */
      getTreeNodeRename(data).then(() => {
        switchGroupVisable(false);
        //刷新树形菜单
        emit("queryRoot");
      });
    };
    /**
     * 打开删除group弹窗
     */
    const openGroupDelDialog = (row: any) => {
      state.groupDialogVisible = true;
      state.groupOldObject = row;
    };
    /**
     * 删除group逻辑
     */
    const handleGroupDel = () => {
      const data = {
        conns: null, //暂存
        delObject: state.groupOldObject, //删除对象
        deleteOptions: { isCascadeDelete: true }, //是否级联
      };
      getTreeNodeDel(data).then(() => {
        switchGroupVisable(false);
        //刷新树形菜单
        emit("queryRoot");
      });
      state.groupDialogVisible = false;
    };
    /**
     * server编辑窗口开关
     */
    const switchServerVisable = (flag: boolean) => (state.serverVisible = flag);
    /**
     * 打开编辑Group弹窗,并赋值
     */
    const handleServerUpdate = (row: any) => {
      state.serverOldObject = row; //传给子界面
      state.serverOld = JSON.stringify(row); //存储old值，用于save参数
      switchServerVisable(true);
    };
    /**
     * 保存修改Server
     */
    const saveServer = (form: ServerGroupForm) => {
      // const oldObject: ServerObject = JSON.parse(state.serverOld);
      // const data: ServerEditForm = {
      //   // newObject: form.serverGroupName,
      //   oldObject: oldObject,
      // };
      // /**
      //  * 重命名接口
      //  */
      // editServer(data).then(() => {
      //   switchServerVisable(false);
      //   //刷新树形菜单
      //   emit("queryRoot");
      // });
    };
    return {
      state,
      editObject,
      handleNodeClick,
      handleGroupUpdate,
      saveServerGroup,
      switchGroupVisable,
      openGroupDelDialog,
      handleGroupDel,
      switchServerVisable,
      handleServerUpdate,
      saveServer
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