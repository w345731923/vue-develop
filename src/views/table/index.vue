<template>
  <div class="box">
    <div class="tool-buttons">
      <div class="row-button">
        <el-button size="small" color="#f2f2f2" @click="saveTable">
          <el-icon><Avatar /></el-icon>
          保存
        </el-button>
        <el-button-group v-if="state.tabsActive == 'columns'">
          <el-button
            size="small"
            color="#f2f2f2"
            @click="appendColumnVis(true)"
          >
            <el-icon><Avatar /></el-icon>
            添加字段
          </el-button>
          <el-button size="small" color="#f2f2f2" @click="test1"
            ><el-icon><Avatar /></el-icon>删除字段</el-button
          >
        </el-button-group>
        <el-button-group v-if="state.tabsActive == 'index'">
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>添加索引</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>删除索引</el-button
          >
        </el-button-group>
      </div>
    </div>

    <!-- <img src="../assets/database.png" /> -->
    <div class="query-result">
      <el-tabs
        v-model="state.tabsActive"
        type="card"
        @tab-click="handleTabClick"
      >
        <el-tab-pane label="字段" name="columns" style="margin: 0.5rem">
          <ColumnTab
            :treeData="state.treeData"
            :tableData="state.tableData"
            :columnVisible="state.columnVisible"
            @saveModal="appendColumn"
            @removeColumn="removeColumn"
            @visableFlag="appendColumnVis"
          />
        </el-tab-pane>
        <el-tab-pane label="索引" name="index" style="margin: 0.5rem">
          <div>索引</div>
        </el-tab-pane>
        <el-tab-pane label="外键" name="foreign" style="margin: 0.5rem">
          <div>外键</div>
        </el-tab-pane>
        <el-tab-pane label="唯一键" name="unique" style="margin: 0.5rem">
          <div>唯一键</div>
        </el-tab-pane>
        <el-tab-pane label="检查" name="check" style="margin: 0.5rem">
          <div>检查</div>
        </el-tab-pane>
        <el-tab-pane label="排除" name="exclude" style="margin: 0.5rem">
          <div>排除</div>
        </el-tab-pane>
        <el-tab-pane label="规则" name="role" style="margin: 0.5rem">
          <div>规则</div>
        </el-tab-pane>
        <el-tab-pane label="触发器" name="trigger" style="margin: 0.5rem">
          <div>触发器</div>
        </el-tab-pane>
        <el-tab-pane label="选项" name="options" style="margin: 0.5rem">
          <div>选项</div>
        </el-tab-pane>
        <el-tab-pane label="注释" name="comment" style="margin: 0.5rem">
          <div>注释</div>
        </el-tab-pane>
        <el-tab-pane label="SQL预览" name="sqlview" style="margin: 0.5rem">
          <p style="margin: 0.3rem">> SQL:select now()</p>
          <p style="margin: 0.3rem">> SUCCESS:OK</p>
          <p style="margin: 0.3rem">> TIME:148ms</p>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <template v-if="state.nameVisible">
    <TableNameDialog
      :visible="state.nameVisible"
      @saveModal="tableNameSubmit"
      @closeModal="state.nameVisible = false"
    />
  </template>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch, onMounted } from "vue";
import TableNameDialog from "./tableName.vue";
import { getDataType, getCollation } from "@/api/treeNode";

import { ElMessage } from "element-plus";
import { tableAdd, tableEdit } from "@/api/treeNode";
import { Avatar } from "@element-plus/icons-vue";
import ColumnTab from "@/components/table/columnTab.vue";
import { TabsPaneContext } from "element-plus";
import {
  ResponseData,
  TreeNode,
  TableEditForm,
  FieldList,
  TableDesignModel,
} from "@/types";
interface IState {
  tabId: string;
  tabsActive: string | number;
  oldObject: string;
  oldObjectField: string;
  tableData: FieldList[];
  columnVisible: boolean;
  treeData: TreeNode<TableDesignModel> | undefined;
  nameVisible: boolean;
  isAdd: boolean; //新增还是修改
}
export default defineComponent({
  name: "table-design",
  components: {
    Avatar,
    ColumnTab,
    TableNameDialog,
  },
  props: {
    modifyTitle: Function,
  },
  emits: ["modifyTitle"],
  setup(props, { emit }) {
    onMounted(() => {
      console.log("table-design onMounted...");
      state.tabId = sessionStorage.getItem("tabId") as string;

      let createSession = sessionStorage.getItem("create-table-session");
      if (createSession) {
        //新建表
        state.treeData = JSON.parse(createSession!) as TreeNode<any>;
        console.log("create-table createSession treeData = ", state.treeData);
        sessionStorage.setItem("create-table-session", "");
      }
      const designSession = sessionStorage.getItem("table-design-session");
      if (designSession) {
        //设计表
        const data = JSON.parse(designSession!) as TreeNode<any>;
        console.log("table-design designSession data = ", data);
        sessionStorage.setItem("table-design-session", "");
        refreshTableDesign(data, data.connectionId!, data.nodePath);
      }
    });
    const state: IState = reactive({
      tabId: "",
      tabsActive: "columns",
      isAdd: true, //新增还是修改
      oldObject: "", //修改时用的oldObject
      oldObjectField: "", //修改时用的FieldList
      treeData: undefined, //树形菜单值
      nameVisible: false, //输入表名称

      tableData: [], //字段列表--fieldList
      columnVisible: false, //添加字段
    });

    const handleTabClick = (pane: TabsPaneContext, ev: Event) => {
      state.tabsActive = pane.props.name;
    };

    const tableNameSubmit = (form: { name: string }) => {
      //对象复制
      let target = {} as TreeNode<TableDesignModel>;
      Object.assign(target, state.treeData);

      const data: TableDesignModel = {
        "@clazz": "com.highgo.developer.model.HgdbTable",
        fieldList: state.tableData,
        name: form.name,
        comment: "",
      };
      target.type = "Table";
      target.object = data;

      tableAdd(target).then((resp) => {
        console.log("tableAdd resp", resp);
        state.nameVisible = false;
        ElMessage({
          message: "保存成功！",
          type: "success",
        });
        //刷新设计表数据
        refreshTableDesign(resp.data, target.connectionId!, target.nodePath);
        const names = target.nodePath.split("/");
        emit(
          "modifyTitle",
          state.tabId,
          form.name + "@" + names[7] + "." + names[5]
        );
      });
    };

    //刷新设计表数据
    const refreshTableDesign = (
      resp: TreeNode<TableDesignModel>,
      connectionId: string,
      nodePath: string
    ) => {
      state.isAdd = false;
      resp.nodePath = nodePath;
      resp.connectionId = connectionId;
      //给表格授权RESPONSE值
      state.tableData = resp.object.fieldList;
      //保存old数据，用于修改
      state.oldObjectField = JSON.stringify(resp.object.fieldList);
      //清空无用字段，最小化保存字符串
      resp.object.fieldList = [];
      resp.object.childrenModel = [];
      state.oldObject = JSON.stringify(resp);
      //刷新设计表动态数据
      state.treeData = resp;
    };
    /**
     * 保存表
     */
    const saveTable = () => {
      if (state.isAdd) {
        //新增表，输入表名称
        state.nameVisible = true;
      } else {
        //newObject

        state.treeData!.object.fieldList = state.tableData;
        //oldObject
        const oldData = JSON.parse(
          state.oldObject
        ) as TreeNode<TableDesignModel>;
        oldData.object.fieldList = JSON.parse(state.oldObjectField);
        const data: TableEditForm = {
          newObject: state.treeData!,
          oldObject: oldData,
        };
        tableEdit(data).then((resp) => {
          ElMessage({
            message: "保存成功！",
            type: "success",
          });
          if (resp.data) {
            refreshTableDesign(
              resp.data,
              state.treeData!.connectionId!,
              state.treeData!.nodePath!
            );
          }
        });
      }
    };
    //===============字段========================
    const appendColumnVis = (flag: boolean) => {
      state.columnVisible = flag;
    };
    const appendColumn = (form: FieldList) => {
      console.log("appendColumnSubmit form", form);
      //校验重名
      const nIndex = state.tableData.findIndex(
        (item) => item.name === form.name
      );
      //判断新增还是修改
      const index = state.tableData.findIndex((item) => item.oid === form.oid);
      if (nIndex > -1 && nIndex != index) {
        //重名，且不是self，报错
        ElMessage({
          message: "列名称不能相同",
          type: "error",
          duration: 5 * 1000,
        });
        return;
      }

      if (index > -1) {
        const item = state.tableData[index];
        state.tableData.splice(index, 1, {
          ...item,
          ...form,
        });
      } else {
        state.tableData.push(form);
      }
      appendColumnVis(false);
    };
    const removeColumn = (form: FieldList) => {
      const index = state.tableData.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        state.tableData.splice(index, 1);
      }
      console.log("removeColumn state.tableData", state.tableData);
    };
    const test1 = () => {
      console.log("test1 state", state);
      getDataType(state.treeData!).then((responseData) => {
        console.log("getDataType ResponseData", responseData);
        responseData.data.forEach((item, index) => {
          const demo: FieldList = {
            "@clazz": "com.highgo.developer.model.HgdbField",
            oid: -new Date().getTime() - index,
            name: "a" + index,
            dataType: { name: item.formatName, length: 0, decimalNumber: 0 },
            isNotNull: false,
            isPrimaryKey: false,
            comment: "",
            defaultValue: "", //默认
            collationSpaceName: "", //规则1-1
            collationName: "", //规则1-2
          };
          state.tableData.push(demo);
        });
      });
    };
    return {
      state,
      handleTabClick,
      appendColumnVis,
      appendColumn,
      removeColumn,
      saveTable,
      tableNameSubmit,
      test1,
    };
  },
  data() {
    return {};
  },
});
</script>

<style scoped>
.box {
  margin: 0;
  padding: 0;
  width: 100%;
}
.tool-buttons {
  padding: 4px 4px 8px 4px;
  background-color: #f2f2f2;
}
</style>
