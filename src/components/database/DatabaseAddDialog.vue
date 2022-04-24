<template>
  <!-- :visible.sync="dialogFormVisible" -->
  <el-dialog
    title="新建数据库"
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
      :model="form"
      status-icon
      label-width="120px"
    >
      <!-- v-model="activeName" -->
      <el-tabs model-value="first" type="card">
        <el-tab-pane label="常规" name="first">
          <el-form-item label="数据库名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="拥有者" prop="hostAddress">
            <el-select v-model="form.databaseowner">
              <!-- <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" /> -->
              <el-option
                v-for="role in state.roleList"
                :key="role"
                :label="role"
                :value="role"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="范本" prop="templateName">
            <el-select v-model="form.templateName" placeholder=" ">
              <el-option
                v-for="temp in state.tempDBList"
                :key="temp"
                :label="temp"
                :value="temp"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="编码" prop="encoding">
            <el-select v-model="form.encoding">
              <el-option label="Zone one" value="EUC_CN" />
              <el-option label="UTF8" value="UTF8" />
            </el-select>
          </el-form-item>
          <el-form-item label="排序规则排序" prop="collation">
            <el-input v-model="form.collation" />
          </el-form-item>
          <el-form-item label="字符分类" prop="characterType">
            <el-input v-model="form.characterType" />
          </el-form-item>
          <el-form-item label="表空间" prop="spcname">
            <el-select v-model="form.spcname">
              <el-option
                v-for="space in state.tableSpaceList"
                :key="space"
                :label="space"
                :value="space"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="连接限制">
            <el-input
              v-model="form.connectionLimit"
              oninput="value=value.replace(/[^\d]/g,'')"
            />
          </el-form-item>
          <el-form-item label="允许连接">
            <el-switch v-model="form.datallowconn" />
          </el-form-item>
          <el-form-item label="是范本">
            <el-switch v-model="form.datistemplate" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="注释" name="second">
          <el-form-item label-width="0">
            <el-input v-model="form.description" type="textarea" :rows="20" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="SQL预览" name="third"> </el-tab-pane>
      </el-tabs>
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
import { ResponseData } from "@/types";
import { ElMessage } from "element-plus";
import {
  getDatabaseRole,
  getDatabaseTableSpace,
  getDatabaseTempDB,
} from "@/api/treeNode";

const ruleFormRef = ref<FormInstance>();
// const form: Database = reactive({
//   "@clazz": "com.highgo.developer.model.HgdbDatabase",
//   name: "", //数据库名
//   encoding: "", //编码 "UTF8"
//   collation: "", //排序规则排序  "zh_CN.UTF-8"
//   characterType: "", //字符分类  "zh_CN.UTF-8"
//   connectionLimit: -1, //连接限制 -1
//   description: "", //注释
//   databaseowner: "", //拥有者
//   spcname: "", //表空间  "pg_default"
//   templateName: "", //范本
//   datistemplate: false, //是范本
//   datallowconn: false, //允许连接
// });
const rules = reactive({
  name: [{ required: true, message: "请输入数据库名！", trigger: "blur" }],
});
interface stateProps {
  visible: boolean;
  roleList: string[];
  tempDBList: string[];
  tableSpaceList: string[];
}
export default defineComponent({
  name: "DatabaseEditDialog",
  props: {
    saveModal: Function,
    closeModal: Function,
    visible: {
      type: Boolean,
      default: false,
    },
    dbForm: Object,
  },
  data() {
    return {};
  },
  emits: ["saveModal", "closeModal"],
  setup(props, { emit }) {
    const { visible, dbForm } = toRefs(props);
    const state: stateProps = reactive({
      visible: visible.value,
      roleList: [], //角色
      tempDBList: [], //范本
      tableSpaceList: [], //表空间
    });

    watch(
      visible,
      (newValue) => {
        state.visible = newValue;
      },
      { immediate: true }
    );
    const form = dbForm.value;

    getDatabaseRole(form?.connectionId).then((resp: ResponseData<string[]>) => {
      state.roleList = resp.data;
    });
    getDatabaseTempDB(form?.connectionId).then(
      (resp: ResponseData<string[]>) => {
        state.tempDBList = resp.data;
      }
    );
    getDatabaseTableSpace(form?.connectionId).then(
      (resp: ResponseData<string[]>) => {
        state.tableSpaceList = resp.data;
      }
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
          emit("saveModal", form);
        } else {
          ElMessage({
            message: "请输入'新建数据库'必填项！",
            type: "warning",
            duration: 5 * 1000,
          });
          return false;
        }
      });
    };
    return {
      state,
      form,
      onClose,
      submitForm,
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
</style>
