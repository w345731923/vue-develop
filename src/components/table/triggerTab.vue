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

    <el-dialog :close-on-click-modal="false" v-model="state.visible" title="添加索引" :destroy-on-close="false"
      @closed="onClose(formRef)">
      <el-form :model="state.form" :rules="rules" ref="formRef" status-icon label-width="90px">
        <el-form-item label="索引名" prop="name">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="字段">
          <el-select v-model="state.form.columnsT" multiple placeholder=" " style="width: 240px">
            <el-option v-for="item in state.fieldList" :key="item.oid" :label="item.name" :value="item.name" />
          </el-select>
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
        <el-form-item label="填充系数(%)" prop="reloptions">
          <el-input-number v-model="state.form.reloptions" />
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
import type { FormInstance } from "element-plus";
import {
  TreeNode,
  FieldList,
  IndexList,
} from "@/types";
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
  reloptions: -1,//填充系数，api是string，填入是number的百分比
  constraint: "",
  expression: "" //表达式
};

interface IState {
  visible: boolean;
  treeData: TreeNode<any>;
  tableData: IndexList[];
  tableHieght: number;
  form: IndexList;
  isAdd: boolean; //add or update
  tableSpaceList: string[];
  fieldList: FieldList[];
}
export default defineComponent({
  name: "triggertab",
  props: {
    visible: {
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
    const rules = reactive({
      name: [{ required: true, message: "请输入字段名！", trigger: "blur" }],
      indexType: [{ required: true, message: "请选择索引方法！", trigger: "blur" }],
    });
    const { visible, treeData, tableData, tableSpaceList, fieldList } = toRefs(props);
    const state: IState = reactive({
      visible: visible.value,
      treeData: treeData.value as TreeNode<any>,
      tableData: tableData.value as IndexList[],
      tableHieght: window.innerHeight - 190, //60header,40tabs,40buttons,40tabheader
      form: {} as IndexList,
      dataTypeList: [],
      isAdd: true,
      tableSpaceList: tableSpaceList.value as string[],
      fieldList: fieldList.value as FieldList[],
    });
    watch(
      visible,
      (newValue) => {
        state.visible = newValue;
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
        state.tableData = newValue as IndexList[];
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
      //解析索引字段
      state.form.columnsT = splitColumns(row.columns);
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
          const data = createVal(state.form);
          data.columns = mergeColumn(state.form.columnsT!)
          emit("saveModal", data);
        }
      });
    };
    //合并column字段值
    const mergeColumn = (selected: string[]) => {
      let columns = '';
      state.form.columnsT?.forEach(item => {
        columns += '"' + item + '",'
      })
      // columns = ""444","1","
      columns = columns.length > 0 ? columns.substring(0, columns.length - 1) : columns;
      return columns;
    }
    //拆分选择的column值本方法源于后台方法
    const splitColumns = (val: string) => {
      let result: string[] = [];
      let count: number = 0;
      let sb: string[] = [];
      for (var i = 0; i < val.length; i++) {
        const c = val.charAt(i)
        if (c == '"') {
          count++;
          if (i < val.length - 1 && val.charAt(i + 1) == '"') {
            count++;
            i = i + 1;
            sb.push(c)
          }
          continue;
        }
        if (c == ',' && count % 2 == 0) {
          result.push(sb.join(''));
          sb = [];
        } else {
          sb.push(c)
        }
      }
      if (sb.length > 0) {
        result.push(sb.join(''))
      }
      console.log('result', result)
      return result;
    }
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
