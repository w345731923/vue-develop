<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table :data="state.tableData" border :highlight-current-row="true" size="small" style="width: 100%"
      :max-height="state.tableHieght">
      <el-table-column prop="name" label="唯一键约束名" align="center" />
      <el-table-column prop="includeFieldNames" label="字段" align="center" />
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
        <el-form-item label="唯一约束名" prop="name">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="字段" prop="includeFieldNames">
          <el-select v-model="state.form.includeFieldNames" multiple placeholder=" " style="width: 240px">
            <el-option v-for="item in state.fieldList" :key="item.oid" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="注释">
          <el-input v-model="state.form.comment"></el-input>
        </el-form-item>
        <el-form-item label="表空间" prop="tablespaceName">
          <el-select v-model="state.form.tableSpaceName" placeholder=" ">
            <el-option v-for="item in state.tableSpaceList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="填充系数(%)" prop="fillFactor">
          <el-input-number v-model="state.form.fillFactor" />
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
import type { FormInstance, TabsPaneContext } from "element-plus";
import {
  TreeNode,
  FieldList,
  UniqueConstraintList,
} from "@/types";
import { getCurrentInstance } from 'vue'

const formRef = ref<FormInstance>();
const demo: UniqueConstraintList = {
  "@clazz": "com.highgo.developer.model.HgdbUniqueConstraint",
  oid: -new Date().getTime(),
  name: '',//唯一键约束名 "index_a2_t1"
  includeFieldNames: [],//字段["fl1_id"]
  comment: '',//注释
  tableSpaceName: '',//表空间
  fillFactor: -1,//填充系数 -1
  isDeferrable: false,//可搁置
  isDeferred: false,//搁置  
};

interface IState {
  visible: boolean;
  treeData: TreeNode<any>;
  tableData: UniqueConstraintList[];
  tableHieght: number;
  form: UniqueConstraintList;
  isAdd: boolean; //add or update
  tableSpaceList: string[];
  fieldList: FieldList[];

  isDeferredDisabled: boolean;
}
export default defineComponent({
  name: "uniquetab",
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
    const datab = getCurrentInstance();
    const rules = reactive({
      name: [{ required: true, message: "请输入字段名！", trigger: "blur" }],
      includeFieldNames: [{ required: true, message: "请选择字段！", trigger: "blur" }],
    });

    const { visible, treeData, tableData, tableSpaceList, fieldList } = toRefs(props);
    const state: IState = reactive({
      visible: visible.value,
      treeData: treeData.value as TreeNode<any>,
      tableData: tableData.value as UniqueConstraintList[],
      tableHieght: window.innerHeight - 190, //60header,40tabs,40buttons,40tabheader
      form: {} as UniqueConstraintList,
      dataTypeList: [],
      isAdd: true,
      tableSpaceList: tableSpaceList.value as string[],
      fieldList: fieldList.value as FieldList[],

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
        state.tableData = newValue as UniqueConstraintList[];
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
    const createVal = (src: UniqueConstraintList) => {
      const target = {} as UniqueConstraintList;
      Object.assign(target, src);
      return target;
    };
    //重置row初始值
    const resetFields = (resetVal: UniqueConstraintList) => {
      Object.assign(state.form, resetVal);
    };
    //修改按钮
    const columnUpdateClick = (row: UniqueConstraintList) => {
      console.log("columnUpdateButtonClick row ", row);
      state.isAdd = false;
      resetFields(row);
      resetDefer(row);
      emit("visableFlag", true);
    };

    //删除按钮
    const removeColumnClick = (row: UniqueConstraintList) => {
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
    const resetDefer = (row: UniqueConstraintList) => {
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
      isDeferrableChange
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
