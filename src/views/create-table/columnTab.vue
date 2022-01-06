<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table :data="tableData" border highlight-current-row="true">
      <el-table-column prop="index" label="字段名" header-align="center" />
      <el-table-column prop="id" label="类型" header-align="center" />
      <el-table-column prop="length" label="长度" header-align="center" />
      <el-table-column prop="point" label="小数点" header-align="center" />
      <el-table-column prop="notnull" label="不是null" header-align="center" />
      <el-table-column prop="primary" label="主键" header-align="center" />
      <el-table-column prop="comment" label="注释" header-align="center" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "columntab",
  props: {},
  data() {
    return {
      tableData: [

      ],
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