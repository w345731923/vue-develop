<template>
  <!-- :visible.sync="dialogFormVisible" -->
  <el-dialog
    title="新建连接"
    width="400px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    v-model="state.visible"
    @closed="onClose(ruleFormRef)"
  >
    <!-- label-position="left"
      label-width="70px"
      style="width: 300px; margin-left: 50px" 
            ref="dataForm" -->

    <el-form
      :rules="rules"
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      label-width="80px"
    >
      <el-form-item label="连接名" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="主机" prop="hostAddress">
        <el-input v-model="ruleForm.hostAddress" />
      </el-form-item>
      <el-form-item label="端口" prop="port">
        <el-input
          v-model="ruleForm.port"
          oninput="value=value.replace(/[^\d]/g,'')"
        />
      </el-form-item>
      <el-form-item label="数据库" prop="databaseName">
        <el-input v-model="ruleForm.databaseName" />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="onClose(ruleFormRef)"> 取消 </el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        保存
      </el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, ref } from "vue";
import type { FormInstance } from "element-plus";
import { Server } from "@/types";
const ruleFormRef = ref<FormInstance>();

const ruleForm: Server = reactive({
  "@clazz": "com.highgo.developer.model.HgdbServer",
  oid: "",
  name: "",
  hostAddress: "",
  port: 5866,
  databaseName: "",
  userName: "",
  password: "",
  isSavePassword: false, //记住密码
  isHGSE: false, //是否安全版
  isShowTemplateDb: false, //显示范本数据库
  isShowSystemSchema: false, //显示系统模式
  useSSL: false, //开启ssl
  sslModel: "", //ssl模式
  sslKeyPath: "", //客户端密钥
  sslCrtPath: "", //客户端证书
  rootCrtPath: "", //根证书
});
const rules = reactive({
  name: [{ required: true, message: "请输入连接名！", trigger: "blur" }],
  hostAddress: [
    { required: true, message: "请输入主机地址！", trigger: "blur" },
  ],
  port: [{ required: true, message: "请输入端口号！", trigger: "blur" }],
  databaseName: [
    { required: true, message: "请输入数据库！", trigger: "blur" },
  ],
  userName: [{ required: true, message: "请输入用户名！", trigger: "blur" }],
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
    //关闭
    const onClose = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
      emit("closeModal", false);
    };


    //保存
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
