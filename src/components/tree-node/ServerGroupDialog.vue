<template>
  <el-dialog
    :close-on-click-modal="false"
    v-model="dialogShow"
    title="添加组"
    :destroy-on-close="true"
  >
    <el-form ref="formRef" :model="form" label-width="120px">
      <el-form-item label="组名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <!-- <el-button size="small" @click="dialogVisible = false"
        >取消</el-button
      > -->
      <el-button type="primary" size="small" @click="saveServerGroup"
        >保存</el-button
      >
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: "servergroupdialog",
  components: {
    // Avatar,
    // ColumnTab,
    // IndexTab,
  },
  props: {
    handleSaveServerGroup: Function(),
    dialogVisible: Boolean,
  },
  data() {
    return {
      // dialogVisible: this.dialogVisible,
      form: { name: "" },
      tableData: [],
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogShow", val);
      },
    },
  },
  methods: {
    saveServerGroup() {
      // this.dialogVisible = false;
      // this.tableData.push(this.form);
      console.log("this.form", this.form);
      this.handleSaveServerGroup(this.form);
    },
  },
};
</script>

<style scoped>
</style>
