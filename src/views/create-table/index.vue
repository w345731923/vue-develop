<template>
  <div class="box">
    <div class="tool-buttons">
      <div class="row-button">
        <el-button-group>
          <el-button size="small" color="#f2f2f2">
            <el-icon><Avatar /></el-icon>
            保存
          </el-button>
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>添加字段</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>删除字段</el-button
          >
        </el-button-group>
      </div>
    </div>

    <!-- <img src="../assets/database.png" /> -->
    <div class="query-result">
      <el-tabs model-value="columns" type="card">
        <el-tab-pane label="字段" name="columns" style="margin: 0.5rem">
          <TableEditor />
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
import TableEditor from "./TableEditor.vue";

export default {
  name: "sqleditor",
  components: {
    Avatar,
    TableEditor,
  },
  props: {},
  data() {
    return {};
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