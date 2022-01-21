<template>
  <div class="tree-view">
    <el-tree
      :data="state.treeData"
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
            <img src="../../assets/hgdb16.png" v-if="data.type === 'server'" />
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
            {{ data.object.name }}
          </div>
          <div class="tree-node-action">
            <img
              src="../../assets/schema.png"
              @click="updateServerGroupDialog(true)"
            />
            <img src="../../assets/refresh.png" />
          </div>
        </div>
      </template>
    </el-tree>
    <!-- default-expand-all :render-content="renderContent"-->
    <ServerGroupDialog
      :dialogVisible="state.dialogVisible"
      @updateServerGroupDialog="updateServerGroupDialog"
      :handleSaveServerGroup="handleSaveServerGroup"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  // computed, ref, watch, unref, watchEffect
} from "vue";
import { reactive, onMounted } from "vue";
import {
  getRoot,
  serverGroupAdd
} from "@/api/treeNode";
import ServerGroupDialog from "@/components/tree-node/ServerGroupDialog.vue";
import {
  ResponseData,
  ServerGroup,
  //  ServerGroupForm
} from "@/types";
import // axios,
//  AxiosResponse,
// AxiosRequestConfig
"axios";

interface TreeNodeState {
  treeData: ServerGroup[];
  dialogVisible: boolean;
}

export default defineComponent({
  name: "treeNode",
  components: {
    ServerGroupDialog,
  },
  setup() {
    const state = reactive<TreeNodeState>({
      treeData: [],
      dialogVisible: false,
    });
    const queryRoot = () => {
      getRoot().then((respon: ResponseData<ServerGroup[]>) => {
        console.log("respon", respon.data);
        state.treeData = respon.data;
      });
    };
    onMounted(() => {
      console.log("组件挂载完成", state.treeData);
      queryRoot();

      // setTimeout(() => {
      //   // state.treeData = ["苏格拉底", "柏拉图", "亚里士多德"];
      //   state.treeData = dataSource;
      // }, 1000);
    });
    /**
     * 节点点击event
     */
    const handleNodeClick = (event: any) => {
      var el = event.currentTarget;
      console.log("当前对象的内容：", el, state.treeData);
      console.log("state", state);
    };

    const updateServerGroupDialog = (status: boolean) => {
      console.log("enter updateServerGroupDialog....00000", status);
      state.dialogVisible = status;
    };
    // const openServerGroupDialog = () => {
    //   console.log('enter openServerGroupDialog....1111')
    //   state.dialogVisible = true;
    //   console.log("state", state);
    // };
    // const closeServerGroupDialog = () => {
    //   console.log('enter closeServerGroupDialog....22222')
    //   state.dialogVisible = false;
    // };
    /**
     * 保存group
     */
    const handleSaveServerGroup = (serverGroupObj: any) => {
      console.log("handleSaveServerGroup,", serverGroupObj);
      serverGroupAdd(serverGroupObj).then(() => {
        // closeServerGroupDialog();
        updateServerGroupDialog(false);
        queryRoot();
      });
    };
    return {
      state,
      handleNodeClick,
      updateServerGroupDialog,
      // openServerGroupDialog,
      // closeServerGroupDialog,
      handleSaveServerGroup,
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
      console.log("node", node, resolve);
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

.el-tree-node__content:hover .tree-node-action,
.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content
  .tree-node-action {
  visibility: visible;
}
</style>