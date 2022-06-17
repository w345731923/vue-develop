<template>
  <div class="tree-view">
    <el-tree :data="treeData" node-key="id" :expand-on-click-node="false" :highlight-current="true" :load="loadNode"
      lazy ref="treeRef" :props="treeProps">
      <template #default="{ node, data }">
        <div class="tree-node-row" aria-selected="false" @click="handleNodeClick($event, data, node)">
          <div class="tree-node-icon tree-node-icon-gt">
            <img src="../../assets/server.png" v-if="data.type === 'ServerGroup'" />
            <img src="../../assets/hgdb16.png" v-if="data.type === 'Server'" />
            <img src="../../assets/database.png" v-if="
              data.type === 'Database' &&
              data.connectionId != null &&
              data.connectionId != ''
            " />
            <img src="../../assets/database_icon.png" v-if="
              data.type === 'Database' &&
              (data.connectionId == null || data.connectionId == '')
            " />
            <img src="../../assets/folder_schema.png" v-if="data.type === 'SchemaGroup'" />
            <img src="../../assets/folder_table.png" v-if="data.type === 'RoleGroup'" />
            <img src="../../assets/folder_database.png" v-if="data.type === 'TableSpaceGroup'" />
            <!-- <img
              src="../../assets/folder_admin.png"
              v-if="data.type === 'RoleGroup'"
            /> -->
            <img src="../../assets/schema.png" v-if="data.type === 'Schema'" />
            <img src="../../assets/folder_table.png" v-if="data.type === 'TableGroup'" />
            <img src="../../assets/folder_view.png" v-if="data.type === 'ViewsGroup'" />

            <img src="../../assets/folder_table.png" v-if="data.type === 'table-group'" />
            <img src="../../assets/table.png" v-if="data.type === 'Table'" />
            <img src="../../assets/folder_user.png" v-if="data.type === 'role-group'" />
            <img src="../../assets/user.png" v-if="node.data.type === 'user'" />
          </div>
          <div class="tree-node-name tree-node-name-gt" style="padding-right: 16px">
            <span v-if="
              data.type == 'SchemaGroup' ||
              data.type == 'RoleGroup' ||
              data.type == 'TableSpaceGroup' ||
              data.type == 'TableGroup' ||
              data.type == 'ViewsGroup'
            ">
              <span>{{ data.text }}</span>
            </span>
            <span v-else-if="data.type == 'Server' || data.type == 'Database'">
              <span v-html="data.object.displayName"></span>
            </span>
            <!-- <span v-else-if="data.type == 'Table' || data.type == 'Database'">
              <span>{{ data.object.name }}</span>
            </span> -->
            <span v-else> {{ data.object.name }}</span>
          </div>
          <div class="tree-node-button">
            <el-dropdown ref="buttonDropdown" trigger="click" @command="handleCommand">
              <el-icon>
                <message-box @click="addDropDownMenu(node)" />
              </el-icon>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item class="dropMenu-item" v-for="(item, index) in state.dropdownMenu" :key="index"
                    :command="{ menu: item, node: node }" :disabled="item.disabled">{{ item.text }}
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
      <el-dialog :close-on-click-modal="false" v-model="state.closeConnectDialogVisible" title="关闭连接" width="30%"
        center>
        <span>保存服务器信息必须关闭服务器连接。要关闭连接吗？</span>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="state.closeConnectDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleEditServer(state.closeConnectForm)">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </template>

    <!-- ===============================删除节点======================================= -->
    <template v-if="state.removeDialogVisible">
      <RemoveNodeDialog :visible="state.removeDialogVisible" :data="state.treeNode?.data"
        @saveModal="handleRemoveNodeSubmit" @closeModal="state.removeDialogVisible = false" />
    </template>
    <!-- ===============================重命名节点======================================= -->
    <template v-if="state.renameDialogVisible">
      <RenameNodeDialog :visible="state.renameDialogVisible" :data="state.treeNode?.data"
        @saveModal="handleRenameNodeSubmit" @closeModal="state.renameDialogVisible = false" />
    </template>

    <!-- ===============================Server======================================= -->
    <ServerDialogAdd :visible="state.serverAddVisible" @saveModal="handleSaveServer"
      @closeModal="switchServerAddVisable" />
    <ServerPwdDialog :visible="state.serverPwdVisible" @saveModal="handleServerPwdSubmit"
      @closeModal="switchServerPwdVisable" />
    <template v-if="state.serverEditVisible">
      <!-- Server弹出框 -->
      <ServerDialogEdit :visible="state.serverEditVisible" :serverObject="state.serverForm" @saveModal="isConnect"
        @closeModal="switchServerEditVisable" />
    </template>
    <template v-if="state.enterPwdDialogVisible">
      <EnterPassword :visible="state.enterPwdDialogVisible" @saveModal="handleEnterPwdSubmit"
        @closeModal="handleEnterPwdCancel" />
    </template>

    <!-- ===============================database======================================= -->
    <template v-if="state.dbAddVisible">
      <DBFormDialog :visible="state.dbAddVisible" :defaultForm="state.defaultForm" :parentForm="state.parentForm"
        @saveModal="handleAddDB" @closeModal="switchDBAddVisable" />
    </template>
    <template v-if="state.dbEditVisible">
      <DBFormDialog :visible="state.dbEditVisible" :defaultForm="state.defaultForm"
        :treeNodeString="state.treeNodeString" @saveModal="handleDBUpdateSubmit" @closeModal="switchDBEditVisable" />
    </template>
    <!-- ===============================schema======================================= -->
    <template v-if="state.schemaAddVisible">
      <SchemaFormDialog :visible="state.schemaAddVisible" :defaultForm="state.defaultForm"
        :parentForm="state.parentForm" @saveModal="handleAddSchemaSubmit" @closeModal="switchSchemaAddVisable" />
    </template>
    <template v-if="state.schemaEditVisible">
      <SchemaFormDialog :visible="state.schemaEditVisible" :defaultForm="state.defaultForm"
        :parentForm="state.parentForm" :treeNodeString="state.treeNodeString" @saveModal="handleSchemaUpdateSubmit"
        @closeModal="switchSchemaEditVisable" />
    </template>
  </div>
</template>

<script lang="ts">
import { MessageBox } from "@element-plus/icons-vue";
import type Node from "element-plus/es/components/tree/src/model/node";
interface Tree {
  name: string;
  leaf?: boolean;
  data: any;
}
import { ElMessage } from "element-plus";

import {
  defineComponent,
  toRefs,
  computed,
  ref,
  watch,
  Ref,
  watchEffect,
} from "vue";
import { reactive } from "vue";
import {
  getTreeNodeDel,
  getTreeNodeRename,
  addServer,
  editServer,
  closeServer,
  getServerList,
  getDatabaseList,
  serverConnect,
  addDB,
  updatePassword,
  editDatabase,
  getSchemaList,
  addSchema,
  editSchema,
  closeDatabase,
  openDatabase,
  getTableList,
  getTableDesign,
  checkConnect,
} from "@/api/treeNode";
import RemoveNodeDialog from "./removeNode.vue";
import RenameNodeDialog from "./renameNode.vue";
import ServerDialogAdd from "@/components/server/ServerDialogAdd.vue";
import ServerDialogEdit from "@/components/server/ServerDialogEdit.vue";
import EnterPassword from "@/components/server/EnterPassword.vue";

import ServerPwdDialog from "@/components/server-password/index.vue";

import DBFormDialog from "@/components/database/DatabaseDialog.vue";
import SchemaFormDialog from "@/components/schema/SchemaDialog.vue";

import {
  ResponseData,
  Server,
  ServerGroup,
  TreeNode,
  ServerEditForm,
  TreeNodeDel,
  Database,
  TreeNodeRename,
  DropDownMenu,
  ServerPwdForm,
  DatabaseEditForm,
  SchemaEditForm,
  Schema,
  TableSimple,
} from "@/types";
import { getNodePath } from "@/utils/tree";

interface TreeNodeState {
  dropdownMenu: DropDownMenu[];
  treeNode: Node | null;
  treeResolve: Function | undefined;
  removeDialogVisible: boolean;
  renameDialogVisible: boolean;
  closeConnectDialogVisible: boolean;
  closeConnectForm: Server | null;

  treeNodeString: string;
  parentForm: TreeNode<any> | null; //sql预览的父类
  defaultForm: any;

  //group
  groupVisible: boolean;
  groupOldObject: TreeNode<ServerGroup> | null;
  groupOldName: string;

  //server
  serverAddVisible: boolean;
  serverEditVisible: boolean;
  serverForm: Server | null;
  serverObject: TreeNode<Server> | null;
  serverPwdVisible: boolean;
  enterPwdDialogVisible: boolean;

  //database
  dbAddVisible: boolean;
  dbEditVisible: boolean;

  //schema
  schemaAddVisible: boolean;
  schemaEditVisible: boolean;
}
export default defineComponent({
  name: "treeNode",
  components: {
    MessageBox,
    RenameNodeDialog,
    RemoveNodeDialog,
    ServerDialogAdd,
    ServerDialogEdit,
    ServerPwdDialog,
    EnterPassword,
    DBFormDialog,
    SchemaFormDialog,
  },
  props: {
    treeData: Array,
  },
  emits: ["addTable", "modifyTabsTitle"],
  setup(props, { emit }) {
    const treeRef: Ref = ref(null); //树形结果对象
    const buttonDropdown = ref(); //节点扩展按钮下拉对象

    // Props	说明	类型	可选值	默认值
    // label	指定节点标签为节点对象的某个属性值	string, function(data, node)	—	—
    // children	指定子树为节点对象的某个属性值	string	—	—
    // disabled	指定节点选择框是否禁用为节点对象的某个属性值	string, function(data, node)	—	—
    // isLeaf	指定节点是否为叶子节点，仅在指定了 lazy 属性的情况下生效	string, function(data, node)	—	—
    // class	自定义节点类名	string, function(data, node)	—	—    
    const treeProps = {
      // label: "",
      // children: "",
      // isLeaf: "",
    };
    const state = reactive<TreeNodeState>({
      dropdownMenu: [],
      treeNode: null,
      treeResolve: undefined,
      removeDialogVisible: false, //移除节点
      renameDialogVisible: false, //重命名节点
      closeConnectDialogVisible: false, //关闭连接
      closeConnectForm: null, //存储关闭连接时候form对象

      treeNodeString: "",
      parentForm: null,
      defaultForm: null,

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
      enterPwdDialogVisible: false,
      //db
      dbAddVisible: false,
      dbEditVisible: false,
      //schema
      schemaAddVisible: false,
      schemaEditVisible: false,
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
        disabled: false,
        onClick: refreshNode,
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
        const connectionId = treeNode.connectionId;
        if (connectionId) {
          //默认库
          menu.push({
            key: 30,
            text: "关闭数据库",
            disabled: false,
            onClick: handleCloseDB,
          });
        } else {
          menu.push({
            key: 31,
            text: "打开数据库",
            disabled: false,
            onClick: handleOpenDB,
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
      } else if (treeNode.type == "SchemaGroup") {
        //模式、角色、表空间、管理
        menu.push({
          key: 40,
          text: "新建模式",
          disabled: false,
          onClick: openObjectAdd,
        });
        menu.push(refreshMenu);
      } else if (treeNode.type == "Schema") {
        menu.push({
          key: 41,
          text: "新建模式",
          disabled: false,
          onClick: openObjectAdd,
        });
        menu.push({
          key: 42,
          text: "编辑模式",
          disabled: false,
          onClick: openObjectEdit,
        });
        menu.push(removeMenu);
        menu.push(renameMenu);
        menu.push(refreshMenu);
      } else if (treeNode.type == "TableGroup") {
        menu.push({
          key: 50,
          text: "新建表",
          disabled: false,
          onClick: openObjectAdd,
        });
        menu.push(refreshMenu);
      } else if (treeNode.type == "Table") {
        menu.push({
          key: 61,
          text: "打开表",
          disabled: false,
          onClick: openObjectAdd,
        });
        menu.push({
          key: 62,
          text: "设计表",
          disabled: false,
          onClick: openTableDesign,
        });
        menu.push({
          key: 60,
          text: "新建表",
          disabled: false,
          onClick: openObjectAdd,
        });
        menu.push(removeMenu);
        menu.push({
          key: 63,
          text: "清空表",
          disabled: false,
          onClick: openObjectAdd,
        });
        menu.push(renameMenu);
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

    const getPath = (child: Node) => {
      if (child.data.type == 'ServerGroup') {
        return 'ServerGroup/' + child.data.object.name
      } else if (child.data.type == 'Server') {
        return 'Server/' + child.data.object.id
      } else if (child.data.type == 'Database') {
        return 'Database/' + child.data.object.oid
      } else if (child.data.type == 'SchemaGroup') {
        return 'SchemaGroup/' + child.data.object.oid;
      } else if (child.data.type == 'Schema') {
        return 'Schema/' + child.data.object.oid
      } else if (child.data.type == 'TableGroup') {
        return 'TableGroup/' + child.data.object.oid
      } else if (child.data.type == 'Table') {
        return 'Table/' + child.data.object.oid
      }
      return '';
    }
    const queryChildrenExpand = async (child: Node, path: string[], allPath: string[]) => {
      // console.log('test1 child', child.data.type, child.data.object.name)
      //添加自己
      if (child.expanded) {
        path.push(getPath(child))
      }
      let isChildrenExpand = false;
      // child.childNodes.forEach(child => {
      //   if (child.expanded) {
      //     queryChildrenExpand(child, path, allPath)
      //     isChildrenExpand = true;
      //   }
      // })
      for (let i = 0; i < child.childNodes.length; i++) {
        if (child.childNodes[i].expanded) {
          await queryChildrenExpand(child.childNodes[i], path, allPath)
          isChildrenExpand = true;
        }
      }
      if (!isChildrenExpand && child.childNodes.length > 0) {
        // console.log('push content ', path)
        allPath.push(path.join(','))
        //移除最后一个元素，下次递归还会添加同级元素
        path = path.splice(path.length - 1, 1)
      }
    }
    const getExpandList = async (node: Node) => {
      let allPath: string[] = [];
      //添加刷新的节点
      let selfPath = getPath(node);
      //获取节点展开数组
      // node.childNodes.forEach(child => {
      //   const childPath: string[] = [];
      //   childPath.push(selfPath)
      //   queryChildrenExpand(child, childPath, allPath);
      // })
      for (let i = 0; i < node.childNodes.length; i++) {
        console.log('node.childNodes forEach', node.childNodes[i])
        const childPath: string[] = [];
        childPath.push(selfPath)
        await queryChildrenExpand(node.childNodes[i], childPath, allPath);
      }

      // 如果子节点都没有展开（暂时不添加自己）
      if (allPath.length == 0) {
        allPath.push(selfPath)
      }
      return allPath;
    }
    //当前节点刷新操作
    const refreshNode = async (node: Node) => {
      console.log('refreshNode1 start.. Node', node.data.type, node.data.object.name)
      /**
       * a)记录展开节点
       */
      const expandList = getExpandList(node);
      console.log('refreshNode expandList', expandList)

      node.expanded = false;
      startRefresh(await expandList, node)
    }
    const startRefresh = async (expandList: string[], node: Node) => {
      console.log('ff expandList', expandList)
      for (let i = 0; i < expandList.length; i++) {
        console.log('ff expandList forEach', expandList[i])
        const paths = expandList[i].split(',');
        await f1(node, 0, paths)
      }
    }
    /**
     * 递归核心方法
     */
    const f1 = async (child: Node, index: number, paths: string[]) => {
      console.log('f1>>>>>> type=', child.data.type + ', path=' + paths[index] + ', oid=' + child.data.object.oid)

      console.log('查询节点是否展开，expanded =', child.expanded)
      if (!child.expanded) {
        let result = await queryNodeChildrenData(child)
        console.log('子节点查询成功，result =', result)
        //没有展开节点
        await noExpand(child, result)
      }
      /**
        * 查询子元素是否需要展开
        * n=0,0是当前自己，所以从1开始
        */
      if (index + 1 >= paths.length) {
        //是最后一个，不操作
        console.log('当前path是最后一个,index=' + index + ',paths.length=', paths.length)
      } else {
        console.log('查询子元素是否需要展开,index=' + index + ',paths.length=', paths.length + 'children length = ' + child.childNodes.length)
        for (let i = 0; i < child.childNodes.length; i++) {
          await switchDbobject(child.childNodes[i], index + 1, paths)
        }
      }
    }
    /**
     * 切换进入不同的对象，进行递归
     */
    const switchDbobject = async (next: Node, index: number, paths: string[]) => {
      console.log('switchDbobject type=', next.data.type + ', path=' + paths[index] + ', oid=' + next.data.object.oid)
      if (next.data.type == 'Server' && paths[index].indexOf(next.data.object.id) > -1) {
        console.log('Server enter,', next)
        await f1(next, index, paths)
      } else if (next.data.type == 'Database' && paths[index].indexOf(next.data.object.oid) > -1) {
        console.log('Database enter,', next)
        await f1(next, index, paths)
      } else if (next.data.type == 'SchemaGroup' && paths[index].indexOf(next.data.object.oid) > -1) {
        console.log('SchemaGroup enter,', next)
        await f1(next, index, paths)
      } else if (next.data.type == 'Schema' && paths[index].indexOf(next.data.object.oid) > -1) {
        console.log('Schema enter,', next)
        await f1(next, index, paths)
      } else if (next.data.type == 'TableGroup' && paths[index].indexOf(next.data.object.oid) > -1) {
        console.log('TableGroup enter,', next)
        await f1(next, index, paths)
      }
    }
    /**
     * 没有展开节点的处理，移除元素和添加元素
     */
    const noExpand = (child: Node, result: any) => {
      /**
      * a)移除节点的子节点
      */
      const length = child.childNodes.length;
      console.log('开始移除old节点 childNodes length =', length)
      for (let i = 0; i < length;) {
        child.removeChild(child.childNodes[i])
        if (child.childNodes.length == 0) break;
      }
      /**
       * b)给刷新节点添加获取的新元素
       */
      console.log('移除old节点成功，添加子节点 respon!.data length =', result!.data.length)
      for (let i = 0; i < result!.data.length; i++) {
        treeRef.value.append(result!.data[i], child);
      }
      child.expanded = true;
    }
    //递归查询
    const queryNodeChildrenData = async (node: Node) => {
      console.log('queryChildren node', node)
      const nodeData = node.data as TreeNode<any>;
      node.data.nodePath = getNodePath(node);
      if (nodeData.type == 'ServerGroup') {
        let groupName = nodeData.object.name;
        return await getServerList(groupName);
      } else if (nodeData.type == 'Server') {
        return await getDatabaseList(nodeData);
      } else if (nodeData.type == 'SchemaGroup') {
        return await getSchemaList(nodeData)
      } else if (nodeData.type == 'TableGroup') {
        return await getTableList(nodeData)
      } else if (nodeData.type == 'Database') {
        const result: ResponseData<TreeNode<any>[]> = {} as ResponseData<TreeNode<any>[]>;
        const data = [] as TreeNode<any>[];
        data.push({
          type: "SchemaGroup",
          contextId: "",
          nodePath: "",
          connectionId: nodeData.connectionId,
          object: nodeData.object,
          text: "模式",
        });
        result.data = data;
        return result;
      } else if (nodeData.type == 'Schema') {
        const result: ResponseData<TreeNode<any>[]> = {} as ResponseData<TreeNode<any>[]>;
        const data = [] as TreeNode<any>[];
        data.push({
          type: "TableGroup",
          contextId: "",
          nodePath: "",
          connectionId: nodeData.connectionId,
          object: nodeData.object,
          text: "表",
        });
        result.data = data;
        return result;
      }
    }

    /**
     * 新建菜单对象
     */
    const openObjectAdd = (node: Node) => {
      console.log("openObjectAdd node", node);
      const type = node.data.type;
      if (type === "ServerGroup") {
        //右键group、点击工具栏创建server
        state.treeNode = node;
        switchServerAddVisable(true);
      } else if (type === "Server" || type === "Database") {
        //在server节点、database节点，新建database
        if (type === "Server") {
          state.treeNode = node;
        } else {
          state.treeNode = node.parent;
        }
        state.parentForm = state.treeNode.data as TreeNode<any>;

        //连接server使用的dbname
        const dbname = state.treeNode.data.object.databaseName;
        //查找默认db数据
        const defaultDatabase: Node = state.treeNode.childNodes.filter(
          (element: Node) => {
            if (dbname == element.data.object.name) return true;
          }
        )[0];
        state.defaultForm = {
          "@clazz": "com.highgo.developer.model.HgdbDatabase",
          name: "", //数据库名
          encoding: defaultDatabase.data.object.encoding, //编码 "UTF8"
          collation: "", //排序规则排序  "zh_CN.UTF-8"
          characterType: "", //字符分类  "zh_CN.UTF-8"
          connectionLimit: defaultDatabase.data.object.connectionLimit, //连接限制 -1
          description: "", //注释
          databaseowner: defaultDatabase.data.object.databaseowner, //拥有者
          spcname: defaultDatabase.data.object.spcname, //表空间  "pg_default"
          templateName: "", //范本
          datistemplate: false, //是范本
          datallowconn: true, //允许连接
          connectionId: state.treeNode.data.connectionId as string,
        };
        switchDBAddVisable(true);
      } else if (type === "SchemaGroup" || type === "Schema") {
        //在模式、schema节点，新建schema

        if (type === "SchemaGroup") {
          state.treeNode = node;
        } else {
          state.treeNode = node.parent;
        }
        state.parentForm = state.treeNode.data as TreeNode<any>;
        state.defaultForm = {
          "@clazz": "com.highgo.developer.model.HgdbSchema",
          name: "", //数据库名
          rolname: state.treeNode.data.object.databaseowner, //拥有者
          connectionId: state.treeNode.data.connectionId as string,
        };
        switchSchemaAddVisable(true);
      } else if (type === "TableGroup" || type === "Table") {
        //新建表
        if (type === "TableGroup") {
          state.treeNode = node;
        } else {
          state.treeNode = node.parent;
        }
        checkConnect(state.treeNode.data.connectionId).then(() => {
          state.treeNode!.data.nodePath = getNodePath(state.treeNode!);
          const val = JSON.stringify(state.treeNode!.data);
          sessionStorage.setItem("create-table-session", val);
          const names = state.treeNode!.data.nodePath.split("/");
          const currentTime = new Date().getTime();
          let tabId = "create-table" + currentTime;
          //表名@数据库名.模式名(server名)
          emit("addTable", tabId, "newtable@" + names[7] + "." + names[5] + '(' + names[3] + ')');
        });
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
      } else if (type === "Schema") {
        handleSchemaUpdate(node);
      }
    };
    /**
     * 删除节点弹窗
     */
    const openRemoveNodeDialog = (node: Node) => {
      state.treeNode = node;
      state.removeDialogVisible = true;
      const nodePath = getNodePath(state.treeNode!);
      state.treeNode!.data.nodePath = nodePath;
    };
    /**
     * 删除节点提交
     */
    const handleRemoveNodeSubmit = (form: { isCascadeDelete: boolean }) => {
      const delObject = state.treeNode?.data as TreeNode<any>;
      const data: TreeNodeDel = {
        delObject: delObject, //删除对象
        deleteOptions: { isCascadeDelete: form.isCascadeDelete }, //是否级联
      };
      getTreeNodeDel(data).then(() => {
        state.removeDialogVisible = false;
        treeRef.value.remove(state.treeNode);
        succElMessage('操作成功')
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
      const dbObject = state.treeNode?.data as TreeNode<any>;
      dbObject.nodePath = getNodePath(state.treeNode!);
      const data: TreeNodeRename = {
        dbObject: dbObject, //删除对象
        newName: form.name, //是否级联
      };
      getTreeNodeRename(data).then((result: ResponseData<TreeNode<any>>) => {
        state.renameDialogVisible = false;
        state.treeNode!.data = result.data;
        succElMessage()
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
        succElMessage()
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
          newObject.connectionId = ""; //关闭连接
          handleCloseNode(state.treeNode!);
          editServer(data).then((result: ResponseData<TreeNode<Server>>) => {
            switchServerEditVisable(false);
            state.treeNode!.data = result.data;
            succElMessage()
          });
        });
      } else {
        editServer(data).then((result: ResponseData<TreeNode<Server>>) => {
          switchServerEditVisable(false);
          state.treeNode!.data = result.data;
          succElMessage()
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
      form.nodePath = getNodePath(state.treeNode!);
      updatePassword(form).then(() => {
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
        succElMessage('操作成功')
      });
    };
    /**
     * 输入密码-确定按钮
     */
    const handleEnterPwdSubmit = (form: { password: string }) => {
      const nodeData = state.treeNode?.data as TreeNode<Server>;
      nodeData.nodePath = getNodePath(state.treeNode!);
      nodeData.object.password = form.password;
      state.enterPwdDialogVisible = false;

      serverConnect(nodeData).then(
        (resp: ResponseData<any>) => {
          // console.log("serverConnect succ respon ", resp);
          const connectionId = resp.data;
          nodeData.connectionId = connectionId;
          getDatabaseList(nodeData).then(
            (resp2: ResponseData<any>) => {
              resp2.data.forEach((element: TreeNode<Database>) => {
                //赋值connectionId
                if (element.object.name == nodeData.object.databaseName) {
                  element.connectionId = connectionId;
                }
              });
              nodeData.connectionId = connectionId;
              state.treeResolve!(resp2.data);
            },
            (err) => {
              handleCloseNode(state.treeNode!);
            }
          );
        },
        (err) => {
          console.log("err", err);
          handleCloseNode(state.treeNode!);
        }
      );
    };
    const handleEnterPwdCancel = () => {
      state.enterPwdDialogVisible = false;
      handleCloseNode(state.treeNode!);
    };

    //---------------database---------------------
    //db编辑窗口开关
    const switchDBAddVisable = (flag: boolean) => (state.dbAddVisible = flag);
    const switchDBEditVisable = (flag: boolean) => (state.dbEditVisible = flag);
    const handleAddDB = (form: Database) => {
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
        succElMessage()
      });
    };
    //打开编辑数据库
    const handleDBUpdate = (node: Node) => {
      console.log("handleDBUpdate node ", node);
      node.data.nodePath = getNodePath(node);
      const row = node.data as TreeNode<Database>;
      state.treeNodeString = JSON.stringify(row); //存储old值，用于save参数
      state.treeNode = node; //用于请求成功后的更新

      state.defaultForm = row.object; //传给子界面
      const connectionId = row.connectionId ? row.connectionId : row.defConnectionId;
      state.defaultForm.connectionId = connectionId;
      switchDBEditVisable(true);
    };
    const handleDBUpdateSubmit = (form: Database) => {
      console.log("handleDBUpdateSubmit form ", form);
      const newObject: TreeNode<Database> = JSON.parse(state.treeNodeString);
      newObject.object = form;
      const oldObject: TreeNode<Database> = JSON.parse(state.treeNodeString);
      const data: DatabaseEditForm = {
        newObject: newObject,
        oldObject: oldObject,
      };
      editDatabase(data).then((result: ResponseData) => {
        switchDBEditVisable(false);
        state.treeNode!.data = result.data;
        succElMessage()
      });
    };
    //打开数据库
    const handleOpenDB = (node: Node) => {
      console.log("handleOpenDB node ", node);
      const data = node.data as TreeNode<Database>;
      data.nodePath = getNodePath(node);
      openDatabase(data).then((result: ResponseData<string>) => {
        data.connectionId = result.data;
      });
    };
    //关闭数据库
    const handleCloseDB = (node: Node) => {
      console.log("handleCloseDB node ", node);
      const data = node.data as TreeNode<Database>;
      data.nodePath = getNodePath(node);
      closeDatabase(data).then((result: ResponseData) => {
        handleCloseNode(node);
        succElMessage('操作成功')
      });
    };
    //---------------schema---------------------
    const switchSchemaAddVisable = (flag: boolean) =>
      (state.schemaAddVisible = flag);
    const switchSchemaEditVisable = (flag: boolean) =>
      (state.schemaEditVisible = flag);

    const handleAddSchemaSubmit = (form: Schema) => {
      const server: any = state.treeNode?.data;
      //包一层外部对象
      const newObject: TreeNode<Schema> = {
        connectionId: server.connectionId,
        contextId: "",
        object: form,
        nodePath: getNodePath(state.treeNode!),
        type: "Schema",
      };
      addSchema(newObject).then((result: ResponseData) => {
        switchSchemaAddVisable(false);
        if (result.data != null) result.data.connectionId = server.connectionId;
        treeRef.value.append(result.data, state.treeNode);
        succElMessage()
      });
    };
    const handleSchemaUpdate = (node: Node) => {
      console.log("handleSchemaUpdate node ", node);
      node.data.nodePath = getNodePath(node);
      const row = node.data as TreeNode<Schema>;
      state.treeNodeString = JSON.stringify(row); //存储old值，用于save参数
      state.treeNode = node; //用于请求成功后的更新
      //传给子界面
      state.defaultForm = row.object;
      state.defaultForm.connectionId = node.data.connectionId;
      switchSchemaEditVisable(true);
    };
    const handleSchemaUpdateSubmit = (form: Schema) => {
      console.log("handleSchemaUpdateSubmit form ", form);
      const newObject: TreeNode<Schema> = JSON.parse(state.treeNodeString);
      newObject.object = form;
      const oldObject: TreeNode<Schema> = JSON.parse(state.treeNodeString);
      const data: SchemaEditForm = {
        newObject: newObject,
        oldObject: oldObject,
      };
      editSchema(data).then((result: ResponseData) => {
        switchSchemaEditVisable(false);
        state.treeNode!.data = result.data;
        succElMessage()
      });
    };

    //==============================Table================================
    //设计表
    const openTableDesign = (node: Node) => {
      // state.treeNode = node;
      const data = node.data as TreeNode<TableSimple>;
      data.nodePath = getNodePath(node);

      getTableDesign(data).then((responseData) => {
        console.log("getTableDesign succ responseData ", responseData);

        responseData.data.object.childrenModel = [];
        //hgdbDeveloper://serverName/test1/databaseName/f1/schemaName/f2/tableName/t1
        responseData.data.nodePath = data.nodePath;
        responseData.data.connectionId = data.connectionId;
        const val = JSON.stringify(responseData.data);
        sessionStorage.setItem("table-design-session", val);
        const names = responseData.data.nodePath.split("/");
        //id:oid, title:表名@数据库名.模式名
        emit("addTable", data.object.oid + '', names[9] + "@" + names[7] + "." + names[5] + '(' + names[3] + ')');
      });
    };

    /**
     * 展开属性菜单 懒加载
     */
    const loadNode = (node: Node, resolve: (data: Tree[]) => void) => {
      console.log("loadNode node", node);
      node.data.expanded = true;
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
        return getDatabaseNode(node, resolve);
      } else if (node.data.type == "Database") {
        //显示模式、角色、表空间、管理
        const treeData = node.data as TreeNode<Database>;
        const dbs: any[] = [];
        dbs.push({
          type: "SchemaGroup",
          contextId: "",
          nodePath: "",
          connectionId: treeData.connectionId,
          object: treeData.object,
          text: "模式",
        });
        // dbs.push({
        //   type: "RoleGroup",
        //   contextId: "",
        //   nodePath: "",
        //   connectionId: treeData.connectionId,
        //   object: treeData.object,
        //   text: "角色",
        // });
        // dbs.push({
        //   type: "TableSpaceGroup",
        //   contextId: "",
        //   nodePath: "",
        //   connectionId: treeData.connectionId,
        //   object: treeData.object,
        //   text: "表空间",
        //   index: 2,
        // });

        //a)首先判断是否有connectionId
        if (treeData.connectionId) {
          return resolve(dbs);
        } else {
          treeData.nodePath = getNodePath(node);
          openDatabase(treeData).then(
            (respon: ResponseData<string>) => {
              // console.log("succ respon ", respon);
              dbs.forEach((element) => {
                element.connectionId = respon.data;
              });
              treeData.connectionId = respon.data;
              return resolve(dbs);
            },
            (err) => {
              console.log("err", err);
              handleCloseNode(node);
              return resolve([]);
            }
          );
        }
      } else if (node.data.type == "SchemaGroup") {
        return getSchemaNode(node, resolve);
      } else if (node.data.type == "Schema") {
        //显示表、视图、物化视图
        const treeData = node.data as TreeNode<Schema>;
        const schemas: any[] = [];
        schemas.push({
          type: "TableGroup",
          contextId: "",
          nodePath: "",
          connectionId: treeData.connectionId,
          object: treeData.object,
          text: "表",
        });
        // schemas.push({
        //   type: "ViewsGroup",
        //   contextId: "",
        //   nodePath: "",
        //   connectionId: treeData.connectionId,
        //   object: treeData.object,
        //   text: "视图",
        // });
        return resolve(schemas);
      } else if (node.data.type == "TableGroup") {
        return getTableNode(node, resolve);
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
          // console.log("succ respon ", respon);
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
    const getDatabaseNode = (node: Node, resolve) => {
      const nodeData = node.data as TreeNode<Server>;
      if (!nodeData.object.isSavePassword) {
        //没有记住密码，输入密码
        state.treeNode = node;
        state.enterPwdDialogVisible = true;
        state.treeResolve = resolve;
        return;
      }
      nodeData.nodePath = getNodePath(node);
      serverConnect(nodeData).then(
        (resp: ResponseData<any>) => {
          // console.log("serverConnect succ respon ", resp);
          const connectionId = resp.data;
          nodeData.connectionId = connectionId;
          getDatabaseList(nodeData).then(
            (resp2: ResponseData<any>) => {
              // console.log("getDatabaseList succ respon ", resp2, node, resp);
              resp2.data.forEach((element: TreeNode<Database>) => {
                //赋值connectionId
                if (element.object.name == nodeData.object.databaseName) {
                  element.connectionId = connectionId;
                } else {
                  element.defConnectionId = connectionId;
                }
              });
              nodeData.connectionId = connectionId;
              resolve(resp2.data);
            },
            (err) => handleCloseNode(node)
          );
        },
        (err) => handleCloseNode(node)
      );
    };
    const getSchemaNode = (node: Node, resolve) => {
      const nodeData = node.data as TreeNode<Database>;
      nodeData.nodePath = getNodePath(node);

      getSchemaList(nodeData).then(
        (respon: ResponseData<TreeNode<any>[]>) => {
          // console.log("getSchemaList succ respon ", respon);
          respon.data.forEach((element) => {
            element.connectionId = nodeData.connectionId;
          });
          resolve(respon.data);
        },
        (err) => {
          console.log("err", err);
          handleCloseNode(node);
        }
      );
    };
    const getTableNode = (node: Node, resolve) => {
      const nodeData = node.data as TreeNode<Schema>;
      nodeData.nodePath = getNodePath(node);

      getTableList(nodeData).then(
        (respon: ResponseData<TreeNode<any>[]>) => {
          // console.log("getTableList succ respon ", respon);
          respon.data.forEach((element) => {
            element.connectionId = nodeData.connectionId;
          });
          resolve(respon.data);
        },
        (err) => {
          console.log("err", err);
          handleCloseNode(node);
        }
      );
    };
    const succElMessage = (title = '保存成功') => {
      ElMessage({
        message: title,
        type: "success",
      });
    }
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
      switchServerPwdVisable,
      handleServerPwdSubmit,
      handleOpenConnect,
      handleEnterPwdSubmit,
      handleEnterPwdCancel,

      handleCloseDB,
      switchDBAddVisable,
      switchDBEditVisable,
      handleAddDB,
      handleDBUpdateSubmit,

      switchSchemaAddVisable,
      handleAddSchemaSubmit,
      switchSchemaEditVisable,
      handleSchemaUpdateSubmit,
    };
  },
  methods: {},
});
</script>

<style scoped>
.tree-view {
  min-width: 10%;
  /* max-width: 20%; */
  max-width: auto;
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
.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content .tree-node-button {
  visibility: visible;
}
</style>