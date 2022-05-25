<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table :data="state.tableData" border :highlight-current-row="true" size="small" style="width: 100%"
      :max-height="state.tableHieght">
      <el-table-column prop="name" label="外键约束名" align="center" />
      <el-table-column prop="columns" label="字段" align="center" />
      <el-table-column prop="comment" label="参考模式" align="center" />
      <el-table-column prop="comment" label="参考表" align="center" />
      <el-table-column prop="comment" label="参考字段" align="center" />
      <el-table-column prop="comment" label="删除时" align="center" />
      <el-table-column prop="comment" label="更新时" align="center" />
      <el-table-column prop="comment" label="注释" align="center" />
      <el-table-column prop="operate" label="操作" align="center">
        <template #default="scope">
          <el-button size="small" @click="columnUpdateClick(scope.row)">修改</el-button>
          <el-button size="small" @click="removeColumnClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" v-model="state.indexVisible" title="添加外键" :destroy-on-close="false"
      @closed="onClose(formRef)">
      <el-form :model="state.form" :rules="rules" ref="formRef" status-icon label-width="100px">
        <el-form-item label="外键约束名" prop="name">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="字段">
          <el-select v-model="state.form.columnsT" multiple placeholder=" " style="width: 240px">
            <el-option v-for="item in state.fieldList" :key="item.oid" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="参考模式" prop="indexType">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="参考表" prop="isUnique">
          <el-switch v-model="state.form.comment" />
        </el-form-item>
        <el-form-item label="参考字段" prop="isClustered">
          <el-switch v-model="state.form.comment" />
        </el-form-item>
        <el-form-item label="删除时" prop="comment">
          <el-select v-model="state.form.comment" placeholder=" ">
            <el-option v-for="item in time" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="更新时" prop="tablespaceName">
          <el-select v-model="state.form.comment" placeholder=" ">
            <el-option v-for="item in time" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="注释">
          <el-input v-model="state.form.comment"></el-input>
        </el-form-item>
        <el-form-item label="可搁置">
          <el-select v-model="state.form.gezhi" placeholder=" " @change="kegezhiChange">
            <el-option v-for="item in a1" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="搁置">
          <el-select v-model="state.form.kegezhi" placeholder=" " :disabled="state.gezhiDisabled">
            <el-option v-for="item in a2" :key="item" :label="item" :value="item" />
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
  TreeNode,
  FieldList,
  ForeignKeyList,
} from "@/types";
import { getCurrentInstance } from 'vue'

const formRef = ref<FormInstance>();
const demo: ForeignKeyList = {
  "@clazz": "com.highgo.developer.model.HgdbForeignKey",
  oid: -new Date().getTime(),
  name: "",
  columns: "",
  comment: "",

  gezhi: 'NOT DEFERRABLE',
  kegezhi: 'INITIALLY IMMEDIATE'
};

interface IState {
  indexVisible: boolean;
  treeData: TreeNode<any>;
  tableData: ForeignKeyList[];
  tableHieght: number;
  form: ForeignKeyList;
  isAdd: boolean; //add or update
  tableSpaceList: string[];
  fieldList: FieldList[];

  gezhiDisabled: boolean;
}
export default defineComponent({
  name: "uniquetab",
  props: {
    indexVisible: {
      type: Boolean,
      default: false,
    },
    treeData: Object,
    tableData: Array,
    tableSpaceList: Array,
    fieldList: Array,
    saveModal: Function,
    removeRow: Function,
    visableFlag: Function,
  },
  emits: ["visableFlag", "saveModal", "removeRow"],
  setup(props, { emit }) {
    onMounted(() => {
    });
    const datab = getCurrentInstance();
    const rules = reactive({
      name: [{ required: true, message: "请输入字段名！", trigger: "blur" }],
      indexType: [{ required: true, message: "请选择索引方法！", trigger: "blur" }],
    });
    const { indexVisible, treeData, tableData, tableSpaceList, fieldList } = toRefs(props);
    const state: IState = reactive({
      indexVisible: indexVisible.value,
      treeData: treeData.value as TreeNode<any>,
      tableData: tableData.value as ForeignKeyList[],
      tableHieght: window.innerHeight - 190, //60header,40tabs,40buttons,40tabheader
      form: {} as ForeignKeyList,
      dataTypeList: [],
      isAdd: true,
      tableSpaceList: tableSpaceList.value as string[],
      fieldList: fieldList.value as FieldList[],

      gezhiDisabled: true,
    });
    watch(
      indexVisible,
      (newValue) => {
        state.indexVisible = newValue;
        if (newValue && state.isAdd) {
          demo.oid = -new Date().getTime();
          //如果是新建，清空上一次页面缓存值
          resetFields(demo);
          state.form.columns = "";
          state.form.columnsT = [];
        }
      },
      { immediate: true }
    );
    watch(
      tableData,
      (newValue) => {
        state.tableData = newValue as ForeignKeyList[];
      },
      { immediate: true }
    );
    watch(
      treeData,
      (newValue) => {
        state.treeData = newValue as TreeNode<any>;
      },
      { immediate: true }
    );
    watch(
      tableSpaceList,
      (newValue) => {
        state.tableSpaceList = newValue as string[];
      },
      { immediate: true }
    );
    watch(
      fieldList,
      (newValue) => {
        state.fieldList = newValue as FieldList[];
      },
      { immediate: true }
    );
    //对象拷贝
    const createVal = (src: ForeignKeyList) => {
      const target = {} as ForeignKeyList;
      Object.assign(target, src);
      return target;
    };
    //重置row初始值
    const resetFields = (resetVal: ForeignKeyList) => {
      Object.assign(state.form, resetVal);
    };
    //修改按钮
    const columnUpdateClick = (row: ForeignKeyList) => {
      console.log("columnUpdateButtonClick row ", row);
      resetFields(row);
      //解析索引字段
      emit("visableFlag", true);
      state.isAdd = false;
    };

    //删除按钮
    const removeColumnClick = (row: ForeignKeyList) => {
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
    const kegezhiChange = (val: string) => {
      console.log('datab', datab)
      const a1 = datab!.data.a1 as string[];
      if (a1[0] == val) {
        //DEFERRABLE 启用
        state.gezhiDisabled = false;
      } else {
        //NOT DEFERRABLE 禁用
        state.gezhiDisabled = true;
      }
    }
    return {
      state,
      formRef,
      rules,
      columnUpdateClick,
      removeColumnClick,
      submitForm,
      onClose,
      kegezhiChange
    };
  },

  data() {
    return {
      time: ['RESTRICT', 'NO ACTION', 'CASCADE', 'SET NULL', 'SET DEFAULT'],
      a1: ['DEFERRABLE', 'NOT DEFERRABLE'],
      a2: ['INITIALLY IMMEDIATE', 'INITIALLY DEFERRED']
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
