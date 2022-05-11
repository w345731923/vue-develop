<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table :data="tableData" border highlight-current-row="true" size="small">
      <el-table-column prop="column" label="字段名" align="center" />
      <el-table-column prop="type" label="类型" align="center" />
      <el-table-column prop="length" label="长度" align="center" />
      <el-table-column prop="point" label="小数点" align="center" />
      <el-table-column prop="notnull" label="不是null" align="center" />
      <el-table-column prop="primary" label="主键" align="center" />
      <el-table-column prop="comment" label="注释" align="center" />
      <el-table-column prop="operate" label="操作" align="center">
        <template #default="scope">
          <el-button size="small" @click="columnUpdateButtonClick(scope.row)">修改</el-button>
          <el-button size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
        <el-button type="primary" size="small">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
export default {
  name: "columntab",
  props: {
    tableData: [],
  },
  data() {
    return {
      form: {},
      dialogFormVisible: false,
      formLabelWidth: "80px",
      dataTypeList: [
        {
          value: "char",
          label: "char",
        },
        {
          value: "boolean",
          label: "boolean",
        },
        {
          value: "date",
          label: "date",
        },
      ],
    };
  },
  methods: {
    columnUpdateButtonClick(row) {
      // this.dialogFormVisible = true;
      console.log(row);
      // this.form = row;
    },
  },
};
</script>


<style scoped>
.column-table-edit {
  height: 100%;
  background-color: white;
}
.column-table-edit .success-row {
  background-color: #dedede;
}
.column-table-edit .has-gutter .el-table__cell {
  text-align: center;
}
</style>
