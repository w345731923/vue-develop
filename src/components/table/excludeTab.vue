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
      <el-table-column prop="indexType" label="索引方法" align="center" />
      <el-table-column prop="a" label="元素" align="center" :formatter="formatter" />
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
        <el-form-item label="元素" prop="elements">
          <el-col class="text-center" :span="11">
            <el-input v-model="state.form.elements"></el-input>
          </el-col>
          <el-col class="text-center" :span="2">
            <el-button size="small" color="#f2f2f2" @click="openElementsTable">
              <el-icon>
                <Avatar />
              </el-icon>
            </el-button>
          </el-col>
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

    <el-dialog :close-on-click-modal="false" v-model="state.elementTableVis" title="元素" :destroy-on-close="false"
      width="1000px" @closed="closeElementsTable">
      <el-space :size="20">
        <el-button type="primary" round @click="openElementFrom">添加</el-button>
        <el-button type="success" round @click="saveElementTable">保存</el-button>
      </el-space>
      <el-table :data="state.elementTable" border :highlight-current-row="true" style="width: 100%" :height="350"
        size="small">
        <el-table-column prop="elementName" label="字段" align="center" />
        <el-table-column prop="opsTypeSchema" label="运算符类别模式" align="center" />
        <el-table-column prop="opsType" label="运算符类别" align="center" />
        <el-table-column prop="sortType" label="排序" align="center" width="100" />
        <el-table-column prop="sortNull" label="nulls排序" align="center" width="120" />
        <el-table-column prop="opsSchema" label="运算符模式" align="center" />
        <el-table-column prop="ops" label="运算符" align="center" width="70" />
        <el-table-column prop="operate" label="操作" align="center" width="150">
          <template #default="scope">
            <el-button size="small" @click="elementUpdateClick(scope.row)">修改</el-button>
            <el-button size="small" @click="elementRemoveClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" v-model="state.elementFormVis" title="添加排除" :destroy-on-close="false"
      @closed="closeElementFrom">
      <el-form :model="state.elementForm" :rules="elementRules" ref="eleFormRef" status-icon label-width="130px">
        <el-form-item label="字段" prop="elementName">
          <el-select v-model="state.elementForm.elementName" placeholder=" ">
            <el-option v-for="item in state.fieldList" :key="item.oid" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="运算符类别模式" prop="opsTypeSchema">
          <el-select v-model="state.elementForm.opsTypeSchema" placeholder=" " @change="opsTypeSchemaChange">
            <el-option key="" label="" value="" />
            <el-option v-for="item in state.opsTypeSchemaList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="运算符类别" prop="opsType">
          <el-select v-model="state.elementForm.opsType" placeholder=" ">
            <el-option v-for="item in state.opsTypeList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sortType">
          <el-select v-model="state.elementForm.sortType" placeholder=" ">
            <el-option key="ASC" label="ASC" value="ASC" />
            <el-option key="DESC" label="DESC" value="DESC" />
          </el-select>
        </el-form-item>
        <el-form-item label="Nulls排序" prop="sortNull">
          <el-select v-model="state.elementForm.sortNull" placeholder=" ">
            <el-option key="NULL FIRST" label="NULL FIRST" value="NULL FIRST" />
            <el-option key="NULL LAST" label="NULL LAST" value="NULL LAST" />
          </el-select>
        </el-form-item>
        <el-form-item label="运算符模式" prop="opsSchema">
          <el-select v-model="state.elementForm.opsSchema" placeholder=" " @change="opsSchemaChange">
            <el-option key="" label="" value="" />
            <el-option v-for="item in state.opsTypeSchemaList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="运算符" prop="ops">
          <el-select v-model="state.elementForm.ops" placeholder=" ">
            <el-option v-for="item in state.opsList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="closeElementFrom(eleFormRef)">取消</el-button>
        <el-button type="primary" @click="elementSubmitForm(eleFormRef)">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch, ref, onMounted } from "vue";
import type { FormInstance } from "element-plus";
import { getCurrentInstance } from 'vue'
import { findIndexTypeToOpClassSchema, findOpClassName, findSchemaToOperatorMap } from "@/api/treeNode";
import { Avatar } from "@element-plus/icons-vue";

import {
  TreeNode, FieldList,
  ExcludeConstraintList, ExcludeConstraintElements
} from "@/types";
const formRef = ref<FormInstance>();
const eleFormRef = ref<FormInstance>();

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
const elementTemp: ExcludeConstraintElements = {
  "@clazz": "com.highgo.developer.model.HgdbExcludeConstraintElement",
  elementName: "",
  opsTypeSchema: "",
  opsType: "",
  sortType: "",
  sortNull: "",
  opsSchema: "",
  ops: "",
};

interface IState {
  visible: boolean;
  treeData: TreeNode<any>;
  tableData: ExcludeConstraintList[];
  tableHieght: number;
  form: ExcludeConstraintList;
  isAdd: boolean; //add or update
  tableSpaceList: string[];
  fieldList: FieldList[];

  isDeferredDisabled: boolean;//搁置启用

  elementTable: ExcludeConstraintElements[];//显示排除row.excludeConstraintElements字段转成table
  elementTableVis: boolean,//元素表格弹窗
  elementFormVis: boolean,//元素表格添加行弹窗
  elementForm: ExcludeConstraintElements,//元素的row
  opsTypeSchemaMap: Map<string, string>;//运算符类别模式
  opsTypeSchemaList: string[];
  opsTypeMap: Map<string, string>;//运算符类别
  opsTypeList: string[];
  opsMap: Map<string, string>;//运算符
  opsList: string[];
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
  components: {
    Avatar
  },
  emits: ["visableFlag", "saveModal", "removeRow"],
  setup(props, { emit }) {
    onMounted(() => {
      findIndexTypeToOpClassSchema(state.treeData).then((responseData) => {
        console.log('findIndexTypeToOpClassSchema responseData ', responseData)
        state.opsTypeSchemaMap = responseData.data;
      });
      findOpClassName(state.treeData).then((responseData) => {
        console.log('findOpClassName responseData ', responseData)
        state.opsTypeMap = responseData.data;
      });
      findSchemaToOperatorMap(state.treeData).then((responseData) => {
        console.log('findSchemaToOperatorMap responseData ', responseData)
        state.opsMap = responseData.data;
      });
    });
    const datab = getCurrentInstance();

    const rules = reactive({
      name: [{ required: true, message: "请输入排除约束名称！", trigger: "blur" }],
      indexType: [{ required: true, message: "请选择索引方法！", trigger: "blur" }],
    });
    const elementRules = reactive({
      elementName: [{ required: true, message: "请选择字段！", trigger: "blur" }],
      opsTypeSchema: [{ required: true, message: "请选运算符类别模式！", trigger: "blur" }],
      opsType: [{ required: true, message: "请选运算符类别！", trigger: "blur" }],
      opsSchema: [{ required: true, message: "请选运算符模式！", trigger: "blur" }],
      ops: [{ required: true, message: "请选运算符！", trigger: "blur" }]
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
      fieldList: fieldList.value as FieldList[],

      isDeferredDisabled: false,

      elementTable: [],
      elementTableVis: false,//元素表格弹窗
      elementFormVis: false,//元素表格添加行弹窗
      elementForm: {} as ExcludeConstraintElements,
      opsTypeSchemaMap: new Map(),//索引，模式
      opsTypeSchemaList: [],
      opsTypeMap: new Map(),//模式，类别
      opsTypeList: [],
      opsMap: new Map(),//模式，运算符
      opsList: [],
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
        console.log('tableData', tableData)
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
    watch(
      fieldList,
      (newValue) => {
        state.fieldList = newValue as FieldList[];
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
      state.form.elements = formatter(row);
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
    //搁置下拉事件
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
    const formatter = (row: ExcludeConstraintList) => {
      return elementConvertString(row.excludeConstraintElements)
    }
    //打开元素table窗口
    const openElementsTable = () => {
      state.elementTableVis = true;
      state.elementTable = []
      state.opsTypeSchemaList = [];
      state.opsTypeList = [];
      state.opsList = [];

      //给新的table传值，给模式传值
      state.form.excludeConstraintElements.forEach((item, index) => {
        state.elementTable.push({ id: index, ...item });
      })
      state.opsTypeSchemaList = state.opsTypeSchemaMap[state.form.indexType] as string[];
      console.log('openElementsTable state ', state)
    }
    //关闭元素table窗口
    const closeElementsTable = () => {
      state.elementTableVis = false;
    }
    //保存元素table，并关闭窗口
    const saveElementTable = () => {
      state.form.elements = elementConvertString(state.elementTable)
      state.form.excludeConstraintElements = [];
      //保存最新的table去form
      state.elementTable.forEach(item => {
        state.form.excludeConstraintElements.push(item)
      })
      state.elementTableVis = false;
      console.log('state ', state)
    }
    //打开新建元素窗口
    const openElementFrom = () => {
      state.elementFormVis = true;
      //清空表单内历史数据
      Object.assign(state.elementForm, elementTemp);
      state.elementForm.id = new Date().getTime();
    }
    //关闭新建元素窗口
    const closeElementFrom = (formEl: FormInstance | undefined) => {
      state.elementFormVis = false;
      formEl?.resetFields()
    };
    //运算符类别模式下拉事件，得到运算符类别
    const opsTypeSchemaChange = (val: string) => {
      console.log('opsTypeSchemaChange val', val, state.opsTypeMap)
      if ('' == val) {
        state.opsTypeList = []
        state.elementForm.opsType = '';
      } else {
        state.opsTypeList = state.opsTypeMap[val] as string[];
      }
    }
    //运算符模式下拉事件,得到运算符
    const opsSchemaChange = (val: string) => {
      console.log('opsTypeSchemaChange val', val, state.opsTypeMap)
      if ('' == val) {
        state.opsList = []
        state.elementForm.ops = '';
      } else {
        state.opsList = state.opsMap[val] as string[];
      }
    }

    //element列表转成字符串
    const elementConvertString = (data: ExcludeConstraintElements[]) => {
      const list = data.map(element => {
        return element.elementName + ' ' + element.opsTypeSchema + '.' + element.opsType + ' WITH ' + element.opsSchema + '.' + element.ops
      });
      return list.join(',')
    }
    //元素表格点击修改按钮
    const elementUpdateClick = (row: ExcludeConstraintElements) => {
      console.log("elementUpdateClick row ", row);
      state.elementFormVis = true;
      state.elementForm = row;
    };
    //元素表格点击删除按钮
    const elementRemoveClick = (row: ExcludeConstraintElements) => {
      console.log("elementRemoveClick row ", row);
      const index = state.elementTable.findIndex(item => item.id == row.id);
      state.elementTable.splice(index, 1);
    };
    //新建元素弹窗保存
    const elementSubmitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          console.log('elementSubmitForm', state.elementForm)
          const index = state.elementTable.findIndex((item) => item.id === state.elementForm.id);
          if (index > -1) {
            //修改
            const item = state.elementTable[index];
            state.elementTable.splice(index, 1, {
              ...item,
              ...state.elementForm,
            });
          } else {
            //新增
            state.elementTable.push(state.elementForm)
          }
          state.elementFormVis = false;
          console.log('elementSubmitForm state',state)
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
      isDeferrableChange,
      openElementsTable,
      closeElementsTable,

      openElementFrom,
      closeElementFrom,
      saveElementTable,
      formatter,

      eleFormRef,
      elementRules,
      elementSubmitForm,
      elementUpdateClick,
      elementRemoveClick,

      opsTypeSchemaChange,
      opsSchemaChange
    };
  },

  data() {
    return {
      indexType: ['B-Tree', 'Hash', 'GiST', 'GIN', 'SP-GiST', 'BRIN'],
      buffer: ['ON', 'OFF', 'AUTO'],
      a1: ['DEFERRABLE', 'NOT DEFERRABLE'],
      a2: ['INITIALLY IMMEDIATE', 'INITIALLY DEFERRED'],

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
