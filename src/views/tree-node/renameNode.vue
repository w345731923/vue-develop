<template>
  <el-dialog
    title="重命名对象"
    width="400px"
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
      label-position="top"
    >
      <el-form-item label="请输入新名称" prop="name">
        <el-input v-model="ruleForm.name" />
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
  name: [{ required: true, message: "请输入新名称", trigger: "blur" }],
});

export default defineComponent({
  name: "ServerGroupDialogAdd",
  props: {
    saveModal: Function,
    closeModal: Function,
    visible: {
      type: Boolean,
      default: false,
    },
    data: Object,
  },

  emits: ["saveModal", "closeModal"],
  setup(props, { emit }) {
    const { visible, data } = toRefs(props);
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
      name: data.value!.object.name,
    });
    /**
     * 取消按钮事件
     */
    const onClose = () => {
      ruleForm.name = "";
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
