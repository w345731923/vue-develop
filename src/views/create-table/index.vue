<template>
  <div class="box">
    <div class="tool-buttons">
      <div class="row-button">
        <el-button size="small" color="#f2f2f2">
          <el-icon><Avatar /></el-icon>
          保存
        </el-button>
        <el-button-group v-if="tabsActive == 'columns'">
          <el-button
              size="small"
              color="#f2f2f2"
              @click="addColumnButtonClick"
            >
            <el-icon><Avatar /></el-icon>
            添加字段
          </el-button>
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
          <ColumnTab :tableData="tableData" />
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

    <el-dialog :close-on-click-modal=false v-model="dialogFormVisible" title="添加字段" :destroy-on-close=true>
      <el-form v-model="form" size="mini">
        <el-form-item label="字段" :label-width="formLabelWidth">
          <el-input v-model="form.column" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" filterable placeholder="Select">
            <el-option
                v-for="item in dataTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="长度" :label-width="formLabelWidth">
          <el-input-number v-model="form.length" :min="0" />
        </el-form-item>
        <el-form-item label="小数点" :label-width="formLabelWidth">
          <el-input-number v-model="form.point" :min="0" />
        </el-form-item>
        <el-form-item label="不是null" :label-width="formLabelWidth">
          <el-switch v-model="form.notnull" />
        </el-form-item>
        <el-form-item label="主键" :label-width="formLabelWidth">
          <el-switch v-model="form.primary" />
        </el-form-item>
        <el-form-item label="注释" :label-width="formLabelWidth">
          <el-input v-model="form.comment" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="addColumnForm">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { Avatar } from "@element-plus/icons-vue";
import ColumnTab from "./columnTab.vue";
import IndexTab from "./indexTab.vue";

const dataTypeList = [
  {
    value: 'varchar',
    label: 'varchar',
  },
  {
    value: 'integer',
    label: 'integer',
  },
  {
    value: 'date',
    label: 'date',
  },
];

export default {
  name: "sqleditor",
  components: {
    Avatar,
    ColumnTab,
    IndexTab,
  },
  data() {
    return {
      tabsActive: "columns",
      tabsName: ["columns", "index", "sqlview"],
      dialogFormVisible: false,
      formLabelWidth: "80px",
      form: { length: 0, point: 0, notnull: false, primary: false,},
      dataTypeList,
      tableData: [],
    };
  },
  methods: {
    handleTabClick(tab) {
      this.tabsActive = tab.props.name;
    },
    addColumnButtonClick() {
      this.dialogFormVisible = true;
    },
    addColumnForm() {
      this.dialogFormVisible = false;
      this.tableData.push(this.form);
      this.form = { length: 0, point: 0, notnull: false, primary: false,};
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
