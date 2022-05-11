<template>
  <div class="header">
    <div class="logo">瀚高管理工具</div>
    <div class="menu">
      <el-button @click="switchGroupVisable(true)">新建组</el-button>
      <el-button @click="switchServerVisable(true)">新建连接</el-button>
      <!-- <el-button>SQL编辑器</el-button> -->
      <el-button @click="addTable">新建表</el-button>
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
  />
</template>

<script lang="ts">
import { reactive } from "vue";
import GroupDialogAdd from "@/components/server-group/ServerGroupDialogAdd.vue";
import ServerDialogAdd from "@/components/server/ServerDialogAdd.vue";

import { addServerGroup, addServer } from "@/api/treeNode";
import {
  ServerGroupForm,
  Server,
  TreeNode,
  ServerGroup,
  ResponseData,
} from "@/types";

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
  },
  emits: ["addTreeNode", "addTable"],
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
          contextId: "",
          object: groupObject,
          nodePath: "",
          type: "ServerGroup",
          children: [],
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
      const serverObject: TreeNode<Server> = {
        connectionId: "",
        contextId: "",
        object: form,
        nodePath: "",
        type: "Server",
      };
      addServer(serverObject).then((result: ResponseData<TreeNode<Server>>) => {
        switchServerVisable(false);
        emit("addTreeNode", "Server", null, result.data);
      });
    };
    const addTable = () => {
      emit("addTable");
    };
    return {
      state,
      switchGroupVisable,
      saveGroup,
      switchServerVisable,
      saveServer,
      addTable
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
/* .menu {
  height: 100%;
  flex: 1 1;
} */
</style>