<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table :data="state.tableData" border :highlight-current-row="true" size="small" style="width: 100%"
      :max-height="state.tableHieght">
      <el-table-column prop="name" label="检查约束名" align="center" />
      <el-table-column prop="checkExpression" label="表达式" align="center" />
      <el-table-column prop="isNoInherit" label="没有继承" align="center">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.isNoInherit == true" :checked="true" />
          <el-checkbox disabled v-if="scope.row.isNoInherit != true" />
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

    <el-dialog :close-on-click-modal="false" v-model="state.visible" title="添加索引" :destroy-on-close="false"
      @closed="onClose(formRef)">
      <el-form :model="state.form" :rules="rules" ref="formRef" status-icon label-width="90px">
        <el-form-item label="检查约束名" prop="name">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="表达式" prop="checkExpression">
          <el-input v-model="state.form.checkExpression"></el-input>
        </el-form-item>
        <el-form-item label="没有继承">
          <el-switch v-model="state.form.isNoInherit" />
        </el-form-item>
        <el-form-item label="注释">
          <el-input v-model="state.form.comment"></el-input>
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
  CheckList,
} from "@/types";
const formRef = ref<FormInstance>();
const demo: CheckList = {
  "@clazz": "com.highgo.developer.model.HgdbCheck",
  oid: -new Date().getTime(),
  name: "",
  checkExpression: "",
  isNoInherit: false,
  comment: "",
};

interface IState {
  visible: boolean;
  tableData: CheckList[];
  tableHieght: number;
  form: CheckList;
  isAdd: boolean; //add or update
}
export default defineComponent({
  name: "checktab",
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
      name: [{ required: true, message: "请输入检查约束名！", trigger: "blur" }],
      checkExpression: [{ required: true, message: "请输入表达式！", trigger: "blur" }],
    });
    const { visible, tableData } = toRefs(props);
    const state: IState = reactive({
      visible: visible.value,
      tableData: tableData.value as CheckList[],
      tableHieght: window.innerHeight - 190, //60header,40tabs,40buttons,40tabheader
      form: {} as CheckList,
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
        state.tableData = newValue as CheckList[];
      },
      { immediate: true }
    );

    //对象拷贝
    const createVal = (src: CheckList) => {
      const target = {} as CheckList;
      Object.assign(target, src);
      return target;
    };
    //重置row初始值
    const resetFields = (resetVal: CheckList) => {
      Object.assign(state.form, resetVal);
    };
    //修改按钮
    const columnUpdateClick = (row: CheckList) => {
      console.log("columnUpdateButtonClick row ", row);
      resetFields(row);
      emit("visableFlag", true);
      state.isAdd = false;
    };

    //删除按钮
    const removeColumnClick = (row: CheckList) => {
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
          const data = createVal(state.form);
          emit("saveModal", data);
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
