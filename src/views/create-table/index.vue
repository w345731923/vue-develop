<template>
  <div class="box">
    <div class="tool-buttons">
      <div class="row-button">
        <el-button size="small" color="#f2f2f2">
          <el-icon><Avatar /></el-icon>
          保存
        </el-button>
        <el-button-group v-if="tabsActive == 'columns'">
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>添加字段</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>删除字段</el-button
          >
        </el-button-group>
        <el-button-group v-if="tabsActive == 'index'">
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>添加索引</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>删除索引</el-button
          >
        </el-button-group>
      </div>
    </div>

    <!-- <img src="../assets/database.png" /> -->
    <div class="query-result">
      <el-tabs v-model="tabsActive" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="字段" name="columns" style="margin: 0.5rem">
          <ColumnTab />
        </el-tab-pane>
        <el-tab-pane label="索引" name="index" style="margin: 0.5rem">
          <IndexTab />
        </el-tab-pane>
        <el-tab-pane label="SQL预览" name="sqlview" style="margin: 0.5rem">
          <p style="margin: 0.3rem">> SQL:select now()</p>
          <p style="margin: 0.3rem">> SUCCESS:OK</p>
          <p style="margin: 0.3rem">> TIME:148ms</p>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { Avatar } from "@element-plus/icons-vue";
import ColumnTab from "./columnTab.vue";
import IndexTab from "./indexTab.vue";

export default {
  name: "sqleditor",
  components: {
    Avatar,
    ColumnTab,
    IndexTab,
  },
  props: {},
  data() {
    return {
      tabsActive: "columns",
      tabsName: ["columns", "index", "sqlview"],
    };
  },
  methods: {
    handleTabClick(tab) {
      this.tabsActive = tab.props.name;
    },
  },
};
</script>


<style scoped>
.box {
  margin: 0;
  padding: 0;
  width: 100%;
}
.tool-buttons {
  padding: 4px 4px 8px 4px;
  background-color: #f2f2f2;
}
</style>