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
        <el-form-item label="排序规则1">
          <el-select
            v-model="state.form.collationSpaceName"
            placeholder=" "
            :disabled="!state.collationVis"
            @change="collationSpaceNameChange"
          >
            <el-option
              v-for="item in state.collation1"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="state.form.collationName"
            placeholder=" "
            :disabled="!state.collationVis"
          >
            <el-option
              v-for="item in state.collation2"
              :key="item"
              :label="item"
              :value="item"
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
import { getDataType, getCollation } from "@/api/treeNode";
const formRef = ref<FormInstance>();
const demo: FieldList = {
  "@clazz": "com.highgo.developer.model.HgdbField",
  oid: -new Date().getTime(),
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
  treeData: TreeNode<any>;
  tableData: FieldList[];
  form: FieldList;
  dataTypeList: DataType[];
  isAdd: boolean; //add or update
  collationVis: boolean; //排序规则
  collation1: string[];
  collation2: string[];
  collationMap: Map<string, string>;
}
export default defineComponent({
  name: "columntab",
  props: {
    columnVisible: {
      type: Boolean,
      default: false,
    },
    treeData: Object,
    tableData: Array,
    saveModal: Function,
    removeColumn: Function,
    visableFlag: Function,
  },
  emits: ["visableFlag", "saveModal", "removeColumn"],
  setup(props, { emit }) {
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
    const getInitData = () => {
      if (state.treeData != null && state.dataTypeList.length == 0) {
        getDataType(state.treeData).then(
          (responseData: ResponseData<DataType[]>) => {
            console.log("getDataType ResponseData", responseData);
            state.dataTypeList = responseData.data;
          }
        );
        getCollation(state.treeData).then((responseData) => {
          console.log("getCollation ResponseData", responseData);
          state.collationMap = responseData.data;
          const map = new Map(Object.entries(responseData.data));
          for (let [key, value] of map) {
            state.collation1.push(key);
          }
        });
      }
    };
    const { columnVisible, treeData, tableData } = toRefs(props);
    console.log("toRefs treeData", treeData);
    const state: IState = reactive({
      columnVisible: columnVisible.value,
      treeData: treeData.value as TreeNode<any>,
      tableData: tableData.value as FieldList[],
      form: {} as FieldList,
      dataTypeList: [],
      isAdd: true,
      collationVis: false,
      collation1: [],
      collation2: [],
      collationMap: new Map(),
    });
    watch(
      columnVisible,
      (newValue) => {
        state.columnVisible = newValue;
        if (newValue && state.isAdd) {
          demo.oid = -new Date().getTime();
          //如果是新建，清空上一次页面缓存值
          resetFields(demo);
          state.form.dataType = { name: "", length: 0, decimalNumber: 0 };
        }
      },
      { immediate: true }
    );
    watch(
      tableData,
      (newValue) => {
        state.tableData = newValue as FieldList[];
      },
      { immediate: true }
    );
    watch(
      treeData,
      (newValue) => {
        state.treeData = newValue as TreeNode<any>;
        getInitData();
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
      //初始化排序设定值
      dataTypeChange(state.form.dataType.name);
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
      state.collationVis = false;
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
    //数据类型下拉框事件
    const dataTypeChange = (val: string) => {
      console.log("dataTypeChange val ", val);
      const selected = state.dataTypeList.find(
        (item) => item.formatName == val
      );
      console.log("selected", selected);
      if (selected?.isCollatable) {
        state.collationVis = true;
      } else {
        state.collationVis = false;
      }
    };
    //排序规则1下拉框事件
    const collationSpaceNameChange = (val: string) => {
      console.log("collationNameChange val ", val);
      state.collation2 = [];
      state.collation2 = state.collationMap[val] as string[];
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
      collationSpaceNameChange,
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
