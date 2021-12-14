<template>
  <!-- <i class="el-icon-edit"></i>
    <el-button type="success" icon="el-icon-edit">编辑{{ likes }}</el-button>
    <el-button type="success" icon="el-icon-edit" class="submit-btn"
      >登录{{ years }}</el-button
    > -->
  <div v-if="isTable" class="table-edit">
    <el-table :data="tableData" border>
      <el-table-column prop="index" label="#" width="80" />
      <el-table-column prop="id" label="id" width="100" />
      <el-table-column prop="name" label="name" width="100" />
    </el-table>
  </div>
  <div v-if="isSqlEdit">
    <CodeMirror />
  </div>
</template>

<script>
import CodeMirror from "../../components/CodeMirror.vue";

export default {
  name: "vContent",
  props: {
    likes: String,
    years: String,
    isTable: Boolean,
    isSqlEdit: Boolean,
  },
  methods: {
    // tableRowClassName({ row, rowIndex }) {
    //   console.log(rowIndex, row);
    //   if (rowIndex === 1) {
    //     return "success-row";
    //   }
    //   return "";
    // },
  },
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
        {
          index: "3",
          id: "3",
          name: "Angeles",
        },
        {
          index: "4",
          id: "4",
          name: "Angeles",
        },
      ],
    };
  },
  components: {
    CodeMirror
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