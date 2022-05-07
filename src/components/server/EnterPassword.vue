<template>
  <el-dialog
    title="输入密码"
    width="450px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    v-model="state.visible"
    @closed="onClose"
  >
    <el-form :rules="rules" ref="ruleFormRef" :model="ruleForm" status-icon>
      <el-form-item label="请输入密码" prop="password">
        <el-input v-model="ruleForm.password" />
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
import { defineComponent, reactive, toRefs, watch, ref, Ref } from "vue";
import type { FormInstance } from "element-plus";

const ruleFormRef = ref<FormInstance>();

const rules = reactive({
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});

export default defineComponent({
  name: "EnterPasswordDialog",
  props: {
    saveModal: Function,
    closeModal: Function,
    visible: {
      type: Boolean,
      default: false,
    },
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
    const ruleForm = reactive({
      password: "",
    });
    /**
     * 取消按钮事件
     */
    const onClose = () => {
      ruleForm.password = "";
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
          emit("saveModal", ruleForm);
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
