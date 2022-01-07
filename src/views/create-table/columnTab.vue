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
  </div>
</template>

<script>
export default {
  name: "columntab",
  props: {
    tableData: [],
    columnUpdateButtonClick: null,
  },
  data() {
    return {
      // tableData: [
      //
      // ],
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
