<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table :data="state.tableData" border :highlight-current-row="true" size="small" style="width: 100%"
      :max-height="state.tableHieght">
      <el-table-column prop="name" label="排除约束名" align="center" />
      <el-table-column prop="forEach" label="索引方法" align="center" />
      <el-table-column prop="fireTime" label="元素" align="center" />
      <el-table-column prop="comment" label="注释" align="center" />
      <el-table-column prop="operate" label="操作" align="center">
        <template #default="scope">
          <el-button size="small" @click="columnUpdateClick(scope.row)">修改</el-button>
          <el-button size="small" @click="removeColumnClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" v-model="state.visible" title="添加排除" :destroy-on-close="false"
      @closed="onClose(formRef)">
      <el-form :model="state.form" :rules="rules" ref="formRef" status-icon label-width="100px">
        <el-form-item label="排出约束名" prop="name">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="索引方法" prop="indexType">
          <el-select v-model="state.form.indexType" placeholder=" ">
            <el-option v-for="item in indexType" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="注释" prop="comment">
          <el-input v-model="state.form.comment"></el-input>
        </el-form-item>
        <el-form-item label="表空间" prop="tableSpaceName">
          <el-select v-model="state.form.tableSpace" placeholder=" ">
            <el-option v-for="item in state.tableSpaceList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="填充系数(%)" prop="fillFactor">
          <el-input-number v-model="state.form.fillFactor" />
        </el-form-item>
        <el-form-item label="缓存" prop="buffering">
          <el-select v-model="state.form.buffering" placeholder=" ">
            <el-option v-for="item in buffer" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="条件" prop="wherePredicate">
          <el-input v-model="state.form.wherePredicate"></el-input>
        </el-form-item>
        <el-form-item label="可搁置">
          <el-select v-model="state.form.isDeferrableTemp" placeholder=" " @change="isDeferrableChange">
            <el-option v-for="item in a1" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="搁置">
          <el-select v-model="state.form.isDeferredTemp" placeholder=" " :disabled="state.isDeferredDisabled">
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
import type { FormInstance } from "element-plus";
import { getCurrentInstance } from 'vue'
import { findIndexTypeToOpClassSchema, findOpClassName, findSchemaToOperatorMap } from "@/api/treeNode";

import {
  TreeNode,
  ExcludeConstraintList,
} from "@/types";
const formRef = ref<FormInstance>();
const demo: ExcludeConstraintList = {
  "@clazz": "com.highgo.developer.model.HgdbTrigger",
  oid: -new Date().getTime(),
  name: "",
  indexType: "",
  tableSpace: "",
  fillFactor: -1,//填充系数
  buffering: "",//缓存
  wherePredicate: "",//条件
  excludeConstraintElements: [],
  comment: '',
  isDeferrable: false,//可搁置  false-NOT DEFERRABLE true-DEFERRABLE 
  isDeferred: true,//搁置 false-INITIALLY IMMEDIATE  true-INITIALLY DEFERRED
};

interface IState {
  visible: boolean;
  treeData: TreeNode<any>;
  tableData: ExcludeConstraintList[];
  tableHieght: number;
  form: ExcludeConstraintList;
  isAdd: boolean; //add or update
  tableSpaceList: string[];

  isDeferredDisabled: boolean;//搁置启用
}
export default defineComponent({
  name: "excludetab",
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
      findIndexTypeToOpClassSchema(state.treeData).then((responseData) => {
        console.log('findIndexTypeToOpClassSchema responseData ', responseData)
      });
      findOpClassName(state.treeData).then((responseData) => {
        console.log('findOpClassName responseData ', responseData)
      });
      findSchemaToOperatorMap(state.treeData).then((responseData) => {
        console.log('findSchemaToOperatorMap responseData ', responseData)
      });
    });
    const datab = getCurrentInstance();

    const rules = reactive({
      name: [{ required: true, message: "请输入触发器名称！", trigger: "blur" }],
      indexType: [{ required: true, message: "请选择索引方法！", trigger: "blur" }],

    });
    const { visible, treeData, tableData, tableSpaceList, fieldList } = toRefs(props);
    const state: IState = reactive({
      visible: visible.value,
      treeData: treeData.value as TreeNode<any>,
      tableData: tableData.value as ExcludeConstraintList[],
      tableHieght: window.innerHeight - 190, //60header,40tabs,40buttons,40tabheader
      form: {} as ExcludeConstraintList,
      isAdd: true,
      tableSpaceList: tableSpaceList.value as string[],


      isDeferredDisabled: false,
    });
    watch(
      visible,
      (newValue) => {
        state.visible = newValue;
        if (newValue && state.isAdd) {
          demo.oid = -new Date().getTime();
          //如果是新建，清空上一次页面缓存值
          resetFields(demo);
          resetDefer(demo)
        }
      },
      { immediate: true }
    );
    watch(
      tableData,
      (newValue) => {
        state.tableData = newValue as ExcludeConstraintList[];
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
    //对象拷贝
    const createVal = (src: ExcludeConstraintList) => {
      const target = {} as ExcludeConstraintList;
      Object.assign(target, src);
      return target;
    };
    //重置row初始值
    const resetFields = (resetVal: ExcludeConstraintList) => {
      Object.assign(state.form, resetVal);
    };
    const resetDefer = (row: ExcludeConstraintList) => {
      //解析索引字段
      const a1 = datab!.data.a1 as string[];
      const a2 = datab!.data.a2 as string[];
      if (row.isDeferrable) {//DEFERRABLE
        state.form.isDeferrableTemp = a1[0];
        state.isDeferredDisabled = false
      } else {//NOT DEFERRABLE
        state.form.isDeferrableTemp = a1[1];
        state.isDeferredDisabled = true
      }
      state.form.isDeferredTemp = row.isDeferred ? a2[0] : a2[1];
    }
    //修改按钮
    const columnUpdateClick = (row: ExcludeConstraintList) => {
      console.log("columnUpdateButtonClick row ", row);
      state.isAdd = false;
      resetFields(row);
      resetDefer(row);
      emit("visableFlag", true);
    };

    //删除按钮
    const removeColumnClick = (row: ExcludeConstraintList) => {
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
          const a1 = datab!.data.a1 as string[];
          const a2 = datab!.data.a2 as string[];
          data.isDeferrable = data.isDeferrableTemp == a1[0] ? true : false;
          data.isDeferred = data.isDeferredTemp == a2[0] ? true : false;
          emit("saveModal", data);
        }
      });
    };
    const isDeferrableChange = (val: string) => {
      console.log('datab', datab)
      const a1 = datab!.data.a1 as string[];
      if (a1[0] == val) {
        //DEFERRABLE 启用
        state.isDeferredDisabled = false;
      } else {
        //NOT DEFERRABLE 禁用
        state.isDeferredDisabled = true;
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
      isDeferrableChange,
    };
  },

  data() {
    return {
      indexType: ['btree', 'hash', 'gist', 'gin', 'spgist', 'brin'],
      buffer: ['ON', 'OFF', 'AUTO'],
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
