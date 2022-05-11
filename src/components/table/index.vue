<template>
  <div class="box">
    <div class="tool-buttons">
      <div class="row-button">
        <el-button size="small" color="#f2f2f2">
          <el-icon><Avatar /></el-icon>
          保存
        </el-button>
        <el-button-group v-if="state.tabsActive == 'columns'">
          <el-button size="small" color="#f2f2f2" @click="appendColumn">
            <el-icon><Avatar /></el-icon>
            添加字段
          </el-button>
          <el-button size="small" color="#f2f2f2"
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
          <ColumnTab :tableData="state.tableData" />
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

    <!-- <el-dialog :close-on-click-modal=false v-model="dialogFormVisible" title="添加字段" :destroy-on-close=true>
      <el-form v-model="form" size="mini">
        <el-form-item label="字段" :label-width="formLabelWidth">
          <el-input v-model="form.column" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" :label-width="formLabelWidth">
          <el-select v-model="form.type" filterable placeholder="Select">
            <el-option
                v-for="item in dataTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="长度" :label-width="formLabelWidth">
          <el-input-number v-model="form.length" :min="0" />
        </el-form-item>
        <el-form-item label="小数点" :label-width="formLabelWidth">
          <el-input-number v-model="form.point" :min="0" />
        </el-form-item>
        <el-form-item label="不是null" :label-width="formLabelWidth">
          <el-switch v-model="form.notnull" />
        </el-form-item>
        <el-form-item label="主键" :label-width="formLabelWidth">
          <el-switch v-model="form.primary" />
        </el-form-item>
        <el-form-item label="注释" :label-width="formLabelWidth">
          <el-input v-model="form.comment" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" size="small" @click="addColumnForm">保存</el-button>
      </template>
    </el-dialog> -->
  </div>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch, ref } from "vue";

import { Avatar } from "@element-plus/icons-vue";
import ColumnTab from "./columnTab.vue";
import { TabsPaneContext } from "element-plus";

interface rowTemp {
  length: number;
  point: number;
  notnull: boolean;
  primary: boolean;
}
interface Iprops {
  tabsActive: string | number;
  rowTemp: rowTemp;
  tableData: rowTemp[];
}
export default defineComponent({
  name: "table",
  components: {
    Avatar,
    ColumnTab,
  },
  emits: ["saveModal", "closeModal"],
  setup(props, { emit }) {
    const state: Iprops = reactive({
      tabsActive: "columns",
      rowTemp: { length: 0, point: 0, notnull: false, primary: false },
      tableData: [{ length: 0, point: 0, notnull: false, primary: false }],
    });

    const handleTabClick = (pane: TabsPaneContext, ev: Event) => {
      state.tabsActive = pane.props.name;
    };
    const appendColumn = () => {
      state.tableData.push(state.rowTemp);
    };
    return {
      state,
      handleTabClick,
      appendColumn,
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
