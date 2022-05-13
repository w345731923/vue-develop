<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table
      :data="state.tableData"
      border
      :highlight-current-row="true"
      size="small"
    >
      <el-table-column prop="column" label="字段名" align="center" />
      <el-table-column prop="type" label="类型" align="center" />
      <el-table-column prop="length" label="长度" align="center" />
      <el-table-column prop="point" label="小数点" align="center" />
      <el-table-column prop="notnull" label="不是null" align="center" />
      <el-table-column prop="primary" label="主键" align="center" />
      <el-table-column prop="comment" label="注释" align="center" />
      <el-table-column prop="operate" label="操作" align="center">
        <template #default="scope">
          <el-button size="small" @click="columnUpdateClick(scope.row)"
            >修改</el-button
          >
          <el-button size="small" @click="removeColumnClick(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :close-on-click-modal="false"
      v-model="state.columnVisible"
      title="添加字段"
      :destroy-on-close="false"
      @closed="onClose(formRef)"
    >
      <el-form
        :model="state.form"
        :rules="rules"
        ref="formRef"
        status-icon
        label-width="80px"
      >
        <el-form-item label="字段" prop="column">
          <el-input v-model="state.form.column" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="state.form.type" filterable placeholder=" ">
            <el-option
              v-for="item in state.dataTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="长度" prop="length">
          <el-input-number v-model="state.form.length" :min="0" />
        </el-form-item>
        <el-form-item label="小数点" prop="point">
          <el-input-number v-model="state.form.point" :min="0" />
        </el-form-item>
        <el-form-item label="不是null" prop="notnull">
          <el-switch v-model="state.form.notnull" />
        </el-form-item>
        <el-form-item label="主键" prop="primary">
          <el-switch v-model="state.form.primary" />
        </el-form-item>
        <el-form-item label="注释" prop="comment">
          <el-input v-model="state.form.comment" autocomplete="off"></el-input>
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
import type { FormInstance, TabsPaneContext } from "element-plus";
import { ResponseData, TreeNode, TableRow, DataType } from "@/types";
import { getDataType } from "@/api/treeNode";
const formRef = ref<FormInstance>();
const rules = reactive({
  column: [{ required: true, message: "请输入字段名！", trigger: "blur" }],
  // type: [{ required: true, message: "请选择数据类型！", trigger: "blur" }],
});
const demo = {
  id: -new Date().getTime(),
  column: "",
  type: "",
  length: 0,
  point: 0,
  notnull: false,
  primary: false,
  comment: "",
};
export default defineComponent({
  name: "columntab",
  props: {
    columnVisible: {
      type: Boolean,
      default: false,
    },
    tableData: Array,
    saveModal: Function,
    removeColumn: Function,
    visableFlag: Function,
  },
  // const data = state.treeNode.data as TreeNode<TableSimple>;
  // getDataType(data).then((ResponseData:any) => {
  //   console.log('getDataType ResponseData',ResponseData)
  // });
  emits: ["visableFlag", "saveModal", "removeColumn"],
  setup(props, { emit }) {
    onMounted(() => {
      console.log("onMounted");
      const sessionVal = sessionStorage.getItem("aaa");
      if (sessionVal != null) {
        console.log("session get sessionVal  ", sessionVal);
        const treeData = JSON.parse(sessionVal!) as TreeNode<any>;
        console.log("sessionVal convert treeData = ", treeData);

        getDataType(treeData).then((ResponseData: ResponseData<DataType[]>) => {
          console.log("getDataType ResponseData", ResponseData);
        });
      }
    });
    const { columnVisible, tableData } = toRefs(props);
    const state = reactive({
      columnVisible: columnVisible.value,
      tableData: tableData.value,
      form: {} as TableRow,
      dataTypeList: [
        {
          value: "char",
          label: "char",
        },
        {
          value: "boolean",
          label: "boolean",
        },
        {
          value: "date",
          label: "date",
        },
      ],
    });
    watch(
      columnVisible,
      (newValue) => {
        state.columnVisible = newValue;
        if (newValue) {
          demo.id = -new Date().getTime();
          //如果是新建，清空上一次页面缓存值
          resetFields(demo);
        }
      },
      { immediate: true }
    );

    //重置row初始值
    const resetFields = (resetVal: TableRow) => {
      const target = {} as TableRow;
      Object.assign(target, resetVal);
      state.form = target;
    };
    //修改按钮
    const columnUpdateClick = (row: TableRow) => {
      console.log("columnUpdateButtonClick row ", row);
      //使用target，为了避免弹窗后修改内容，后面表格有变化，所以复制了一个对象
      resetFields(row);
      //修改不在调用父类方法，内部处理
      state.columnVisible = true;
    };
    //删除按钮
    const removeColumnClick = (row: TableRow) => {
      emit("removeColumn", row);
    };
    //关闭
    const onClose = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      state.columnVisible = false;
      emit("visableFlag", false);
      // formEl.resetFields();
    };
    //保存
    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          state.columnVisible = false;
          emit("saveModal", state.form);
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
    return {};
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
