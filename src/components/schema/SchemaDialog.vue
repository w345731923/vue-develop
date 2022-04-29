<template>
  <!-- :visible.sync="dialogFormVisible" -->
  <el-dialog
    :title="`${state.isAdd ? '新建模式' : '编辑模式'}`"
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
      <el-tabs model-value="first" type="card" @tab-click="handleClick">
        <el-tab-pane label="常规" name="first">
          <el-form-item label="模式名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="拥有者" prop="rolname">
            <el-select v-model="form.rolname">
              <el-option
                v-for="role in state.roleList"
                :key="role"
                :label="role"
                :value="role"
              />
            </el-select>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="注释" name="describe">
          <el-form-item label-width="0">
            <el-input v-model="form.describe" type="textarea" :rows="20" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="SQL预览" name="sqlview">
          <el-form-item label-width="0">
            <el-input v-model="state.sqlpreview" type="textarea" :rows="20" />
          </el-form-item>
        </el-tab-pane>
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
import type { FormInstance, TabsPaneContext } from "element-plus";
import {
  ResponseData,
  SQLCreatePreview,
  SQLAlterPreview,
  TreeNode,
  Database,
} from "@/types";
import { ElMessage } from "element-plus";
import { getDatabaseRole, showCreateSQL, showAlterSQL } from "@/api/treeNode";

const ruleFormRef = ref<FormInstance>();
// '@clazz': string;
// name: string,//数据库名
// describe: string;//注释
// rolname?: string;//角色
// });
const rules = reactive({
  name: [{ required: true, message: "请输入数据库名！", trigger: "blur" }],
});
interface stateProps {
  visible: boolean;
  roleList: string[];
  sqlpreview: string;
  isAdd: boolean;
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
    defaultForm: Object,
    parentForm: Object,
    treeNodeString: String,
  },
  data() {
    return {};
  },
  emits: ["saveModal", "closeModal"],
  setup(props, { emit }) {
    const { visible, defaultForm, parentForm, treeNodeString } = toRefs(props);
    const state: stateProps = reactive({
      visible: visible.value,
      roleList: [], //角色
      sqlpreview: "", //SQL预览
      isAdd: true, //true新增  false修改
    });

    watch(
      visible,
      (newValue) => {
        state.visible = newValue;
      },
      { immediate: true }
    );
    const form = defaultForm.value as Database;
    if (form.name != "") {
      state.isAdd = false;
    }
    getDatabaseRole(form.connectionId!).then((resp: ResponseData<string[]>) => {
      state.roleList = resp.data;
    });

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
    //sql预览
    const handleClick = (pane: TabsPaneContext, ev: Event) => {
      if (pane.props.name == "sqlview") {
        const newObject: TreeNode<Database> = {
          connectionId: "",
          contextId: "",
          object: form as Database,
          nodePath: "",
          type: "Schema",
        };
        if (state.isAdd) {
          const data: SQLCreatePreview = {
            newObject: newObject,
            parent: parentForm.value as TreeNode<any>,
          };
          showCreateSQL(data).then((resp: ResponseData<string>) => {
            state.sqlpreview = resp.data;
          });
        } else {
          const current = treeNodeString.value as string;
          const data: SQLAlterPreview = {
            newObject: newObject,
            oldObject: JSON.parse(current) as TreeNode<Database>,
          };
          showAlterSQL(data).then((resp: ResponseData<string>) => {
            state.sqlpreview = resp.data;
          });
        }
      }
    };
    return {
      state,
      form,
      onClose,
      submitForm,
      rules,
      ruleFormRef,
      handleClick,
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
