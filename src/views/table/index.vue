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
          <el-button size="small" color="#f2f2f2" @click="removeColumn(true)"
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
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch, ref } from "vue";
import { ElMessage } from "element-plus";

import { Avatar } from "@element-plus/icons-vue";
import ColumnTab from "@/components/table/columnTab.vue";
import { TabsPaneContext } from "element-plus";
import { TableDesignModel, FieldList } from "@/types";

interface IState {
  tabsActive: string | number;
  tableData: FieldList[];
  columnVisible: boolean;
}
export default defineComponent({
  name: "table-design",
  components: {
    Avatar,
    ColumnTab,
  },
  emits: [],
  setup(props, { emit }) {
    const state: IState = reactive({
      tabsActive: "columns",
      tableData: [],
      columnVisible: false,
    });

    const handleTabClick = (pane: TabsPaneContext, ev: Event) => {
      state.tabsActive = pane.props.name;
    };
    /**
     * 保存表
     */
    const saveTable = () => {
      const data: TableDesignModel = {
        "@clazz": "com.highgo.developer.model.HgdbTable",
        fieldList: state.tableData,
        name: "c12",
        comment: "",
      };
      console.log("saveTable data", data);
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
      const index = state.tableData.findIndex((item) => item.id === form.id);
      if (nIndex > -1 && nIndex != index) {
        //重名，且不是self，报错
        ElMessage({
          message: "表名称不能相同",
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
      const index = state.tableData.findIndex((item) => item.id === form.id);
      if (index > -1) {
        state.tableData.splice(index, 1);
      }
      console.log("removeColumn state.tableData", state.tableData);
    };

    return {
      state,
      handleTabClick,
      appendColumnVis,
      appendColumn,
      removeColumn,
      saveTable,
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
