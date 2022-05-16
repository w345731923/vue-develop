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
      <el-table-column prop="name" label="字段名" align="center" />
      <el-table-column
        prop="type"
        label="类型"
        align="center"
        :formatter="
          function (row, column, cellValue, index) {
            return row.dataType.name;
          }
        "
      />
      <el-table-column
        prop="length"
        label="长度"
        align="center"
        :formatter="
          function (row) {
            return row.dataType.length;
          }
        "
      />
      <el-table-column
        prop="point"
        label="小数点"
        align="center"
        :formatter="
          function (row) {
            return row.dataType.decimalNumber;
          }
        "
      />
      <el-table-column prop="isNotNull_1" label="不是null" align="center">
        <template #default="scope">
          <el-checkbox
            disabled
            v-if="scope.row.isNotNull == true"
            :checked="true"
          />
          <el-checkbox disabled v-if="scope.row.isNotNull != true" />
        </template>
      </el-table-column>
      <el-table-column prop="isPrimaryKey_1" label="主键" align="center">
        <template #default="scope">
          <el-checkbox
            disabled
            v-if="scope.row.isPrimaryKey == true"
            :checked="true"
          />
          <el-checkbox disabled v-if="scope.row.isPrimaryKey != true" />
        </template>
      </el-table-column>
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
        <el-form-item label="字段" prop="name">
          <el-input v-model="state.form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="state.form.dataType.name"
            filterable
            placeholder=" "
            @change="dataTypeChange"
          >
            <el-option
              v-for="item in state.dataTypeList"
              :key="item.formatName"
              :label="item.formatName"
              :value="item.formatName"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="长度" prop="length">
          <el-input-number v-model="state.form.dataType.length" :min="0" />
        </el-form-item>
        <el-form-item label="小数点" prop="point">
          <el-input-number
            v-model="state.form.dataType.decimalNumber"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="不是null" prop="isNotNull">
          <el-switch v-model="state.form.isNotNull" />
        </el-form-item>
        <el-form-item label="主键" prop="isPrimaryKey">
          <el-switch v-model="state.form.isPrimaryKey" />
        </el-form-item>
        <el-form-item label="注释" prop="comment">
          <el-input v-model="state.form.comment"></el-input>
        </el-form-item>
        <el-form-item label="默认值" prop="defaultValue">
          <el-input v-model="state.form.defaultValue"></el-input>
        </el-form-item>
        <el-form-item label="排序规则1" prop="collationSpaceName">
          <el-select
            v-model="state.form.dataType.name"
            filterable
            placeholder=" "
            :disabled="!state.collationVis"
          >
            <el-option
              v-for="item in state.dataTypeList"
              :key="item.formatName"
              :label="item.formatName"
              :value="item.formatName"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="state.form.dataType.name"
            filterable
            placeholder=" "
            :disabled="!state.collationVis"
          >
            <el-option
              v-for="item in state.dataTypeList"
              :key="item.name"
              :label="item.formatName"
              :value="item.name"
            >
            </el-option>
          </el-select>
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
import {
  ResponseData,
  TreeNode,
  DataType,
  FieldList,
  FieldDataType,
} from "@/types";
import { getDataType } from "@/api/treeNode";
const formRef = ref<FormInstance>();
const demo: FieldList = {
  id: -new Date().getTime(),
  name: "",
  dataType: { name: "", length: 0, decimalNumber: 0 },
  isNotNull: false,
  isPrimaryKey: false,
  comment: "",
  defaultValue: "", //默认
  collationSpaceName: "", //规则1-1
  collationName: "", //规则1-2
};

interface IState {
  columnVisible: boolean;
  tableData: FieldList[];
  form: FieldList;
  dataTypeList: DataType[];
  isAdd: boolean; //add or update
  collationVis: boolean; //排序规则
}
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
  emits: ["visableFlag", "saveModal", "removeColumn"],
  setup(props, { emit }) {
    onMounted(() => {
      console.log("onMounted");
      const sessionVal = sessionStorage.getItem("create-table-session");
      if (sessionVal != null) {
        console.log("session get sessionVal  ", sessionVal);
        const treeData = JSON.parse(sessionVal!) as TreeNode<any>;
        console.log("sessionVal convert treeData = ", treeData);

        getDataType(treeData).then((responseData: ResponseData<DataType[]>) => {
          console.log("getDataType ResponseData", responseData);
          state.dataTypeList = responseData.data;
        });
      }
    });
    const validateType = (rule: any, value: any, callback: any) => {
      if (state.form.dataType.name === "") {
        callback(new Error("请选择数据类型！"));
      } else {
        callback();
      }
    };
    const rules = reactive({
      name: [{ required: true, message: "请输入字段名！", trigger: "blur" }],
      type: [{ validator: validateType, trigger: "blur" }],
      // type: [{ required: true, message: "请选择数据类型！", trigger: "blur" }],
    });

    const { columnVisible, tableData } = toRefs(props);
    const state: IState = reactive({
      columnVisible: columnVisible.value,
      tableData: tableData.value as FieldList[],
      form: {} as FieldList,
      dataTypeList: [],
      isAdd: true,
      collationVis: false,
    });
    watch(
      columnVisible,
      (newValue) => {
        state.columnVisible = newValue;
        if (newValue && state.isAdd) {
          demo.id = -new Date().getTime();
          //如果是新建，清空上一次页面缓存值
          resetFields(demo);
          state.form.dataType = { name: "", length: 0, decimalNumber: 0 };
        }
      },
      { immediate: true }
    );
    //对象拷贝
    const createVal = (src: FieldList) => {
      const target = {} as FieldList;
      Object.assign(target, src);
      return target;
    };
    //重置row初始值
    const resetFields = (resetVal: FieldList) => {
      Object.assign(state.form, resetVal);
    };
    //修改按钮
    const columnUpdateClick = (row: FieldList) => {
      console.log("columnUpdateButtonClick row ", row);
      resetFields(row);
      state.form.dataType = row.dataType;
      emit("visableFlag", true);
      state.isAdd = false;
    };
    //删除按钮
    const removeColumnClick = (row: FieldList) => {
      emit("removeColumn", row);
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
    const dataTypeChange = (val: string) => {
      console.log("dataTypeChange val ", val);
      const selected = state.dataTypeList.find(
        (item) => item.formatName == val
      );
      console.log("selected", selected);
      if (selected?.isCollatable) {
        state.collationVis = true;
      }
    };
    return {
      state,
      formRef,
      rules,
      columnUpdateClick,
      removeColumnClick,
      validateType,
      submitForm,
      onClose,
      dataTypeChange,
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
