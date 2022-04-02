<template>
  <div class="header">
    <div class="logo">瀚高管理工具</div>
    <div class="menu">
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#338ecc"
        text-color="#fff"
        active-text-color="none"
      >
        <!-- @select="handleSelect" -->
        <el-menu-item @click="switchGroupVisable(true)">新建组</el-menu-item>
        <el-menu-item @click="switchServerVisable(true)">新建连接</el-menu-item>
        <el-menu-item index="1" @click="this.toolsEvent"
          >SQL编辑器</el-menu-item
        >
        <el-menu-item index="2" @click="this.toolsEvent">新建表</el-menu-item>
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
  />
</template>

<script lang="ts">
import { reactive, onMounted } from "vue";
import GroupDialogAdd from "@/components/server-group/ServerGroupDialogAdd.vue";
import ServerDialogAdd from "@/components/server/ServerDialogAdd.vue";

import { addServerGroup, addServer } from "@/api/treeNode";
import { ServerGroupForm, Server, ServerObject } from "@/types";

export default {
  name: "Header",
  components: {
    GroupDialogAdd,
    ServerDialogAdd,
  },
  props: {
    queryRoot: {
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
        switchGroupVisable(false);
        emit("queryRoot");
      });
    };
    /**
     * 新建Server窗口开关
     */
    const switchServerVisable = (flag: boolean) => (state.serverVisible = flag);
    /**
     * 保存server
     */
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
      addServer(serverForm).then(() => {
        console.log("addServer ..............");
        switchServerVisable(false);
        emit("queryRoot");
      });
    };
    return {
      state,
      switchGroupVisable,
      saveGroup,
      switchServerVisable,
      saveServer,
    };
    // export interface ServerObject {
    //   connectionId: string,
    //   databaseOid: number,
    //   object: Server,
    //   serverId: string,
    //   type: string,
    // }
  },
  methods: {
    // handleSelect(key, keyPath) {
    //   console.log(key, keyPath);
    //   this.fatherMethod(key);
    // },
  },
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