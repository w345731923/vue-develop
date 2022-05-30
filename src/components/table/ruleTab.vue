<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table :data="state.tableData" border :highlight-current-row="true" size="small" style="width: 100%"
      :max-height="state.tableHieght">
      <el-table-column prop="name" label="规则名" align="center" />
      <el-table-column prop="ruleEvent" label="事件" align="center" />
      <el-table-column prop="isInstead" label="代替运行" align="center">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.isInstead == true" :checked="true" />
          <el-checkbox disabled v-if="scope.row.isInstead != true" />
        </template>
      </el-table-column>
      <el-table-column prop="isEnabled" label="启用" align="center">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.isEnabled == true" :checked="true" />
          <el-checkbox disabled v-if="scope.row.isEnabled != true" />
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="注释" align="center" />
      <el-table-column prop="operate" label="操作" align="center">
        <template #default="scope">
          <el-button size="small" @click="columnUpdateClick(scope.row)">修改</el-button>
          <el-button size="small" @click="removeColumnClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" v-model="state.visible" title="添加规则" :destroy-on-close="false"
      @closed="onClose(formRef)">
      <el-form :model="state.form" :rules="rules" ref="formRef" status-icon label-width="90px">
        <el-form-item label="规则名" prop="name">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="事件" prop="ruleEvent">
          <el-select v-model="state.form.ruleEvent" placeholder=" ">
            <el-option v-for="item in eventSel" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="没有继承">
          <el-switch v-model="state.form.isInstead" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="state.form.isEnabled" />
        </el-form-item>
        <el-form-item label="注释">
          <el-input v-model="state.form.comment"></el-input>
        </el-form-item>
        <el-form-item label="条件">
          <el-input v-model="state.form.whereCondition"></el-input>
        </el-form-item>
        <el-form-item label="定义">
          <el-input v-model="state.form.command"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onClose(formRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch, ref, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import {
  RuleList,
} from "@/types";
const eventSel = ['SELECT', 'update', 'INSERT', 'DELETE']

const formRef = ref<FormInstance>();
const demo: RuleList = {
  "@clazz": "com.highgo.developer.model.HgdbRule",
  oid: -new Date().getTime(),
  name: "",
  ruleEvent: "",
  isInstead: false,
  isEnabled: false,
  comment: "",
  whereCondition: "",
  command: "",
};

interface IState {
  visible: boolean;
  tableData: RuleList[];
  tableHieght: number;
  form: RuleList;
  isAdd: boolean; //add or update
}
export default defineComponent({
  name: "ruletab",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    tableData: Array,
    saveModal: Function,
    removeRow: Function,
    visableFlag: Function,
  },
  emits: ["visableFlag", "saveModal", "removeRow"],
  setup(props, { emit }) {
    onMounted(() => {
    });
    const rules = reactive({
      name: [{ required: true, message: "请输入规则名！", trigger: "blur" }],
      shijian: [{ required: true, message: "请选择事件！", trigger: "blur" }],
    });
    const { visible, tableData } = toRefs(props);
    const state: IState = reactive({
      visible: visible.value,
      tableData: tableData.value as RuleList[],
      tableHieght: window.innerHeight - 190, //60header,40tabs,40buttons,40tabheader
      form: {} as RuleList,
      isAdd: true,
    });
    watch(
      visible,
      (newValue) => {
        state.visible = newValue;
        if (newValue && state.isAdd) {
          demo.oid = -new Date().getTime();
          //如果是新建，清空上一次页面缓存值
          resetFields(demo);
        }
      },
      { immediate: true }
    );
    watch(
      tableData,
      (newValue) => {
        state.tableData = newValue as RuleList[];
      },
      { immediate: true }
    );

    //对象拷贝
    const createVal = (src: RuleList) => {
      const target = {} as RuleList;
      Object.assign(target, src);
      return target;
    };
    //重置row初始值
    const resetFields = (resetVal: RuleList) => {
      Object.assign(state.form, resetVal);
    };
    //修改按钮
    const columnUpdateClick = (row: RuleList) => {
      console.log("columnUpdateButtonClick row ", row);
      resetFields(row);
      emit("visableFlag", true);
      state.isAdd = false;
    };

    //删除按钮
    const removeColumnClick = (row: RuleList) => {
      emit("removeRow", row);
    };
    //关闭
    const onClose = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      emit("visableFlag", false);
      state.isAdd = true;
    };
    //保存
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          emit("saveModal", createVal(state.form));
        }
      });
    };
    return {
      state,
      formRef,
      rules,
      columnUpdateClick,
      removeColumnClick,
      submitForm,
      onClose,
      eventSel
    };
  },

  data() {
    return {
    };
  },
  methods: {},
});
</script>


<style scoped>
.column-table-edit {
  height: 100%;
  background-color: white;
}

.column-table-edit .success-row {
  background-color: #dedede;
}

.column-table-edit .has-gutter .el-table__cell {
  text-align: center;
}
</style>
