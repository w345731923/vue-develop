<template>
  <div class="tree-view">
    <el-tree
      :data="treeData"
      node-key="id"
      :expand-on-click-node="false"
      :highlight-current="true"
      :load="loadNode"
      lazy
      ref="treeRef"
      :props="treeProps"
    >
      <!-- @node-expand="handleNodeExpand" -->
      <template #default="{ node, data }">
        <div
          class="tree-node-row"
          aria-selected="false"
          @click="handleNodeClick($event)"
        >
          <div style="display: flex">
            <div class="tree-node-icon tree-node-icon-gt">
              <img
                src="../../assets/server.png"
                v-if="data.type === 'ServerGroup'"
              />
              <img
                src="../../assets/hgdb16.png"
                v-if="data.type === 'Server'"
              />
              <img
                src="../../assets/database.png"
                v-if="data.type === 'db-name'"
              />
              <img
                src="../../assets/folder_schema.png"
                v-if="data.type === 'schema-group'"
              />
              <img
                src="../../assets/schema.png"
                v-if="data.type === 'schema'"
              />
              <img
                src="../../assets/folder_table.png"
                v-if="data.type === 'table-group'"
              />
              <img src="../../assets/table.png" v-if="data.type === 'table'" />
              <img
                src="../../assets/folder_user.png"
                v-if="data.type === 'role-group'"
              />
              <img
                src="../../assets/user.png"
                v-if="node.data.type === 'user'"
              />
            </div>
            <div class="tree-node-name tree-node-name-gt">
              <span v-if="data.type === 'Server'">
                <span v-html="data.object.displayName"></span>
              </span>
              <span v-else>
                {{ data.object.displayName }}
              </span>
            </div>
          </div>
          <div class="tree-node-action">
            <el-icon><document-add @click="openObjectAdd(data)" /></el-icon>
            <el-icon><edit @click="openObjectEdit(node, data)" /></el-icon>
            <el-icon><delete @click="openObjectDel(data)" /></el-icon>
            <!-- <img src="../../assets/refresh.png" /> -->
          </div>
          <!-- <el-dropdown ref="dropdown1" trigger="contextmenu" style="display:none">
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  ><el-icon
                    ><document-add @click="openObjectAdd(data)" /></el-icon
                ></el-dropdown-item>
                <el-dropdown-item
                  ><el-icon><edit @click="openObjectEdit(data)" /></el-icon
                ></el-dropdown-item>
                <el-dropdown-item
                  ><el-icon><delete @click="openObjectDel(data)" /></el-icon
                ></el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown> -->
        </div>
      </template>
    </el-tree>

    <!-- ===============================ServerGroup======================================= -->
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

    <!-- ===============================Server======================================= -->
    <ServerDialogAdd
      :visible="state.serverAddVisible"
      @saveModal="handleSaveServer"
      @closeModal="switchServerAddVisable"
    />

    <template v-if="state.serverEditVisible">
      <!-- Server弹出框 -->
      <ServerDialogEdit
        :visible="state.serverEditVisible"
        :serverObject="state.serverObject"
        @saveModal="handleEditServer"
        @closeModal="switchServerEditVisable"
        @testModal="handleTestServer"
      />
    </template>

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

<script lang="ts" setup>
import { DocumentAdd, Edit, Delete } from "@element-plus/icons-vue";
import type Node from "element-plus/es/components/tree/src/model/node";
interface Tree {
  name: string;
  leaf?: boolean;
  data: any;
}

import {
  defineComponent,
  toRefs,
  computed,
  ref,
  watch,
  Ref,
  watchEffect,
} from "vue";
import { reactive, onMounted } from "vue";
import {
  getTreeNodeDel,
  getTreeNodeRename,
  addServer,
  editServer,
  testServer,
  getServerList,
} from "@/api/treeNode";
import GroupDialogEdit from "@/components/server-group/ServerGroupDialogEdit.vue";
import ServerDialogAdd from "@/components/server/ServerDialogAdd.vue";
import ServerDialogEdit from "@/components/server/ServerDialogEdit.vue";

import {
  ResponseData,
  Server,
  ServerGroup,
  TreeNode,
  ServerGroupForm,
  ServerEditForm,
  ServerObject,
  TreeNodeDel,
} from "@/types";
import { ElMessage } from "element-plus";

interface TreeNodeState {
  //group
  groupVisible: Boolean;
  groupOldObject: TreeNode<ServerGroup> | null;
  groupOldName: string;
  groupDialogVisible: Boolean;
  //server
  serverAddVisible: Boolean;
  serverEditVisible: Boolean;
  serverObject: Server | undefined;
  serverOld: string;
  serverDialogVisible: Boolean;
}

export default defineComponent({
  name: "treeNode",
  components: {
    GroupDialogEdit,
    ServerDialogAdd,
    ServerDialogEdit,
    DocumentAdd,
    Edit,
    Delete,
  },
  props: {
    treeData: Array,
    addTreeNode: Function,
    delTreeNode: Function,
    editTreeNode: Function,
    renameTreeNode: Function,
  },

  setup(props, { emit }) {
    const treeRef: Ref = ref(null);
    const treeProps = {
      label: "name",
      children: "zones",
      isLeaf: "leaf",
    };
    const state = reactive<TreeNodeState>({
      //group
      groupVisible: false,
      groupOldObject: null,
      groupOldName: "",
      groupDialogVisible: false,
      //server
      serverAddVisible: false,
      serverEditVisible: false,
      serverObject: undefined,
      serverOld: "",
      serverDialogVisible: false,
    });
    const handleNodeExpand = (data: TreeNode<any>, node: any) => {
      console.log(data, node);
      if (data.type == "ServerGroup") {
        console.log("ServerGroup", data);
      } else if (data.type == "Server") {
        console.log("Server", data);
      }
    };
    /**
     * 节点点击event
     */
    const handleNodeClick = (event: any) => {
      var el = event.currentTarget;
      console.log("handleNodeClick event", event);
    };
    /**
     * 新建菜单对象
     */
    const openObjectAdd = (data: TreeNode<any>) => {
      console.log("openObjectAdd data", data);
      if (data.type === "ServerGroup") {
        state.groupOldObject = data;
        switchServerAddVisable(true);
      }
    };
    /**
     * 编辑菜单对象
     */
    const openObjectEdit = (node: any, data: TreeNode<any>) => {
      if (data.type === "ServerGroup") {
        //group
        handleGroupUpdate(data);
      } else {
        //server
        handleServerUpdate(node, data);
      }
    };
    /**
     * 删除菜单对象
     */
    const openObjectDel = (data: TreeNode<any>) => {
      if (data.type === "ServerGroup") {
        openGroupDelDialog(data);
      } else {
        openServerDelDialog(data);
      }
    };

    //---------------Group---------------------
    //Group编辑窗口开关
    const switchGroupVisable = (flag: boolean) => (state.groupVisible = flag);
    //打开编辑Group弹窗,并赋值
    const handleGroupUpdate = (row: any) => {
      state.groupOldObject = row; //存储old值，用于save参数
      state.groupOldName = row.object.name; //传给子界面
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
        emit(
          "renameTreeNode",
          "ServerGroup",
          null,
          state.groupOldObject,
          form.serverGroupName
        );
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
        emit("delTreeNode", "ServerGroup", null, state.groupOldObject);
      });
    };

    //---------------Server---------------------
    //Server编辑窗口开关
    const switchServerAddVisable = (flag: boolean) =>
      (state.serverAddVisible = flag);
    const switchServerEditVisable = (flag: boolean) =>
      (state.serverEditVisible = flag);
    //打开编辑Server弹窗,并赋值
    const handleServerUpdate = (node: Node, row: any) => {
      console.log("handleServerUpdate node ", node);
      console.log("handleServerUpdate row ", row);

      /**
       * 判断是否有父类
       */
      if (node.level == 2) {
        state.groupOldName = node.parent.data.object.name;
      }
      // debugger;
      state.serverOld = JSON.stringify(row); //存储old值，用于save参数
      //注意：这里传的是object对象，save时候需要把外面包一层
      state.serverObject = row.object; //传给子界面
      switchServerEditVisable(true);
    };
    //test server
    const handleTestServer = (form: Server) => {
      //包一层外部对象
      const ServerObject: ServerObject = {
        connectionId: "",
        databaseOid: 0,
        object: form,
        serverId: "",
        type: "Server",
      };
      testServer(ServerObject).then(() => {
        ElMessage({
          message: "连接成功！",
          type: "success",
        });
      });
    };
    //save Server
    const handleSaveServer = (form: Server) => {
      //包一层外部对象
      const ServerObject: ServerObject = {
        connectionId: "",
        databaseOid: 0,
        object: form,
        serverId: "",
        type: "Server",
      };
      const serverForm = {
        parent: state.groupOldObject,
        newObject: ServerObject,
      };
      addServer(serverForm).then(() => {
        switchServerAddVisable(false);
        emit("addTreeNode", "Server", state.groupOldObject, ServerObject);
      });
      switchServerAddVisable(false);
    };
    //edit Server
    const handleEditServer = (form: Server) => {
      //包一层外部对象
      const newObject: ServerObject = JSON.parse(state.serverOld);
      newObject.object = form;
      const data: ServerEditForm = {
        editDBObjectInfo: {
          newObject: newObject, //new val
          oldObject: JSON.parse(state.serverOld), //old val
        },
        serverGroupName: state.groupOldName,
      };
      editServer(data).then((result: ResponseData<TreeNode<Server>>) => {
        switchServerEditVisable(false);
        emit(
          "editTreeNode",
          "Server",
          null,
          JSON.parse(state.serverOld),
          result.data
        );
      });
    };
    //打开删除server弹窗
    const openServerDelDialog = (row: any) => {
      state.serverDialogVisible = true;
      state.serverObject = row;
    };
    //删除server逻辑
    const handleServerDel = () => {
      const data: TreeNodeDel = {
        delObject: state.serverObject, //删除对象
        deleteOptions: { isCascadeDelete: true }, //是否级联
      };
      getTreeNodeDel(data).then(() => {
        state.serverDialogVisible = false;
        emit("delTreeNode", "Server", null, state.serverObject);
      });
    };
    const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
      //需要记录已经展开的节点，不然刷新后都关闭了

      console.log("node", node, resolve);
      if (node.level === 0) {
        /**
         * ROOT节点，为了实现懒加载
         * https://element-plus.gitee.io/zh-CN/component/tree.html#%E6%87%92%E5%8A%A0%E8%BD%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8F%B6%E5%AD%90%E8%8A%82%E7%82%B9
         */
        return resolve([]);
      }

      if (node.data.type == "ServerGroup") {
        return getServerNode(node.data, resolve);
      } else if (node.data.type == "Server") {
        alert(111);
        return;
      }
    };
    //get server list
    const getServerNode = (node: any, resolve) => {
      let groupName = node.object.name;
      getServerList(groupName).then(
        (respon: ResponseData<TreeNode<Server>[]>) => {
          console.log("succ respon ", respon);
          resolve(respon.data);
        }
      );
    };
    return {
      treeRef,
      state,
      treeProps,
      handleNodeExpand,
      loadNode,
      openObjectAdd,
      openObjectEdit,
      openObjectDel,
      handleNodeClick,
      handleGroupUpdate,
      saveServerGroup,
      switchGroupVisable,
      handleGroupDel,
      switchServerAddVisable,
      switchServerEditVisable,
      handleServerUpdate,
      handleSaveServer,
      handleEditServer,
      handleServerDel,
      handleTestServer,
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
  methods: {},
});
</script>

<style scoped>
.tree-view {
  min-width: 10%;
  max-width: 20%;
}
.el-tree {
  flex: 1;
  width: 100%;
}
.el-tree-node__content .tree-node-row div {
  margin-right: 2px;
  margin-left: 2px;
}

.tree-node-row {
  width: 100%;
  box-sizing: border-box;
  height: 20px;
  display: flex;
  /* align-content: center; */
  align-content: space-between;
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
  flex-shrink: 0;
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
  flex-shrink: 0;
  z-index: 2;
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