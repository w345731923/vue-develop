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
        <el-menu-item index="5" @click="switchGroupVisable(true)">新建组</el-menu-item>
        <el-menu-item index="6" @click="this.toolsEvent">新建节点</el-menu-item>
        <el-menu-item index="1" @click="this.toolsEvent"
          >SQL编辑器</el-menu-item
        >
        <el-menu-item index="2" @click="this.toolsEvent">新建表</el-menu-item>
        <el-menu-item index="4">Tool</el-menu-item>
      </el-menu>
    </div>
  </div>
  <ServerGroupDialogAdd
    :visible="state.groupVisible"
    @saveModal="saveServerGroup"
    @closeModal="switchGroupVisable"
  />
</template>

<script lang="ts">
import { reactive, onMounted } from "vue";
import ServerGroupDialogAdd from "@/components/tree-node/ServerGroupDialogAdd.vue";
import {
  addServerGroup,
} from "@/api/treeNode";
import { ServerGroupForm } from '@/types'

export default {
  name: "Header",
  components: {
    ServerGroupDialogAdd,
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
    });
    /**
     * 新建Group窗口开关
     */
    const switchGroupVisable = (flag:boolean) => (state.groupVisible = flag);
    /**
     * 保存新建组
     */
    const saveServerGroup = (form:ServerGroupForm) => {
      addServerGroup(form).then(() => {
        switchGroupVisable(false);
        emit('queryRoot')
      });
    };

    return {
      state,
      switchGroupVisable,
      saveServerGroup
    };
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