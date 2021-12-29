<template>
  <div class="table-edit">
    <el-table :data="tableData" border>
      <el-table-column prop="index" label="#" width="80" />
      <el-table-column prop="id" label="id" width="100" />
      <el-table-column prop="name" label="name" width="100" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: "tableeditor",
  props: {},
  data() {
    return {
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
        },
      ],
    };
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
</style>