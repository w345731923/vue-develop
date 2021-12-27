<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button size="small" @click="addTab(editableTabsValue)">
        add tab
      </el-button>
    </div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" closable>
      <el-tab-pane label="SQL编辑器">
        <div class="box">
          <CodeMirror v-model="sql" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="查询表数据">
        <div class="table-edit">
          <el-table :data="tableData" border>
            <el-table-column prop="index" label="#" width="80" />
            <el-table-column prop="id" label="id" width="100" />
            <el-table-column prop="name" label="name" width="100" />
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        {{ item.content }}
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import CodeMirror from "../../components/codemirror/CodeMirror.vue";

export default {
  name: "vContent",
  props: {
    // likes: String,
    // years: String,
    // isTable: Boolean,
    // isSqlEdit: Boolean,
  },
  data() {
    return {
      activeName: "first",
      editableTabs: [],
      tableData: [
        {
          index: "1",
          id: "1",
          name: "Angeles",
        },
        {
          index: "2",
          id: "2",
          name: "Angeles",
        }
      ],
    };
  },
  components: {
    CodeMirror,
  },
  methods: {
    addTab(targetName) {
      console.log('targetName',targetName)
      const newTabName = `${++this.tabIndex}`;
      this.editableTabs.push({
        title: "New Tab",
        name: newTabName,
        content: "New Tab content",
      });
      this.editableTabsValue = newTabName;
    },
    removeTab(targetName) {
      const tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
  },
};
</script>


<style scoped>
.table-edit {
  height: 100%;
  background-color: white;
}
.el-table .success-row {
  background-color: #dedede;
}
.box {
  margin: 0;
  padding: 0;
  width: 100%;
  /* width: 1500px; */
  /* height: 500px; */
}
.el-tabs {
  width: 100%;
}
</style>