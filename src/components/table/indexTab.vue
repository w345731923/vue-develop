<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table :data="state.tableData" border :highlight-current-row="true" size="small" style="width: 100%"
      :max-height="state.tableHieght">
      <el-table-column prop="name" label="索引名" align="center" />
      <el-table-column prop="columns" label="字段" align="center" />
      <el-table-column prop="indexType" label="索引方法" align="center" />
      <el-table-column prop="isUnique" label="唯一键" align="center">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.isUnique == true" :checked="true" />
          <el-checkbox disabled v-if="scope.row.isUnique != true" />
        </template>
      </el-table-column>

      <el-table-column prop="isClustered" label="并发" align="center">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.isClustered == true" :checked="true" />
          <el-checkbox disabled v-if="scope.row.isClustered != true" />
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

    <el-dialog :close-on-click-modal="false" v-model="state.indexVisible" title="添加索引" :destroy-on-close="false"
      @closed="onClose(formRef)">
      <el-form :model="state.form" :rules="rules" ref="formRef" status-icon label-width="90px">
        <el-form-item label="索引名" prop="name">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="字段" prop="columns">
          <el-input-number v-model="state.form.columns" />
        </el-form-item>
        <el-form-item label="索引方法" prop="indexType">
          <el-select v-model="state.form.indexType" placeholder=" ">
            <el-option v-for="item in indexType" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="唯一键" prop="isUnique">
          <el-switch v-model="state.form.isUnique" />
        </el-form-item>
        <el-form-item label="并发" prop="isClustered">
          <el-switch v-model="state.form.isClustered" />
        </el-form-item>
        <el-form-item label="注释" prop="comment">
          <el-input v-model="state.form.comment"></el-input>
        </el-form-item>
        <el-form-item label="表空间" prop="tablespaceName">
          <el-select v-model="state.form.tablespaceName" placeholder=" ">
            <el-option v-for="item in state.tableSpaceList" :key="item" :label="item" :value="item" />
          </el-select>

        </el-form-item>
        <el-form-item label="填充系数(%)" prop="reloption">
          <el-input-number v-model="state.form.reloption" />
          <!-- <el-input-number v-model="state.form.reloption" oninput="value=value.replace(/[^\d]/g,'')"></el-input> -->
        </el-form-item>
        <el-form-item label="条件" prop="constraint">
          <el-input v-model="state.form.constraint"></el-input>
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
  IndexList,
} from "@/types";
import { getDatabaseTableSpace } from "@/api/treeNode";
const formRef = ref<FormInstance>();
const demo: IndexList = {
  "@clazz": "com.highgo.developer.model.HgdbIndex",
  oid: -new Date().getTime(),
  name: "",
  columns: "",
  indexType: "",
  isUnique: false,
  isClustered: false,
  comment: "",
  tablespaceName: "",
  reloption: -1,//填充系数，api是string，填入是number的百分比
  constraint: "",
  expression: "" //表达式
};

interface IState {
  indexVisible: boolean;
  treeData: TreeNode<any>;
  tableData: IndexList[];
  tableHieght: number;
  form: IndexList;
  isAdd: boolean; //add or update
  tableSpaceList: string[];
}
export default defineComponent({
  name: "columntab",
  props: {
    indexVisible: {
      type: Boolean,
      default: false,
    },
    treeData: Object,
    tableData: Array,
    tableSpaceList: Array,
    saveModal: Function,
    removeRow: Function,
    visableFlag: Function,
  },
  emits: ["visableFlag", "saveModal", "removeRow"],
  setup(props, { emit }) {
    onMounted(() => {
      getInitData();
    });
    const rules = reactive({
      name: [{ required: true, message: "请输入字段名！", trigger: "blur" }],
    });
    const getInitData = () => {
      console.log('state.treeData', state.treeData)
      // if (state.treeData != null && state.tableSpaceList.length == 0) {
      //   getDatabaseTableSpace(state.treeData.connectionId!).then(
      //     (resp: ResponseData<string[]>) => {
      //       state.tableSpaceList = resp.data;
      //     }
      //   );
      // };
    }
    const { indexVisible, treeData, tableData, tableSpaceList } = toRefs(props);
    const state: IState = reactive({
      indexVisible: indexVisible.value,
      treeData: treeData.value as TreeNode<any>,
      tableData: tableData.value as IndexList[],
      tableHieght: window.innerHeight - 190, //60header,40tabs,40buttons,40tabheader
      form: {} as IndexList,
      dataTypeList: [],
      isAdd: true,
      tableSpaceList: tableSpaceList.value as string[],

    });
    watch(
      indexVisible,
      (newValue) => {
        state.indexVisible = newValue;
        if (newValue && state.isAdd) {
          demo.oid = -new Date().getTime();
          //如果是新建，清空上一次页面缓存值
          resetFields(demo);
          // state.form.dataType = { name: "", length: 0, decimalNumber: 0 };
        }
      },
      { immediate: true }
    );
    watch(
      tableData,
      (newValue) => {
        state.tableData = newValue as IndexList[];
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
    watch(
      tableSpaceList,
      (newValue) => {
        state.tableSpaceList = newValue as string[];
      },
      { immediate: true }
    );
    //对象拷贝
    const createVal = (src: IndexList) => {
      const target = {} as IndexList;
      Object.assign(target, src);
      return target;
    };
    //重置row初始值
    const resetFields = (resetVal: IndexList) => {
      Object.assign(state.form, resetVal);
    };
    //修改按钮
    const columnUpdateClick = (row: IndexList) => {
      console.log("columnUpdateButtonClick row ", row);
      resetFields(row);
      emit("visableFlag", true);
      state.isAdd = false;
    };

    //删除按钮
    const removeColumnClick = (row: IndexList) => {
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
    };
  },

  data() {
    return {
      indexType: ['btree', 'hash', 'gist', 'gin', 'spgist', 'brin']
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
