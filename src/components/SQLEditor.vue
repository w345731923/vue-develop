<template>
  <div class="box">
    <div class="tool-buttons" :id="identity">
      <div class="row-button">
        <el-button-group>
          <el-button size="small" color="#f2f2f2">
            <el-icon><Avatar /></el-icon>
            保存
          </el-button>
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>另存为</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>导出</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>格式化</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>文本</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>自动提交</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>提交</el-button
          >
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>回滚</el-button
          >
        </el-button-group>
      </div>
      <div class="row-connect">
        <el-space wrap>
          <el-select v-model="ip_val" placeholder="localhost" size="mini">
            <el-option
              v-for="item in ip_option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select v-model="db_val" placeholder="postgres" size="mini">
            <el-option
              v-for="item in db_option"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select v-model="schema_val" size="mini">
            <el-option
              v-for="item in schema_option"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
            </el-option>
          </el-select>
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>执行</el-button
          >
          <el-button size="small" color="#f2f2f2" @click="handleClick"
            ><el-icon><Avatar /></el-icon>停止</el-button
          >
        </el-space>
      </div>
    </div>
    <div class="split-content">
      <div class="codemirror pane_flex">
        <CodeMirror />
      </div>
      <!-- <img src="../assets/database.png" /> -->
      <div class="resizer_controls resizer_controls_column"></div>
      <div class="query-result pane_flex">
        <el-tabs model-value="info" type="card">
          <el-tab-pane label="信息" name="info" style="margin: 0.5rem">
            <p style="margin: 0.3rem">> SQL:select now()</p>
            <p style="margin: 0.3rem">> SUCCESS:OK</p>
            <p style="margin: 0.3rem">> TIME:148ms</p>
          </el-tab-pane>
          <el-tab-pane label="查询结果" name="result" style="margin: 0.5rem">
            <TableEditor />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import CodeMirror from "./codemirror/CodeMirror.vue";
import { Avatar } from "@element-plus/icons-vue";
import TableEditor from "../components/TableEditor.vue";
// import { getList } from "@/api/test";
// import { reactive, toRefs } from "vue";

export default {
  name: "sqleditor",
  components: {
    CodeMirror,
    Avatar,
    TableEditor,
  },
  props: ["identity"],
  setup() {
    // const state = reactive({
    //   identity: props.identity,
    // });
    // return {
    //   ...toRefs(state),
    // };
  },
  data() {
    return {
      // name1: props.name,
      activeClass: "name",
      ip_option: [
        {
          value: "localhost1",
          label: "localhost1",
        },
        {
          value: "localhost2",
          label: "localhost2",
        },
        {
          value: "localhost3",
          label: "localhost3",
        },
      ],
      ip_val: "localhost1",
      db_option: [
        {
          value: "postgres",
          label: "postgres",
        },
        {
          value: "test",
          label: "test",
        },
      ],
      db_val: "postgres",
      schema_option: [
        {
          value: "0",
          label: "请选择模式",
        },
        {
          value: "public",
          label: "public",
        },
      ],
      schema_val: "0",
    };
  },
  mounted() {},
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      // const { obj } = await getList();
      // console.log("data", obj);
    },
    handleClick() {
      this.name1 = 333;
    },
  },
  computed: {
    //计算属性
    reversedMessage() {
      return "".split("").reverse().join("");
    },
  },
};
</script>


<style scoped>
.box {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
}
.tool-buttons {
  padding: 4px 4px 8px 4px;
  background-color: #f2f2f2;
  flex: 0 0 auto;
  overflow: auto;
}
.split-content {
  flex: 1;
  display: flex;
  overflow: hidden;
  flex-direction: column;
}
.row-connect {
  padding-left: 1em;
}
.resizer-top-bottom {
  position: relative;
  flex: 0 1 auto;
  height: 2px;
  cursor: row-resize;
  background-color: var(--mdc-theme-background, #dedede);
}
</style>
