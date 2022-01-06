<template>
  <div class="box">
    <div class="tool-buttons">
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
          <el-button size="small" color="#f2f2f2"
            ><el-icon><Avatar /></el-icon>停止</el-button
          >
        </el-space>
      </div>
    </div>

    <div class="top" :style="{ backgroundColor: 'red' }">
      <CodeMirror />
    </div>
    <!-- <img src="../assets/database.png" /> -->
    <div class="resizer-top-bottom"></div>
    <div class="query-result">
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
</template>

<script>
import CodeMirror from "./codemirror/CodeMirror.vue";
import { Avatar } from "@element-plus/icons-vue";
import TableEditor from "../components/TableEditor.vue";

export default {
  name: "sqleditor",
  components: {
    CodeMirror,
    Avatar,
    TableEditor,
  },
  props: {},
  data() {
    return {
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
  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    dragControllerDiv() {
      const resize = document.getElementsByClassName("resizer-top-bottom")[0];
      const top = document.getElementsByClassName("top")[0];
      const elHeader = document.getElementsByClassName("el-header")[0];
      const elTabsHeader = document.getElementsByClassName("el-tabs__header")[0];
      const toolButtons = document.getElementsByClassName("tool-buttons")[0];
      // const mid = document.getElementsByClassName("mid")[0];
      // const box = document.getElementsByClassName("box")[0];
      // 鼠标按下事件
      resize.onmousedown = function (e) {
        console.log(e);
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          const topHeight = elHeader.clientHeight + elTabsHeader.clientHeight + toolButtons.clientHeight; //60+40+76
          const moveY = e.clientY - topHeight;
          top.style.minHeight = moveY + "px";
          top.style.maxHeight = "0px";

          // left.style.width = moveLen + "px";
          // mid.style.width = rightWidth + "px";
          // resize.style.left = 2 + "px";
        };
        // 鼠标松开事件
        document.onmouseup = function () {
          document.onmousemove = null;
          document.onmouseup = null;
        };
        return false;
      };
    },
  },
};
</script>


<style scoped>
.box {
  margin: 0;
  padding: 0;
  width: 100%;
  /* width: 1500px; */
  /* height: 500px; */
}
.tool-buttons {
  padding: 4px 4px 8px 4px;
  background-color: #f2f2f2;
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
