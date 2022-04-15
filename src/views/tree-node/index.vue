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
      <template #default="{ node, data }">
        <div
          class="tree-node-row"
          aria-selected="false"
          @click="handleNodeClick($event, data, node)"
        >
          <div class="tree-node-icon tree-node-icon-gt">
            <img
              src="../../assets/server.png"
              v-if="data.type === 'ServerGroup'"
            />
            <img src="../../assets/hgdb16.png" v-if="data.type === 'Server'" />
            <img
              src="../../assets/database.png"
              v-if="data.type === 'Database'"
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
          <div
            class="tree-node-name tree-node-name-gt"
            style="padding-right: 16px"
          >
            <span v-if="data.type === 'Server' || data.type === 'Database'">
              <span v-html="data.object.displayName"></span>
            </span>
            <span v-else>
              {{ data.object.displayName }}
            </span>
          </div>
          <div class="tree-node-button">
            <el-dropdown
              ref="buttonDropdown"
              trigger="click"
              @command="handleCommand"
            >
              <!-- style="margin-right: 30px" -->
              <el-icon><message-box @click="addDropDownMenu(node)" /></el-icon>
              <!-- <el-icon><message-box @click="nodeButtonExpand(node)" /></el-icon> -->
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    class="dropMenu-item"
                    v-for="(item, index) in state.dropdownMenu"
                    :key="index"
                    :command="{ menu: item, node: node }"
                    :disabled="item.disabled"
                    >{{ item.text }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <!-- <div class="tree-node-action">
            <el-icon
              ><document-add @click="openObjectAdd(node, data)"
            /></el-icon>
            <el-icon><edit @click="openObjectEdit(node, data)" /></el-icon>
            <el-icon><delete @click="openRemoveNodeDialog(node)" /></el-icon>
            <el-icon><money @click="openRenameNodeDialog(node)" /></el-icon>
          </div> -->
          <!-- <img src="../../assets/refresh.png" /> -->

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

    <!-- ===============================删除节点======================================= -->
    <template v-if="state.removeDialogVisible">
      <el-dialog
        v-model="state.removeDialogVisible"
        title="删除对象"
        width="30%"
        center
      >
        <span>确定要删除'{{ state.treeNode.data.object.name }}'吗？</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.removeDialogVisible = false"
              >取消</el-button
            >
            <el-button type="primary" @click="handleRemoveNodeSubmit"
              >确认</el-button
            >
          </span>
        </template>
      </el-dialog>
    </template>
    <!-- ===============================重命名节点======================================= -->
    <template v-if="state.renameDialogVisible">
      <RenameNodeDialog
        :visible="state.renameDialogVisible"
        :data="state.treeNode.data"
        @saveModal="handleRenameNodeSubmit"
        @closeModal="state.renameDialogVisible = false"
      />
    </template>

    <!-- ===============================ServerGroup======================================= -->
    <GroupDialogEdit
      :visible="state.groupVisible"
      :groupOldName="state.groupOldName"
      @saveModal="saveServerGroup"
      @closeModal="switchGroupVisable"
    />

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
        :serverObject="state.serverForm"
        @saveModal="handleEditServer"
        @closeModal="switchServerEditVisable"
        @testModal="handleTestServer"
      />
    </template>

    <!-- ===============================db======================================= -->
    <template v-if="state.dbAddVisible">
      <DBDialogAdd
        :visible="state.dbAddVisible"
        :dbForm="state.dbForm"
        @saveModal="handleSaveDB"
        @closeModal="switchDBAddVisable"
      />
    </template>
  </div>
</template>

<script lang="ts">
import {
  // DocumentAdd,
  Edit,
  Delete,
  Money,
  MessageBox,
} from "@element-plus/icons-vue";
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
  getDatabaseList,
  serverConnect,
  addDB,
} from "@/api/treeNode";
import RenameNodeDialog from "./renameNode.vue";
import GroupDialogEdit from "@/components/server-group/ServerGroupDialogEdit.vue";
import ServerDialogAdd from "@/components/server/ServerDialogAdd.vue";
import ServerDialogEdit from "@/components/server/ServerDialogEdit.vue";
import DBDialogAdd from "@/components/database/DBDialogAdd.vue";

import {
  ResponseData,
  ServerForm,
  Server,
  ServerGroup,
  TreeNode,
  ServerGroupForm,
  ServerEditForm,
  TreeNodeDel,
  Database,
  DatabaseForm,
  TreeNodeRename,
  DropDownMenu,
} from "@/types";
import { breadcrumbProps, ElMessage } from "element-plus";

interface TreeNodeState {
  dropdownMenu: DropDownMenu[];

  treeNode: Node | null;
  removeDialogVisible: Boolean;
  renameDialogVisible: Boolean;

  //group
  groupVisible: Boolean;
  groupOldObject: TreeNode<ServerGroup> | null;
  groupOldName: string;

  //server
  serverAddVisible: Boolean;
  serverEditVisible: Boolean;
  serverForm: Server | null;
  serverObject: TreeNode<Server> | null;
  serverOld: string;

  //database
  dbAddVisible: Boolean;
  dbEditVisible: Boolean;
  dbForm: Database | null;
}

export default defineComponent({
  name: "treeNode",
  components: {
    MessageBox,
    // DocumentAdd,
    // Edit,
    // Delete,
    // Money,
    RenameNodeDialog,
    GroupDialogEdit,
    ServerDialogAdd,
    ServerDialogEdit,
    DBDialogAdd,
  },
  props: {
    treeData: Array,
    addTreeNode: Function,
    delTreeNode: Function,
    editTreeNode: Function,
    renameTreeNode: Function,
  },

  setup(props, { emit }) {
    const treeRef: Ref = ref(null); //树形结果对象
    const buttonDropdown = ref(); //节点扩展按钮下拉对象
    const treeProps = {
      label: "name",
      children: "zones",
      isLeaf: "leaf",
    };
    const state = reactive<TreeNodeState>({
      dropdownMenu: [],
      treeNode: null,
      removeDialogVisible: false, //移除节点
      renameDialogVisible: false, //重命名节点

      //group
      groupVisible: false,
      groupOldObject: null,
      groupOldName: "",

      //server
      serverAddVisible: false,
      serverEditVisible: false,
      serverForm: null,
      serverObject: null,
      serverOld: "",

      //db
      dbAddVisible: false,
      dbEditVisible: false,
      dbForm: null,
    });

    /**
     * 节点点击event
     */
    const handleNodeClick = (event: any, data: any, node: any) => {
      console.log("handleNodeClick node", node);
      console.log("handleNodeClick data", data);
      console.log("handleNodeClick tree", treeRef.value);
    };
    /**
     * 0删除，1重命名，2刷新，
     * 11新建连接
     * 20打开连接，21关闭连接，22新建数据库，23修改密码，24编辑连接
     */
    const addDropDownMenu = (node: Node) => {
      console.log("addDropDownMenu node =", node);
      state.dropdownMenu = [];
      let menu: DropDownMenu[] = [];
      const removeMenu = {
        key: 0,
        text: "删除",
        disabled: false,
        onClick: openRemoveNodeDialog,
      };
      const renameMenu = {
        key: 1,
        text: "重命名",
        disabled: false,
        onClick: openRenameNodeDialog,
      };
      const refreshMenu = {
        key: 2,
        text: "刷新",
        disabled: true,
        onClick: openRenameNodeDialog,
      };
      const treeNode = node.data as TreeNode<any>;
      if (treeNode.type == "ServerGroup") {
        menu.push({
          key: 11,
          text: "新建连接",
          disabled: false,
          onClick: openObjectAdd,
        });
        menu.push(removeMenu);
        menu.push(renameMenu);
        menu.push(refreshMenu);
      } else if (treeNode.type == "Server") {
        const connectionId = treeNode.connectionId;
        if (connectionId) {
          menu.push({
            key: 21,
            text: "关闭连接",
            disabled: true,
            onClick: openRemoveNodeDialog,
          });
          menu.push({
            key: 22,
            text: "新建数据库",
            disabled: false,
            onClick: openObjectAdd,
          });
          menu.push({
            key: 23,
            text: "修改密码",
            disabled: true,
            onClick: openRenameNodeDialog,
          });
        } else {
          menu.push({
            key: 20,
            text: "打开连接",
            disabled: true,
            onClick: openObjectAdd,
          });
        }
        menu.push({
          key: 24,
          text: "编辑连接",
          disabled: false,
          onClick: openObjectEdit,
        });
        menu.push(removeMenu);
        menu.push(renameMenu);
        menu.push(refreshMenu);
      }
      state.dropdownMenu = menu;
    };
    /**
     * 右键选择了一个按钮
     */
    const handleCommand = (row: { menu: any; node: Node }) => {
      row.menu.onClick(row.node);
    };

    /**
     * 新建菜单对象
     */
    const openObjectAdd = (node: Node) => {
      console.log("openObjectAdd node", node);
      const type = node.data.type;
      if (type === "ServerGroup") {
        //新建Server
        state.treeNode = node;
        switchServerAddVisable(true);
      } else if (type === "Server") {
        //新建数据库
        state.treeNode = node;
        //连接server使用的dbname
        const dbname = node.data.object.databaseName;
        //查找默认db数据
        const defaultDatabase = node.childNodes.filter((element: Node) => {
          if (dbname == element.data.object.name) return true;
        })[0];

        state.dbForm = {
          "@clazz": "com.highgo.developer.model.HgdbDatabase",
          name: "", //数据库名
          encoding: defaultDatabase.data.object.encoding, //编码 "UTF8"
          collation: defaultDatabase.data.object.collation, //排序规则排序  "zh_CN.UTF-8"
          characterType: "", //字符分类  "zh_CN.UTF-8"
          connectionLimit: defaultDatabase.data.object.connectionLimit, //连接限制 -1
          description: "", //注释
          databaseowner: defaultDatabase.data.object.databaseowner, //拥有者
          spcname: defaultDatabase.data.object.spcname, //表空间  "pg_default"
          templateName: "", //范本
          datistemplate: false, //是范本
          datallowconn: false, //允许连接
        };
        switchDBAddVisable(true);
      }
    };
    /**
     * 编辑菜单对象
     */
    const openObjectEdit = (node: Node) => {
      const type = node.data.type;
      if (type === "Server") {
        handleServerUpdate(node);
      }
    };
    /**
     * 删除节点弹窗
     */
    const openRemoveNodeDialog = (node: Node) => {
      state.treeNode = node;
      state.removeDialogVisible = true;
    };
    /**
     * 删除节点提交
     */
    const handleRemoveNodeSubmit = () => {
      const data: TreeNodeDel = {
        delObject: state.treeNode?.data, //删除对象
        deleteOptions: { isCascadeDelete: true }, //是否级联
      };
      getTreeNodeDel(data).then(() => {
        state.removeDialogVisible = false;
        treeRef.value.remove(state.treeNode);
      });
    };
    /**
     * 重命名节点弹窗
     */
    const openRenameNodeDialog = (node: Node) => {
      state.treeNode = node;
      state.renameDialogVisible = true;
    };
    /**
     * 重命名节点提交
     */
    const handleRenameNodeSubmit = (form: { name: string }) => {
      const data: TreeNodeRename = {
        dbObject: state.treeNode?.data, //删除对象
        newName: form.name, //是否级联
      };
      getTreeNodeRename(data).then((result: ResponseData<TreeNode<any>>) => {
        // const src: TreeNode<any> = treeRef.value.data.filter(
        //   (element: TreeNode<any>) =>
        //     element.object.name == state.treeNode?.data.object.name
        // )[0];
        // src.object.name = form.name;
        state.renameDialogVisible = false;
        state.treeNode?.setData(result.data);
      });
    };
    //---------------Group---------------------
    //Group编辑窗口开关
    const switchGroupVisable = (flag: boolean) => (state.groupVisible = flag);
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

    //---------------Server---------------------
    //Server编辑窗口开关
    const switchServerAddVisable = (flag: boolean) =>
      (state.serverAddVisible = flag);
    const switchServerEditVisable = (flag: boolean) =>
      (state.serverEditVisible = flag);

    //修改Server的弹窗
    const handleServerUpdate = (node: Node) => {
      console.log("handleServerUpdate node ", node);
      const row = node.data as TreeNode<Server>;
      /**
       * 判断是否有父类
       */
      if (node.level == 2) {
        state.groupOldName = node.parent.data.object.name;
      }
      state.treeNode = node;
      state.serverOld = JSON.stringify(row); //存储old值，用于save参数
      //注意：这里传的是object对象，save时候需要把外面包一层
      state.serverForm = row.object; //传给子界面
      switchServerEditVisable(true);
    };
    //测试连接
    const handleTestServer = (form: Server) => {
      //包一层外部对象
      const serverObject: TreeNode<Server> = {
        connectionId: "",
        databaseOid: 0,
        object: form,
        serverId: "",
        type: "Server",
      };
      testServer(serverObject).then(() => {
        ElMessage({
          message: "连接成功！",
          type: "success",
        });
      });
    };
    //save Server
    const handleSaveServer = (form: Server) => {
      //包一层外部对象
      const serverObject: TreeNode<Server> = {
        connectionId: "",
        databaseOid: 0,
        object: form,
        serverId: "",
        type: "Server",
      };
      const serverForm: ServerForm = {
        parent: state.treeNode!.data as TreeNode<ServerGroup>,
        newObject: serverObject,
      };
      addServer(serverForm).then((result: ResponseData) => {
        switchServerAddVisable(false);
        treeRef.value.append(result.data, state.treeNode);
      });
      switchServerAddVisable(false);
    };
    //edit Server
    const handleEditServer = (form: Server) => {
      //包一层外部对象
      const newObject: TreeNode<Server> = JSON.parse(state.serverOld);
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
        state.treeNode?.setData(result.data);
      });
    };

    //---------------database---------------------
    //db编辑窗口开关
    const switchDBAddVisable = (flag: boolean) => (state.dbAddVisible = flag);
    const switchDBEditVisable = (flag: boolean) => (state.dbEditVisible = flag);
    //save db
    const handleSaveDB = (form: Database) => {
      const server: any = state.treeNode?.data;
      //包一层外部对象
      const newObject: TreeNode<Database> = {
        connectionId: server.connectionId,
        databaseOid: 0,
        object: form,
        serverId: server.serverId,
        type: "Database",
      };
      const serverForm: DatabaseForm = {
        parent: server,
        newObject: newObject,
      };
      addDB(serverForm).then((result: ResponseData) => {
        switchDBAddVisable(false);
        treeRef.value.append(result.data, state.treeNode);
      });
    };

    /**
     * 展开属性菜单 懒加载
     */
    const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
      //需要记录已经展开的节点，不然刷新后都关闭了

      console.log("loadNode node", node);
      if (node.level === 0) {
        /**
         * ROOT节点，为了实现懒加载
         * https://element-plus.gitee.io/zh-CN/component/tree.html#%E6%87%92%E5%8A%A0%E8%BD%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8F%B6%E5%AD%90%E8%8A%82%E7%82%B9
         */
        return resolve([]);
      }

      if (node.data.type == "ServerGroup") {
        return getServerNode(node.data, resolve);
        // return resolve(node.data.children);
      } else if (node.data.type == "Server") {
        return getDatabase(node.data, resolve);
      }
    };
    /**
     * get server list
     */
    const getServerNode = (node: any, resolve) => {
      let groupName = node.object.name;
      getServerList(groupName).then(
        (respon: ResponseData<TreeNode<Server>[]>) => {
          console.log("succ respon ", respon);
          resolve(respon.data);
        }
      );
    };
    /**
     * get server list
     */
    const getDatabase = (node: any, resolve) => {
      serverConnect(node).then((respon: any) => {
        console.log("serverConnect succ respon ", respon);
        // resolve(respon.data);
        node.connectionId = respon.data;
        getDatabaseList(node).then((respon: any) => {
          console.log("getDatabaseList succ respon ", respon);
          resolve(respon.data);
        });
        resolve([]);
      });
      resolve([]);
    };
    return {
      treeRef,
      state,
      treeProps,
      buttonDropdown,
      addDropDownMenu,
      handleCommand,
      loadNode,
      openRemoveNodeDialog,
      openRenameNodeDialog,
      handleRemoveNodeSubmit,
      handleRenameNodeSubmit,

      openObjectAdd,
      openObjectEdit,

      handleNodeClick,
      saveServerGroup,
      switchGroupVisable,
      switchServerAddVisable,
      switchServerEditVisable,
      handleServerUpdate,
      handleSaveServer,
      handleEditServer,
      handleTestServer,
      switchDBAddVisable,
      switchDBEditVisable,
      handleSaveDB,
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
.tree-node-row .tree-node-button {
  margin-left: auto !important;
  margin-right: 16px !important;
  visibility: hidden;
}

/* .tree-node-action {
  flex-shrink: 0;
  z-index: 2;
  box-sizing: border-box;
  margin-left: auto !important;
  margin-right: 16px !important;
  visibility: hidden;
} */
/**图标间距 */
.tree-node-action .el-icon {
  margin-right: 3px;
}
.el-tree-node__content:hover .tree-node-button,
.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .tree-node-button {
  visibility: visible;
}
</style>