<template>
  <!-- :visible.sync="dialogFormVisible" -->
  <el-dialog
    title="修改密码"
    width="450px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    v-model="state.visible"
    @closed="onClose"
  >
    <el-form
      :rules="rules"
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      label-width="100px"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input v-model="ruleForm.oldPassword" type="password" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="ruleForm.newPassword" type="password" />
      </el-form-item>
      <el-form-item label="确认密码" prop="newPassword1">
        <el-input v-model="ruleForm.newPassword1" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose"> 取消 </el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, ref } from "vue";
import type { FormInstance } from "element-plus";
import { ElMessage } from "element-plus";

const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  oldPassword: "",
  newPassword: "",
  newPassword1: "",
  serverGroupName: "",
  serverID: "",
});
const rules = reactive({
  oldPassword: [{ required: true, message: "请填写原密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请填写新密码", trigger: "blur" }],
  newPassword1: [
    { required: true, message: "请填写确认密码", trigger: "blur" },
  ],
});

export default defineComponent({
  name: "ServerPwdDialog",
  props: {
    saveModal: Function,
    closeModal: Function,
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  emits: ["saveModal", "closeModal"],
  setup(props, { emit }) {
    const { visible } = toRefs(props);
    const state = reactive({
      visible: visible.value,
    });
    watch(
      visible,
      (newValue) => {
        state.visible = newValue;
      },
      { immediate: true }
    );
    /**
     * 取消按钮事件
     */
    const onClose = () => {
      ruleForm.oldPassword = "";
      ruleForm.newPassword = "";
      ruleForm.newPassword1 = "";
      emit("closeModal", false);
    };
    /**
     * 保存按钮事件
     */
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      console.log("submitForm", formEl);

      formEl.validate((valid) => {
        if (valid) {
          if (ruleForm.newPassword != ruleForm.newPassword1) {
            ElMessage({
              message: "两次输入的密码不一致，请重新输入",
              type: "info",
            });
          } else {
            emit("saveModal", ruleForm);
          }
        } else {
          return false;
        }
      });
    };

    return {
      state,
      onClose,
      submitForm,
      ruleForm,
      rules,
      ruleFormRef,
    };
  },
  methods: {},
});
</script>

<style scoped>
</style>
