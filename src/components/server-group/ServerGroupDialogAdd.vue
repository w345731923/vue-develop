<template>
  <!-- :visible.sync="dialogFormVisible" -->
  <el-dialog
    title="新建组"
    width="400px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    v-model="state.visible"
    @closed="onClose"
  >
    <!-- label-position="left"
      label-width="70px"
      style="width: 300px; margin-left: 50px" 
            ref="dataForm" -->

    <el-form :rules="rules" ref="ruleFormRef" :model="ruleForm" status-icon>
      <el-form-item label="组名称" prop="serverGroupName">
        <el-input v-model="ruleForm.serverGroupName" />
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
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive({
  serverGroupName: "",
});
const rules = reactive({
  serverGroupName: [
    { required: true, message: "请填写组名称", trigger: "blur" },
  ],
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
  },
  data() {
    return {};
  },
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
      ruleForm.serverGroupName = "";
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
