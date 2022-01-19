<template>
  <el-dialog
    :close-on-click-modal="false"
    v-model="dialogShow"
    title="添加组"
    :rules="rules"
    :destroy-on-close="true"
  >
    <el-form ref="formRef" :model="form">
      <el-form-item label="组名称">
        <el-input v-model="form.label"></el-input>
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
      form: { label: "" },
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("updateServerGroupDialog", val);
      },
    },
  },
  methods: {
    saveServerGroup() {
      console.log("this.form", this.form);
      this.handleSaveServerGroup(this.form);
    },
    // rules() {
    //   label: [
    //     {
    //       required: true,
    //       message: "Please input Activity name",
    //       trigger: "blur",
    //     }
    //   ];
    // },
  },
};
</script>

<style scoped>
</style>
