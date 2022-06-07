<template>
  <div class="column-table-edit">
    <!--https://element-plus.gitee.io/zh-CN/component/table.html#table
    stripe：是否为斑马纹 table
    highlight-current-row：高亮当前行
    empty-text：空数据时显示的文本内容， 也可以通过 #empty 设置
    -->
    <el-table :data="state.tableData" border :highlight-current-row="true" size="small" style="width: 100%"
      :max-height="state.tableHieght">
      <el-table-column prop="name" label="触发器列名" align="center" />
      <el-table-column prop="forEach" label="给每个" align="center" width="75"/>
      <el-table-column prop="fireTime" label="触发" align="center" width="75"/>
      <el-table-column prop="triggerEvents1" label="插入" align="center" width="60">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.triggerEvents.indexOf('INSERT') > -1" :checked="true" />
          <el-checkbox disabled v-if="scope.row.triggerEvents.indexOf('INSERT') == -1" />
        </template>
      </el-table-column>
      <el-table-column prop="triggerEvents2" label="更新" align="center" width="60">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.triggerEvents.indexOf('UPDATE') > -1" :checked="true" />
          <el-checkbox disabled v-if="scope.row.triggerEvents.indexOf('UPDATE') == -1" />
        </template>
      </el-table-column>
      <el-table-column prop="triggerEvents3" label="删除" align="center" width="60">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.triggerEvents.indexOf('DELETE') > -1" :checked="true" />
          <el-checkbox disabled v-if="scope.row.triggerEvents.indexOf('DELETE') == -1" />
        </template>
      </el-table-column>
      <el-table-column prop="triggerEvents4" label="截断" align="center" width="60">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.triggerEvents.indexOf('TRUNCATE') > -1" :checked="true" />
          <el-checkbox disabled v-if="scope.row.triggerEvents.indexOf('TRUNCATE') == -1" />
        </template>
      </el-table-column>                  
      <el-table-column prop="updateColumns" label="更新字段" align="center" />
      <el-table-column prop="isEnabled" label="启用" align="center">
        <template #default="scope">
          <el-checkbox disabled v-if="scope.row.isEnabled == true" :checked="true" />
          <el-checkbox disabled v-if="scope.row.isEnabled != true" />
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

    <el-dialog :close-on-click-modal="false" v-model="state.visible" title="添加触发器" :destroy-on-close="false"
      @closed="onClose(formRef)">
      <el-form :model="state.form" :rules="rules" ref="formRef" status-icon label-width="100px">
        <el-form-item label="触发器名" prop="name">
          <el-input v-model="state.form.name"></el-input>
        </el-form-item>
        <el-form-item label="给每个" prop="forEach">
          <el-select v-model="state.form.forEach" placeholder=" " style="width: 200px" @change="eachChange">
            <el-option key="ROW" label="ROW" value="ROW" />
            <el-option key="STATEMENT" label="STATEMENT" value="STATEMENT" />
          </el-select>
        </el-form-item>
        <el-form-item label="触发" prop="fireTime">
          <el-select v-model="state.form.fireTime" placeholder=" " style="width: 200px" @change="fireTimeChange">
            <el-option key="AFTER" label="AFTER" value="AFTER" />
            <el-option key="BEFORE" label="BEFORE" value="BEFORE" />
          </el-select>
        </el-form-item>
        <el-form-item label="更新字段" prop="updateColumns">
          <el-select v-model="state.form.updateColumns" multiple placeholder=" " style="width: 240px">
            <el-option v-for="item in state.fieldList" :key="item.oid" :label="item.name" :value="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label=" ">
          <el-checkbox-group v-model="state.form.triggerEvents">
            <el-checkbox label="插入" />
            <el-checkbox label="更新" />
            <el-checkbox label="删除" />
            <el-checkbox label="截断" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="state.form.isEnabled" />
        </el-form-item>
        <el-form-item label="注释">
          <el-input v-model="state.form.comment"></el-input>
        </el-form-item>
        <el-form-item label="当">
          <el-input v-model="state.form.condition"></el-input>
        </el-form-item>
        <el-form-item label="触发函数">
          <el-select v-model="state.form.functionSchema" placeholder=" " @change="triggerFunChange">
            <el-option v-for="item in state.func1" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-select v-model="state.form.functionName" placeholder=" ">
            <el-option v-for="item in state.func2" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="引数">
          <el-input v-model="state.form.functionParams"></el-input>
        </el-form-item>
        <el-form-item label="约束">
          <el-switch v-model="state.form.hasConstraint" @change="constraintChange" :disabled="state.forEachDisabled" />
        </el-form-item>
        <el-form-item label="可搁置">
          <el-select v-model="state.form.isDeferrableTemp" placeholder=" " @change="isDeferrableChange"
            :disabled="state.constraintDisabled">
            <el-option v-for="item in a1" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="搁置">
          <el-select v-model="state.form.isDeferredTemp" placeholder=" " :disabled="state.isDeferredDisabled">
            <el-option v-for="item in a2" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="参考表">
          <el-select v-model="state.form.referencedTableSchema" placeholder=" " @change="tableChange"
            :disabled="state.constraintDisabled">
            <el-option v-for="item in state.table1" :key="item" :label="item" :value="item">
            </el-option>
          </el-select>
          <el-select v-model="state.form.referencedTable" placeholder=" " :disabled="state.constraintDisabled">
            <el-option v-for="item in state.table2" :key="item" :label="item" :value="item">
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
import type { FormInstance } from "element-plus";
import { getCurrentInstance } from 'vue'
import { findTriggerFunctionMap, findReferTableMap } from "@/api/treeNode";

import {
  TreeNode,
  FieldList,
  TriggerList,
} from "@/types";
const formRef = ref<FormInstance>();
const demo: TriggerList = {
  "@clazz": "com.highgo.developer.model.HgdbTrigger",
  oid: -new Date().getTime(),
  name: "",
  forEach: "",//给每个 "ROW"
  fireTime: '',//触发 "AFTER"
  triggerEvents: [],
  updateColumns: [],//["fl1_id,id"]
  isEnabled: true,//启用
  comment: "",//注释
  condition: "",//当
  functionSchema: "",//触发函数1 "pg_catalog"
  functionName: "",//触发函数2 RI_FKey_check_ins
  functionParams: "",//引数
  hasConstraint: false,//约束
  isDeferrable: false,//可搁置
  isDeferred: true,//搁置
  referencedTableSchema: "",//参考表1
  referencedTable: "",//参考表2

};

interface IState {
  visible: boolean;
  treeData: TreeNode<any>;
  tableData: TriggerList[];
  tableHieght: number;
  form: TriggerList;
  isAdd: boolean; //add or update
  tableSpaceList: string[];
  fieldList: FieldList[];

  forEachDisabled: boolean;//禁用约束组件
  constraintDisabled: boolean;//禁用约束子组件
  funcMap: Map<string, string>;
  func1: string[];//触发函数1列表
  func2: string[];//触发函数2列表
  tableMap: Map<string, string>;
  table1: string[];//参考表1列表
  table2: string[];//参考表2列表
  isDeferredDisabled: boolean;//搁置启用
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
      findTriggerFunctionMap(state.treeData).then((responseData) => {
        console.log("findTriggerFunctionMap ResponseData", responseData);
        state.funcMap = responseData.data;
        const map = new Map(Object.entries(responseData.data));
        for (let [key, value] of map) {
          state.func1.push(key);
        }
      });
      findReferTableMap(state.treeData).then((responseData) => {
        console.log("findReferTableMap ResponseData", responseData);
        state.tableMap = responseData.data;
        const map = new Map(Object.entries(responseData.data));
        for (let [key, value] of map) {
          state.table1.push(key);
        }
      });

    });
    const datab = getCurrentInstance();

    const rules = reactive({
      name: [{ required: true, message: "请输入触发器名称！", trigger: "blur" }],
      forEach: [{ required: true, message: "请选择给每个！", trigger: "blur" }],
      fireTime: [{ required: true, message: "请选择触发！", trigger: "blur" }],
    });
    const { visible, treeData, tableData, tableSpaceList, fieldList } = toRefs(props);
    const state: IState = reactive({
      visible: visible.value,
      treeData: treeData.value as TreeNode<any>,
      tableData: tableData.value as TriggerList[],
      tableHieght: window.innerHeight - 190, //60header,40tabs,40buttons,40tabheader
      form: {} as TriggerList,
      isAdd: true,
      tableSpaceList: tableSpaceList.value as string[],
      fieldList: fieldList.value as FieldList[],

      forEachDisabled: false,
      constraintDisabled: true,
      funcMap: new Map(),
      func1: [],
      func2: [],
      tableMap: new Map(),
      table1: [],
      table2: [],
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
        state.tableData = newValue as TriggerList[];
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
    const createVal = (src: TriggerList) => {
      const target = {} as TriggerList;
      Object.assign(target, src);
      return target;
    };
    //重置row初始值
    const resetFields = (resetVal: TriggerList) => {
      Object.assign(state.form, resetVal);
    };
    const resetDefer = (row: TriggerList) => {
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
    const columnUpdateClick = (row: TriggerList) => {
      console.log("columnUpdateButtonClick row ", row);
      state.isAdd = false;
      resetFields(row);
      resetDefer(row);
      state.form.triggerEvents = convertToChina(row.triggerEvents);
      emit("visableFlag", true);
    };

    //删除按钮
    const removeColumnClick = (row: TriggerList) => {
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
          data.triggerEvents = convertToEnglish(data.triggerEvents);
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
    //约束滑块事件
    const constraintChange = (val: boolean) => {
      //true 开启，和constraintDisabled正好相反
      state.constraintDisabled = !val;
      if (!val) {
        //禁用组件
        state.isDeferredDisabled = true;
      } else {
        const a1 = datab!.data.a1 as string[];
        if (a1[0] == state.form.isDeferrableTemp) {
          //DEFERRABLE 启用
          state.isDeferredDisabled = false;
        } else {
          //NOT DEFERRABLE 禁用
          state.isDeferredDisabled = true;
        }
      }
    };

    //触发函数下拉框事件
    const triggerFunChange = (val: string) => {
      console.log("triggerFunChange val ", val,);
      state.func2 = [];
      state.func2 = state.funcMap[val] as string[];
    };
    //参考表下拉框事件
    const tableChange = (val: string) => {
      console.log("tableChange val ", val,);
      state.table2 = [];
      state.table2 = state.tableMap[val] as string[];
    };
    //<给每个>下拉事件
    const eachChange = (val: string) => {
      activeConstraint()
    };
    //<触发>下拉事件
    const fireTimeChange = (val: string) => {
      activeConstraint()
    };
    const convertToEnglish = (val: string[]) => {
      let data: string[] = [];
      val.forEach(element => {
        if (element == '插入') {
          data.push('INSERT')
        } else if (element == '更新') {
          data.push('UPDATE')
        } else if (element == '删除') {
          data.push('DELETE')
        } else if (element == '截断') {
          data.push('TRUNCATE')
        }
      });
      return data;
    }
    const convertToChina = (val: string[]) => {
      let data: string[] = [];
      val.forEach(element => {
        if (element == 'INSERT') {
          data.push('插入')
        } else if (element == 'UPDATE') {
          data.push('更新')
        } else if (element == 'DELETE') {
          data.push('删除')
        } else if (element == 'TRUNCATE') {
          data.push('截断')
        }
      });
      return data;
    }
    const activeConstraint = () => {
      // if (state.form.forEach == 'ROW' && state.form.fireTime == 'AFTER') {
      //   state.forEachDisabled = false;
      // } else {
      //   state.forEachDisabled = false;
      // }
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
      constraintChange,
      triggerFunChange,
      tableChange,
      eachChange, fireTimeChange, activeConstraint
    };
  },

  data() {
    return {
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
