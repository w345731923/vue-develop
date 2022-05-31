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
      <el-table-column prop="foreignKeyFields" label="字段" align="center" />
      <el-table-column prop="referencesSchemaName" label="参考模式" align="center" />
      <el-table-column prop="referencesTableName" label="参考表" align="center" />
      <el-table-column prop="referencesFields" label="参考字段" align="center" />
      <el-table-column prop="deleteStrategy" label="删除时" align="center" />
      <el-table-column prop="updateStretegy" label="更新时" align="center" />
      <el-table-column prop="comment" label="注释" align="center" />
      <el-table-column prop="operate" label="操作" align="center">
        <template #default="scope">
          <el-button size="small" @click="columnUpdateClick(scope.row)">修改</el-button>
          <el-button size="small" @click="removeColumnClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" v-model="state.visible" title="添加外键" :destroy-on-close="false"
      @closed="onClose(formRef)">
      <el-form :model="state.form" :rules="rules" ref="formRef" status-icon label-width="100px">
        <el-form-item label="外键约束名" prop="name">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="字段" prop="foreignKeyFields">
          <el-select v-model="state.form.foreignKeyFields" multiple placeholder=" " style="width: 240px">
            <el-option v-for="item in state.fieldList" :key="item.oid" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="参考模式" prop="referencesSchemaName">
          <el-select v-model="state.form.referencesSchemaName" placeholder=" " style="width: 240px"
            @change="schemaChange">
            <el-option v-for="item in state.schemaList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="参考表" prop="referencesTableName">
          <el-select v-model="state.form.referencesTableName" placeholder=" " style="width: 240px"
            @change="tableChange">
            <el-option v-for="item in state.tableList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="参考字段" prop="referencesFields">
          <el-select v-model="state.form.referencesFields" multiple placeholder=" " style="width: 240px">
            <el-option v-for="item in state.tarFieldList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="删除时">
          <el-select v-model="state.form.deleteStrategy" placeholder=" ">
            <el-option v-for="item in time" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="更新时">
          <el-select v-model="state.form.updateStretegy" placeholder=" ">
            <el-option v-for="item in time" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="注释">
          <el-input v-model="state.form.comment"></el-input>
        </el-form-item>
        <el-form-item label="符合全部">
          <el-switch v-model="state.form.isMatchFull" />
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
import {
  TreeNode,
  FieldList,
  ForeignKeyList,
} from "@/types";
import { getCurrentInstance } from 'vue'
import { findSchema, findTable, findField } from "@/api/treeNode";

const formRef = ref<FormInstance>();
const demo: ForeignKeyList = {
  "@clazz": "com.highgo.developer.model.HgdbForeignKey",
  oid: -new Date().getTime(),
  name: "",

  foreignKeyFields: [],//外键字段，["fl1_id","fl1_id1"]
  referencesSchemaName: '',//参考模式
  referencesTableName: '',//参考表
  referencesFields: [],//参考字段 ["fl1_id","fl1_id1"]
  updateStretegy: '',//删除时
  deleteStrategy: '',//更新时
  comment: '',//注释
  isMatchFull: false,//符合全部
  isDeferrable: false,//可搁置  false-NOT DEFERRABLE true-DEFERRABLE 
  isDeferred: true,//搁置 false-INITIALLY IMMEDIATE  true-INITIALLY DEFERRED
};

interface IState {
  visible: boolean;
  treeData: TreeNode<any>;
  tableData: ForeignKeyList[];
  tableHieght: number;
  form: ForeignKeyList;
  isAdd: boolean; //add or update
  fieldList: FieldList[];

  schemaList: string[];
  tableList: string[];
  tarFieldList: string[];
  isDeferredDisabled: boolean;
}
export default defineComponent({
  name: "foreigntab",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    treeData: Object,
    tableData: Array,
    fieldList: Array,
    saveModal: Function,
    removeRow: Function,
    visableFlag: Function,
  },
  emits: ["visableFlag", "saveModal", "removeRow"],
  setup(props, { emit }) {
    onMounted(() => {
      console.log(state.treeData)
      findSchema(state.treeData!).then((result) => {
        console.log("findSchema result", result);
        state.schemaList = result.data;
      })
    });
    const datab = getCurrentInstance();
    const rules = reactive({
      name: [{ required: true, message: "请输入字段名！", trigger: "blur" }],
      foreignKeyFields: [{ required: true, message: "请选择外键字段！", trigger: "blur" }],
      referencesSchemaName: [{ required: true, message: "请选择参考模式！", trigger: "blur" }],
      referencesTableName: [{ required: true, message: "请选择参考表！", trigger: "blur" }],
      referencesFields: [{ required: true, message: "请选择参考字段！", trigger: "blur" }],
    });


    const { visible, treeData, tableData, fieldList } = toRefs(props);
    const state: IState = reactive({
      visible: visible.value,
      treeData: treeData.value as TreeNode<any>,
      tableData: tableData.value as ForeignKeyList[],
      tableHieght: window.innerHeight - 190, //60header,40tabs,40buttons,40tabheader
      form: {} as ForeignKeyList,
      isAdd: true,

      fieldList: fieldList.value as FieldList[],
      schemaList: [],
      tableList: [],
      tarFieldList: [],
      isDeferredDisabled: true,//禁用搁置
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
    const resetDefer = (row: ForeignKeyList) => {
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
    const columnUpdateClick = (row: ForeignKeyList) => {
      console.log("columnUpdateButtonClick row ", row);
      state.isAdd = false;
      resetFields(row);
      resetDefer(row);
      emit("visableFlag", true);
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
    const schemaChange = (val: string) => {
      console.log('schemaChange state.treeData!.nodePath', state.treeData!.nodePath)
      const index = state.treeData!.nodePath.indexOf('schemaName');
      const str = state.treeData!.nodePath.substring(0, index);
      const nodePath = str + 'schemaName/' + val;
      console.log('nodePath', nodePath)
      const temp = {
        type: "Schema",
        object: null,
        nodePath: nodePath,
        connectionId: state.treeData!.connectionId
      } as TreeNode<any>;
      findTable(temp).then((result) => {
        console.log("findTable result", result);
        state.tableList = result.data;
      })
    }
    const tableChange = (val: string) => {
      console.log('tableChange state.treeData!.nodePath', state.treeData!.nodePath)

      const index = state.treeData!.nodePath.indexOf('tableName');
      let str = state.treeData!.nodePath+'/';
      if (index > -1) {
        str = state.treeData!.nodePath.substring(0, index);
      }
      const nodePath = str + 'tableName/' + val;
      console.log('nodePath', nodePath)

      const temp = {
        type: "Table",
        object: null,
        nodePath: nodePath,
        connectionId: state.treeData!.connectionId
      } as TreeNode<any>;
      findField(temp).then((result) => {
        console.log("findField result", result);
        state.tarFieldList = result.data;
      })
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
      schemaChange,
      tableChange
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
