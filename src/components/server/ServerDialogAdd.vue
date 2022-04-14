<template>
  <!-- :visible.sync="dialogFormVisible" -->
  <el-dialog
    title="新建连接"
    width="600px"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    v-model="state.visible"
    @closed="onClose(ruleFormRef)"
    custom-class="server-dialog"
  >
    <el-form
      :rules="rules"
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      label-width="120px"
    >
      <!-- v-model="activeName" -->
      <el-tabs model-value="first" type="card">
        <el-tab-pane label="常规" name="first">
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
          <el-form-item label="记住密码">
            <el-switch v-model="ruleForm.isSavePassword" />
          </el-form-item>
          <el-form-item label="安全版数据库">
            <el-switch v-model="ruleForm.isHGSE" />
            <span style="margin-left: 0.75rem; color: red"
              >请确认数据库是否为安全版</span
            >
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="高级" name="second">
          <el-form-item label="显示范本数据库">
            <el-switch v-model="ruleForm.isShowTemplateDb" />
          </el-form-item>
          <el-form-item label="显示系统模式">
            <el-switch v-model="ruleForm.isShowSystemSchema" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="SSL" name="third">
          <el-form-item label="使用SSL">
            <el-switch v-model="ruleForm.useSSL" />
          </el-form-item>
          <el-form-item label="SSL模式">
            <el-select v-model="ruleForm.sslModel" :disabled="!ruleForm.useSSL">
              <el-option label="require" value="require" />
              <el-option label="verify-ca" value="verify-ca" />
              <el-option label="verify-full" value="verify-full" />
            </el-select>
          </el-form-item>
          <el-form-item label="客户端密钥" prop="sslKeyPath">
            <el-input
              v-model="ruleForm.sslKeyPath"
              :disabled="!ruleForm.useSSL"
            />
          </el-form-item>
          <el-form-item label="客户端证书" prop="sslCrtPath">
            <el-input
              v-model="ruleForm.sslCrtPath"
              :disabled="!ruleForm.useSSL"
            />
          </el-form-item>
          <el-form-item label="根证书" prop="rootCrtPath">
            <el-input
              v-model="ruleForm.rootCrtPath"
              :disabled="!ruleForm.useSSL"
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <template #footer>
      <div style="display: flex; justify-content: space-between">
        <el-button @click="onTest(ruleFormRef)">测试连接</el-button>
        <span>
          <el-button @click="onClose(ruleFormRef)"> 取消 </el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            保存
          </el-button>
        </span>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, ref } from "vue";
import type { FormInstance } from "element-plus";
import { Server } from "@/types";
import { ElMessage } from "element-plus";

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
  sslModel: "require", //ssl模式
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
    testModal: Function,
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  emits: ["saveModal", "closeModal", "testModal"],
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
    //测试连接
    const onTest = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          emit("testModal", ruleForm);
        } else {
          ElMessage({
            message: "请输入'修改连接'必填项！",
            type: "warning",
            duration: 5 * 1000,
          });
          return false;
        }
      });
    };
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
          ElMessage({
            message: "请输入'新建连接'必填项！",
            type: "warning",
            duration: 5 * 1000,
          });
          return false;
        }
      });
    };
    return {
      state,
      onClose,
      onTest,
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
.el-tab-pane {
  padding: 10px;
}
.el-dialog__footer {
  display: flex;
  justify-content: space-between;
}
</style>
