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
              <el-icon><message-box @click="addDropDownMenu(node)" /></el-icon>
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
        </div>
      </template>
    </el-tree>

    <!-- ===============================关闭连接======================================= -->
    <template v-if="state.closeConnectDialogVisible">
      <el-dialog
        :close-on-click-modal="false"
        v-model="state.closeConnectDialogVisible"
        title="关闭连接"
        width="30%"
        center
      >
        <span>保存服务器信息必须关闭服务器连接。要关闭连接吗？</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.closeConnectDialogVisible = false"
              >取消</el-button
            >
            <el-button
              type="primary"
              @click="handleEditServer(state.closeConnectForm)"
              >确认</el-button
            >
          </span>
        </template>
      </el-dialog>
    </template>

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

    <!-- ===============================Server======================================= -->
    <ServerDialogAdd
      :visible="state.serverAddVisible"
      @saveModal="handleSaveServer"
      @closeModal="switchServerAddVisable"
    />
    <ServerPwdDialog
      :visible="state.serverPwdVisible"
      @saveModal="handleServerPwdSubmit"
      @closeModal="switchServerPwdVisable"
    />
    <template v-if="state.serverEditVisible">
      <!-- Server弹出框 -->
      <ServerDialogEdit
        :visible="state.serverEditVisible"
        :serverObject="state.serverForm"
        @saveModal="isConnect"
        @closeModal="switchServerEditVisable"
        @testModal="handleTestServer"
      />
    </template>

    <!-- ===============================database======================================= -->
    <template v-if="state.dbAddVisible">
      <DBAddDialog
        :visible="state.dbAddVisible"
        :dbForm="state.dbForm"
        @saveModal="handleSaveDB"
        @closeModal="switchDBAddVisable"
      />
    </template>
    <template v-if="state.dbEditVisible">
      <DBEditDialog
        :visible="state.dbEditVisible"
        :dbForm="state.dbForm"
        @saveModal="handleDBUpdateSubmit"
        @closeModal="switchDBEditVisable"
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
  closeServer,
  getServerList,
  getDatabaseList,
  serverConnect,
  addDB,
  updatePassword,
  editDatabase,
} from "@/api/treeNode";
import RenameNodeDialog from "./renameNode.vue";
import ServerDialogAdd from "@/components/server/ServerDialogAdd.vue";
import ServerDialogEdit from "@/components/server/ServerDialogEdit.vue";
import ServerPwdDialog from "@/components/server-password/index.vue";

import DBAddDialog from "@/components/database/DatabaseAddDialog.vue";
import DBEditDialog from "@/components/database/DatabaseEditDialog.vue";

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
  TreeNodeRename,
  DropDownMenu,
  ServerPwdForm,
  DatabaseEditForm,
} from "@/types";
import { breadcrumbProps, ElMessage } from "element-plus";

import { getNodePath } from "@/utils/tree";

interface TreeNodeState {
  dropdownMenu: DropDownMenu[];
  treeNode: Node | null;
  removeDialogVisible: Boolean;
  renameDialogVisible: Boolean;
  closeConnectDialogVisible: Boolean;
  closeConnectForm: Server | null;

  treeNodeString: string;

  //group
  groupVisible: Boolean;
  groupOldObject: TreeNode<ServerGroup> | null;
  groupOldName: string;

  //server
  serverAddVisible: Boolean;
  serverEditVisible: Boolean;
  serverForm: Server | null;
  serverObject: TreeNode<Server> | null;
  serverPwdVisible: Boolean;

  //database
  dbAddVisible: Boolean;
  dbEditVisible: Boolean;
  dbForm: Database | null;
}

export default defineComponent({
  name: "treeNode",
  components: {
    MessageBox,
    RenameNodeDialog,
    ServerDialogAdd,
    ServerDialogEdit,
    ServerPwdDialog,
    DBAddDialog,
    DBEditDialog,
  },
  props: {
    treeData: Array,
    addTreeNode: Function,
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
      closeConnectDialogVisible: false, //关闭连接
      closeConnectForm: null, //存储关闭连接时候form对象

      treeNodeString: "",
      //group
      groupVisible: false,
      groupOldObject: null,
      groupOldName: "",

      //server
      serverAddVisible: false,
      serverEditVisible: false,
      serverForm: null,
      serverObject: null,
      serverPwdVisible: false,

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
      // console.log("handleNodeClick data", data);
      // console.log("handleNodeClick tree", treeRef.value);
    };
    /**
     * 0删除，1重命名，2刷新，
     * 11新建连接
     * 20打开连接，21关闭连接，22新建数据库，23修改密码，24编辑连接
     */
    const addDropDownMenu = (node: Node) => {
      // console.log("addDropDownMenu node =", node);
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
        const count = node.childNodes.length;
        if (count > 0) {
          menu.push({
            key: 21,
            text: "关闭连接",
            disabled: false,
            onClick: handleCloseConnect,
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
            disabled: false,
            onClick: openServerPwdDialog,
          });
        } else {
          menu.push({
            key: 20,
            text: "打开连接",
            disabled: false,
            onClick: handleOpenConnect,
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
      } else if (treeNode.type == "Database") {
        const defDB = node.parent.data.object.databaseName as string;
        if (treeNode.object.name == defDB) {
          //默认库
          menu.push({
            key: 30,
            text: "关闭数据库",
            disabled: true,
            onClick: handleCloseDB,
          });
        } else {
          menu.push({
            key: 31,
            text: "打开数据库",
            disabled: true,
            onClick: handleCloseDB,
          });
        }
        menu.push({
          key: 32,
          text: "新建数据库",
          disabled: false,
          onClick: openObjectAdd,
        });
        menu.push({
          key: 33,
          text: "编辑数据库",
          disabled: false,
          onClick: openObjectEdit,
        });
        menu.push(removeMenu);
        menu.push(refreshMenu);
      }
      state.dropdownMenu = menu;
    };
    /**
     * 右键选择了一个按钮
     */
    const handleCommand = (row: { menu: DropDownMenu; node: Node }) => {
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
      } else if (type === "Server" || type === "Database") {
        //新建数据库
        if (type === "Server") {
          state.treeNode = node;
        } else {
          state.treeNode = node.parent;
        }
        //连接server使用的dbname
        const dbname = state.treeNode.data.object.databaseName;
        //查找默认db数据
        const defaultDatabase: Node = state.treeNode.childNodes.filter(
          (element: Node) => {
            if (dbname == element.data.object.name) return true;
          }
        )[0];
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
          datallowconn: true, //允许连接
          connectionId: node.data.connectionId as string,
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
      } else if (type === "Database") {
        handleDBUpdate(node);
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
      const nodePath = getNodePath(state.treeNode!);
      const delObject = state.treeNode?.data as TreeNode<any>;
      delObject.nodePath = nodePath;

      const data: TreeNodeDel = {
        delObject: delObject, //删除对象
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
        state.renameDialogVisible = false;
        state.treeNode!.data = result.data;
      });
    };
    //---------------Group---------------------

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
      state.groupOldName = "";
      if (node.level == 2) {
        state.groupOldName = node.parent.data.object.name;
      }
      state.treeNodeString = JSON.stringify(row); //存储old值，用于save参数
      state.treeNode = node; //用于请求成功后的更新
      //注意：这里传的是object对象，save时候需要把外面包一层
      state.serverForm = row.object; //传给子界面
      switchServerEditVisable(true);
    };
    //测试连接
    const handleTestServer = (form: Server) => {
      //包一层外部对象
      const serverObject: TreeNode<Server> = {
        connectionId: "",
        contextId: "",
        object: form,
        nodePath: "",
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
        contextId: "",
        object: form,
        nodePath: getNodePath(state.treeNode!),
        type: "Server",
      };
      addServer(serverObject).then((result: ResponseData) => {
        switchServerAddVisable(false);
        treeRef.value.append(result.data, state.treeNode);
      });
    };
    //验证是否已连接
    const isConnect = (form: Server) => {
      if (state.treeNode!.childNodes.length > 0) {
        //正在连接，提示关闭
        state.closeConnectForm = form;
        state.closeConnectDialogVisible = true;
      } else {
        //未打开连接，保存
        handleEditServer(form);
      }
    };
    //修改连接 ---a)关闭连接，保存 b)直接保存
    const handleEditServer = (form: Server) => {
      const newObject: TreeNode<Server> = JSON.parse(state.treeNodeString);
      newObject.object = form;
      const oldObject: TreeNode<Server> = JSON.parse(state.treeNodeString);
      oldObject.nodePath = getNodePath(state.treeNode!);
      const data: ServerEditForm = {
        newObject: newObject, //new val
        oldObject: oldObject,
      };
      if (state.treeNode!.childNodes.length > 0) {
        //关闭连接
        closeServer(oldObject).then(() => {
          state.closeConnectDialogVisible = false;
          handleCloseNode(state.treeNode!);
          editServer(data).then((result: ResponseData<TreeNode<Server>>) => {
            switchServerEditVisable(false);
            state.treeNode!.data = result.data;
          });
        });
      } else {
        editServer(data).then((result: ResponseData<TreeNode<Server>>) => {
          switchServerEditVisable(false);
          state.treeNode!.data = result.data;
        });
      }
    };
    /**
     * 修改密码弹窗
     */
    const openServerPwdDialog = (node: Node) => {
      state.treeNode = node;
      switchServerPwdVisable(true);
    };
    const switchServerPwdVisable = (flag: boolean) => {
      state.serverPwdVisible = flag;
    };
    /**
     * 修改密码弹窗
     */
    const handleServerPwdSubmit = (form: ServerPwdForm) => {
      if (state.treeNode?.level == 2) {
        form.serverGroupName = state.treeNode.data.object.name;
      }
      form.serverID = state.treeNode!.data.connectionId;
      updatePassword(form).then((result: ResponseData<any>) => {
        switchServerPwdVisable(false);
      });
    };
    /**
     * 打开连接
     */
    const handleOpenConnect = (node: Node) => {
      node.loadData(function (data: any) {
        console.log("handleOpenConnect", data);
        if (data.length == 0) {
          return handleCloseNode(node);
        }
        node.expanded = true;
      });
    };
    /**
     * 关闭连接
     */
    const handleCloseConnect = (node: Node) => {
      const oldObject = node.data as TreeNode<Server>;
      closeServer(oldObject).then(() => {
        handleCloseNode(node);
      });
    };
    /**
     * 关闭树形节点
     */
    const handleCloseNode = (node: Node) => {
      node.childNodes = [];
      node.expanded = false;
      node.isLeaf = false;
      node.loaded = false;
      node.loading = false;
      node.data.connectionId = "";
    };
    /**
     * 关闭数据库
     */
    const handleCloseDB = (node: Node) => {
      node.childNodes = [];
      node.expanded = false;
      node.isLeaf = false;
      node.loaded = false;
      node.data.connectionId = "";
    };

    //---------------database---------------------
    //db编辑窗口开关
    const switchDBAddVisable = (flag: boolean) => (state.dbAddVisible = flag);
    const switchDBEditVisable = (flag: boolean) => (state.dbEditVisible = flag);
    const handleSaveDB = (form: Database) => {
      const server: any = state.treeNode?.data;
      //包一层外部对象
      const newObject: TreeNode<Database> = {
        connectionId: server.connectionId,
        contextId: "",
        object: form,
        nodePath: getNodePath(state.treeNode!),
        type: "Database",
      };
      addDB(newObject).then((result: ResponseData) => {
        switchDBAddVisable(false);
        if (result.data != null)
          treeRef.value.append(result.data, state.treeNode);
      });
    };
    const handleDBUpdate = (node: Node) => {
      console.log("handleDBUpdate node ", node);
      const row = node.data as TreeNode<Database>;
      state.treeNodeString = JSON.stringify(row); //存储old值，用于save参数

      state.treeNode = node; //用于请求成功后的更新
      state.dbForm = row.object; //传给子界面
      state.dbForm.connectionId = node.data.connectionId;
      switchDBEditVisable(true);
    };
    const handleDBUpdateSubmit = (form: Database) => {
      console.log("handleDBUpdateSubmit form ", form);
      const newObject: TreeNode<Database> = JSON.parse(state.treeNodeString);
      newObject.object = form;
      const oldObject: TreeNode<Database> = JSON.parse(state.treeNodeString);
      oldObject.nodePath = getNodePath(state.treeNode!);
      const data: DatabaseEditForm = {
        newObject: newObject,
        oldObject: oldObject,
      };
      editDatabase(data).then((result: ResponseData) => {
        switchDBEditVisable(false);
        state.treeNode!.data = result.data;
      });
    };

    /**
     * 展开属性菜单 懒加载
     */
    const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
      console.log("loadNode node", node);
      if (node.level === 0) {
        /**
         * ROOT节点，为了实现懒加载
         * https://element-plus.gitee.io/zh-CN/component/tree.html#%E6%87%92%E5%8A%A0%E8%BD%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8F%B6%E5%AD%90%E8%8A%82%E7%82%B9
         */
        return resolve([]);
      }
      if (node.data.type == "ServerGroup") {
        return getServerNode(node, resolve);
        // return resolve(node.data.children);
      } else if (node.data.type == "Server") {
        return getDatabase(node, resolve);
      }
    };
    /**
     * get server list
     */
    const getServerNode = (node: Node, resolve) => {
      const nodeData = node.data as TreeNode<ServerGroup>;
      let groupName = nodeData.object.name;
      getServerList(groupName).then(
        (respon: ResponseData<TreeNode<Server>[]>) => {
          console.log("succ respon ", respon);
          resolve(respon.data);
        },
        (err) => {
          console.log("err", err);
          handleCloseNode(node);
        }
      );
    };
    /**
     * get server list
     */
    const getDatabase = (node: Node, resolve) => {
      const nodeData = node.data as TreeNode<Server>;
      nodeData.nodePath = getNodePath(node);
      serverConnect(nodeData).then(
        (resp: ResponseData<any>) => {
          console.log("serverConnect succ respon ", resp);
          const connectionId = resp.data;
          nodeData.connectionId = connectionId;
          getDatabaseList(nodeData).then(
            (resp2: ResponseData<any>) => {
              console.log("getDatabaseList succ respon ", resp2, node, resp);
              resp2.data.forEach((element: TreeNode<Database>) => {
                //赋值connectionId
                if (element.object.name == nodeData.object.databaseName) {
                  element.connectionId = connectionId;
                }
              });
              nodeData.connectionId = connectionId;
              resolve(resp2.data);
            },
            (err) => {
              console.log("err", err);
              handleCloseNode(node);
            }
          );
          resolve([]);
        },
        (err) => {
          console.log("err", err);
          handleCloseNode(node);
        }
      );
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
      handleNodeClick,

      openRemoveNodeDialog,
      openRenameNodeDialog,
      handleRemoveNodeSubmit,
      handleRenameNodeSubmit,
      handleCloseNode,

      openObjectAdd,
      openObjectEdit,

      switchServerAddVisable,
      switchServerEditVisable,
      handleServerUpdate,
      handleSaveServer,
      isConnect,
      handleEditServer,
      handleTestServer,
      switchServerPwdVisable,
      handleServerPwdSubmit,
      handleOpenConnect,

      handleCloseDB,
      switchDBAddVisable,
      switchDBEditVisable,
      handleDBUpdate,
      handleSaveDB,
      handleDBUpdateSubmit,
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
  margin-top: 3px;
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