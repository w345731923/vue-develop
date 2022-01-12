<template>
  <div class="theme_flex_column">
    <el-header>
      <v-header :addSQLTab="addSQLTab" />
    </el-header>
    <div class="split_flex_row">
      <vSidebar class="pane_flex left home" />
      <div class="resizer_controls"></div>
      <vContent
        class="pane_flex right home"
        :tabActiveName="tabActiveName"
        :editableTabs="editableTabs"
        :removeTab="removeTab"
      />
    </div>
  </div>
</template>

<script>
import vHeader from "@/layout/components/Header.vue";
import vSidebar from "./components/Sidebar.vue";
import vContent from "./components/Content.vue";
import SQLEditor from "../components/SQLEditor.vue";
import CreateTable from "../views/create-table/index.vue";

/**
 * created（创建）-> mounted（加载）-> updated（更新）-> unmounted（卸载）
 * https://v3.vuejs.org/guide/instance.html#lifecycle-diagram
 */
export default {
  name: "Home",
  data() {
    return {
      editableTabs: [], //tab显示数组
      tabActiveName: "", //tab选中页
    };
  },
  components: {
    vHeader,
    vSidebar,
    vContent,
  },
  mounted() {
    this.dragControllerDiv();
  },
  methods: {
    dragControllerDiv() {
      const resize = document.getElementsByClassName("resizer_controls")[0];
      const left = document.getElementsByClassName("left")[0];
      // const mid = document.getElementsByClassName("mid")[0];
      // const box = document.getElementsByClassName("box")[0];
      // 鼠标按下事件
      resize.onmousedown = function (e) {
        console.log(e);
        // const startX = e.clientX;
        // const resizeLeft = resize.offsetLeft;
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          // console.log("startX", startX); //248
          // console.log("resizeLeft", resizeLeft); //248
          const moveX = e.clientX;
          // let moveLen = resizeLeft + (moveX - startX);
          // const rightWidth = box.clientWidth - resize.offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
          // console.log(rightWidth,left, mid);
          left.style.minWidth = moveX + "px";
          left.style.maxWidth = "0px";

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
    /**
     * SQL编辑器页面，拖动中间层事件
     */
    dragControllerSQLEditor() {
      console.log("editableTabs.length = ", this.editableTabs.length);
      // //页面header
      const elHeader = document.getElementsByClassName("el-header")[0];
      //tab页height不知为何获取为0，暂时写固定值40
      const elTabsHeader =
        document.getElementsByClassName("el-tabs__header")[0]; //header
      // const elTabsHeader = { clientHeight: 40 };
      // console.log(
      //   elHeader.clientHeight,
      //   elTabsHeader.clientHeight,
      //   toolButtons.clientHeight
      // );

      this.editableTabs.map((element, index) => {
        console.log(element, index);
        const toolButtons =
          document.getElementsByClassName("tool-buttons")[index]; //工具栏对象
        console.log(
          elHeader.clientHeight,
          elTabsHeader.clientHeight,
          toolButtons.clientHeight
        );
      });

      // //获取拖动层div，绑定事件
      // const resize = document.getElementsByClassName("resizer_controls_column");
      // for (var i = 0; i < resize.length; i++) {
      //   const codemirrorObj = document.getElementsByClassName("codemirror")[i]; //code区域
      //   // console.log("codemirrorObj", codemirrorObj);
      //   const toolButtons = document.getElementsByClassName("tool-buttons")[i]; //工具栏对象
      //   console.log("toolButtons", toolButtons.clientHeight);
      //   const topHeight =
      //     elHeader.clientHeight +
      //     elTabsHeader.clientHeight +
      //     toolButtons.clientHeight; //60+40+76
      //   console.log(
      //     "moveY 60-40-76",
      //     elHeader.clientHeight,
      //     elTabsHeader.clientHeight,
      //     toolButtons.clientHeight
      //   );
      //   // 鼠标按下事件
      //   resize[i].onmousedown = function () {
      //     // 鼠标拖动事件
      //     document.onmousemove = function (e) {
      //       const moveY = e.clientY - topHeight; //移动位置-上方距离=sql编辑器高度
      //       // console.log("moveY", topHeight, e.clientY, moveY);
      //       codemirrorObj.style.minHeight = moveY + "px";
      //       codemirrorObj.style.maxHeight = "0px";
      //     };
      //     // 鼠标松开事件
      //     document.onmouseup = function () {
      //       document.onmousemove = null;
      //       document.onmouseup = null;
      //     };
      //     return false;
      //   };
      // }
    },
    /**
     * 添加tab
     */
    addSQLTab(event) {
      const name = new Date().getTime();
      if (event.index === "1") {
        const newTabName = `*<localhost>无标题`;
        this.editableTabs.push({
          title: newTabName,
          name: name,
          content: <SQLEditor name={{ name }} />,
        });
        setTimeout(() => {
          this.dragControllerSQLEditor();
        }, 500);
      } else if (event.index === "2") {
        const newTabName = `newTable@postgres.public(localhost)`;
        this.editableTabs.push({
          title: newTabName,
          name: name,
          content: <CreateTable />,
        });
      }
      this.tabActiveName = name;
    },
    /**
     * 移除tab
     */
    removeTab(targetName) {
      const tabs = this.editableTabs;
      let activeName = this.tabActiveName;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.tabActiveName = activeName;
      this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
    },
  },
};
</script>
<style>
.el-header {
  background-color: #2a7cb4;
  color: white;
  text-align: center;
}
.split_flex_row .home:first-child {
  position: relative;
  flex: 0 1 auto;
}
.split_flex_row .home:last-child {
  overflow: hidden;
}
</style>