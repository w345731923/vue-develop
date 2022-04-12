<template>
  <div class="header">
    <div class="logo">瀚高管理工具</div>
    <div class="menu">
      <!-- :default-active="activeIndex2" -->

      <el-menu
        mode="horizontal"
        background-color="#338ecc"
        text-color="#fff"
        active-text-color="none"
        @select="handleSelect"
      >
        <!-- @select="handleSelect" -->
        <el-menu-item index="group" @click="switchGroupVisable(true)"
          >新建组</el-menu-item
        >
        <el-menu-item index="server" @click="switchServerVisable(true)"
          >新建连接</el-menu-item
        >
        <el-menu-item index="1">SQL编辑器</el-menu-item>
        <el-menu-item index="2">新建表</el-menu-item>
        <el-menu-item index="4">Tool</el-menu-item>
      </el-menu>
    </div>
  </div>
  <GroupDialogAdd
    :visible="state.groupVisible"
    @saveModal="saveGroup"
    @closeModal="switchGroupVisable"
  />
  <ServerDialogAdd
    :visible="state.serverVisible"
    @saveModal="saveServer"
    @closeModal="switchServerVisable"
    @testModal="handleTestServer"
  />
</template>

<script lang="ts">
import { reactive, onMounted } from "vue";
import GroupDialogAdd from "@/components/server-group/ServerGroupDialogAdd.vue";
import ServerDialogAdd from "@/components/server/ServerDialogAdd.vue";

import { addServerGroup, addServer, testServer } from "@/api/treeNode";
import {
  ServerGroupForm,
  Server,
  ServerObject,
  TreeNode,
  ServerGroup,
  ResponseData,
} from "@/types";
import { ElMessage } from "element-plus";

export default {
  name: "Header",
  components: {
    GroupDialogAdd,
    ServerDialogAdd,
  },
  data() {
    return {};
  },
  props: {
    addTreeNode: {
      type: Function,
      default: null,
    },
    fatherMethod: {
      type: Function,
      default: null,
    },
    toolsEvent: {
      type: Function,
      default: null,
    },
    addGroup: {
      type: Function,
      default: null,
    },
    addServer: {
      type: Function,
      default: null,
    },
  },
  emits: ["addTreeNode"],
  setup(props, { emit }) {
    const state = reactive({
      groupVisible: false,
      serverVisible: false,
    });
    /**
     * 新建Group窗口开关
     */
    const switchGroupVisable = (flag: boolean) => (state.groupVisible = flag);
    /**
     * 保存group
     */
    const saveGroup = (form: ServerGroupForm) => {
      addServerGroup(form).then(() => {
        //后台保存成功，Tree追加节点
        switchGroupVisable(false);
        const groupObject: ServerGroup = {
          "@clazz": "com.highgo.developer.model.HgdbServerGroup",
          name: form.serverGroupName,
          displayName: form.serverGroupName,
        };
        const data: TreeNode<ServerGroup> = {
          connectionId: "",
          databaseOid: 0,
          object: groupObject,
          serverId: "",
          type: "ServerGroup",
        };
        emit("addTreeNode", "ServerGroup", null, data);
      });
    };
    /**
     * 新建Server窗口开关
     */
    const switchServerVisable = (flag: boolean) => (state.serverVisible = flag);
    //save server
    const saveServer = (form: Server) => {
      const ServerObject: ServerObject = {
        connectionId: "",
        databaseOid: 0,
        object: form,
        serverId: "",
        type: "Server",
      };
      const serverForm = {
        parent: null,
        newObject: ServerObject,
      };
      addServer(serverForm).then((result: ResponseData<TreeNode<Server>>) => {
        switchServerVisable(false);
        emit("addTreeNode", "Server", null, result.data);
      });
    };
    //test Server
    const handleTestServer = (form: Server) => {
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
    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath);
      // this.fatherMethod(key);
    };
    return {
      state,
      switchGroupVisable,
      saveGroup,
      switchServerVisable,
      saveServer,
      handleTestServer,
      handleSelect,
    };
  },
  methods: {},
};
</script>

<style>
.header {
  display: flex;
  align-items: center;
  height: 60px;
  line-height: 60px;
  z-index: 1;
}
.logo {
  height: 100%;
  width: 250px;
  cursor: pointer;
  margin-right: 16px;
  flex: 0 1 auto;
}
.menu {
  height: 100%;
  flex: 1 1;
}
</style>