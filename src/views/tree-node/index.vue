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
              v-if="node.data.type === 'group'"
            />
            <img
              src="../../assets/hgdb16.png"
              v-if="node.data.type === 'server'"
            />
            <img
              src="../../assets/database.png"
              v-if="node.data.type === 'db-name'"
            />
            <img
              src="../../assets/folder_schema.png"
              v-if="node.data.type === 'schema-group'"
            />
            <img
              src="../../assets/schema.png"
              v-if="node.data.type === 'schema'"
            />
            <img
              src="../../assets/folder_table.png"
              v-if="node.data.type === 'table-group'"
            />
            <img
              src="../../assets/table.png"
              v-if="node.data.type === 'table'"
            />
            <img
              src="../../assets/folder_user.png"
              v-if="node.data.type === 'role-group'"
            />
            <img src="../../assets/user.png" v-if="node.data.type === 'user'" />
          </div>
          <div class="tree-node-name tree-node-name-gt">{{ node.label }}</div>
          <div class="tree-node-action">
            <img src="../../assets/schema.png" @click="openServerGroupDialog" />
            <img src="../../assets/refresh.png" @click="append(data)" />
          </div>
        </div>
      </template>
    </el-tree>
    <!-- default-expand-all :render-content="renderContent"-->
    <ServerGroupDialog
      :dialogVisible="state.dialogVisible"
      :handleSaveServerGroup="handleSaveServerGroup"
    />
  </div>
</template>

<script>
import { reactive, onMounted } from "vue";
import { getRoot } from "@/api/treeNode";
import ServerGroupDialog from "@/components/tree-node/ServerGroupDialog.vue";

const dataSource = [
  {
    label: "组1",
    type: "group",
    children: [
      // {
      //   label: "localhost",
      //   type: "server",
      //   children: [
      //     {
      //       label: "postgres",
      //       type: "db-name",
      //       children: [
      //         {
      //           label: "模式",
      //           type: "schema-group",
      //           children: [
      //             {
      //               label: "public",
      //               type: "schema",
      //               children: [
      //                 {
      //                   label: "表",
      //                   type: "table-group",
      //                   children: [
      //                     {
      //                       label: "t_class",
      //                       type: "table",
      //                     },
      //                     {
      //                       label: "t_user",
      //                       type: "table",
      //                     },
      //                     {
      //                       label: "t_course",
      //                       type: "table",
      //                     },
      //                   ],
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //         {
      //           label: "角色",
      //           type: "role-group",
      //           children: [
      //             {
      //               label: "postgres",
      //               type: "user",
      //             },
      //             {
      //               label: "pg_execute_server_program",
      //               type: "user",
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
  },
];
let id = 1000;
export default {
  name: "tree-node",
  components: {
    ServerGroupDialog,
  },
  setup() {
    const state = reactive({
      treeData: [],
      dialogVisible: false,
    });
    const queryRoot = () => {
      getRoot().then((res) => {
        state.treeData = res.data;
      });
    };
    onMounted(() => {
      console.log("组件挂载完成", dataSource);
      queryRoot();

      // setTimeout(() => {
      //   // state.treeData = ["苏格拉底", "柏拉图", "亚里士多德"];
      //   state.treeData = dataSource;
      // }, 1000);
    });
    /**
     * 节点点击event
     */
    const handleNodeClick = (event) => {
      var el = event.currentTarget;
      console.log("当前对象的内容：", el, state.treeData);
    };
    /**
     * 打开group窗口
     */
    const openServerGroupDialog = () => {
      //   const un = id++;
      //   const newChild = {
      //     id: un,
      //     label: "testtest" + un,
      //     type: "group",
      //     children: [],
      //   };
      //   state.treeData.push(newChild);
      state.dialogVisible = true;
    };

    /**
     * 保存group
     */
    const handleSaveServerGroup = (serverGroupObj) => {
      console.log("handleSaveServerGroup,", serverGroupObj);
      queryRoot();
    };
    return {
      state,
      handleNodeClick,
      openServerGroupDialog,
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
    append(data) {
      console.log(data, id);
      // const newChild = { id: id++, label: "testtest", children: [] };
      // if (!data.children) {
      //   data.children = [];
      // }
      // data.children.push(newChild);
      // this.dataSource = [...this.dataSource];
    },
    loadNode(node, resolve) {
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
};
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