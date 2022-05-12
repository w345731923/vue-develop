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
          <el-button size="small" @click="columnUpdateButtonClick(scope.row)"
            >修改</el-button
          >
          <el-button size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :close-on-click-modal="false"
      v-model="state.columnVisible"
      title="添加字段"
      :destroy-on-close="true"
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
        <el-form-item label="长度">
          <el-input-number v-model="state.form.length" :min="0" />
        </el-form-item>
        <el-form-item label="小数点">
          <el-input-number v-model="state.form.point" :min="0" />
        </el-form-item>
        <el-form-item label="不是null">
          <el-switch v-model="state.form.notnull" />
        </el-form-item>
        <el-form-item label="主键">
          <el-switch v-model="state.form.primary" />
        </el-form-item>
        <el-form-item label="注释">
          <el-input v-model="state.form.comment" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="onClose(ruleFormRef)">取消</el-button>
        <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch, ref } from "vue";
import type { FormInstance, TabsPaneContext } from "element-plus";
const formRef = ref<FormInstance>();
const rules = reactive({
  column: [{ required: true, message: "请输入字段名！", trigger: "blur" }],
  // type: [{ required: true, message: "请选择数据类型！", trigger: "blur" }],
});

export default defineComponent({
  name: "columntab",
  props: {
    columnVisible: {
      type: Boolean,
      default: false,
    },
    tableData: Array,
    saveModal: Function,
    closeModal: Function,
  },
  emits: ["saveModal", "closeModal", "aa"],
  setup(props, { emit }) {
    const { columnVisible, tableData } = toRefs(props);
    const state = reactive({
      columnVisible: columnVisible.value,
      tableData: tableData.value,
      form: {
        column: "",
        type: "",
        length: 0,
        point: 0,
        notnull: false,
        primary: false,
        comment: "",
      },
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
      },
      { immediate: true }
    );
    const columnUpdateButtonClick = (row: any) => {
      state.columnVisible = true;
      console.log(row);
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
      formEl.validate((valid) => {
        if (valid) {
          console.log("validate state.form", state.form);
          emit("saveModal", state.form);
        }
      });
    };
    return {
      state,
      formRef,
      rules,
      columnUpdateButtonClick,
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
