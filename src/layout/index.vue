<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <v-header :fatherMethod="fatherMethod" />
      </el-header>
      <el-container>
        <el-aside width="300px">
          <v-sidebar />
        </el-aside>
        <el-main>
          <v-content
            likes="google"
            years="2021"
            :isTable="isTable"
            :isSqlEdit="isSqlEdit"
          />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import vHeader from "./components/Header.vue";
import vSidebar from "./components/Sidebar.vue";
import vContent from "./components/Content.vue";
/**
 * created（创建）-> mounted（加载）-> updated（更新）-> unmounted（卸载）
 * https://v3.vuejs.org/guide/instance.html#lifecycle-diagram
 */
export default {
  name: "Home",
  data() {
    return {
      isTable: true,
      isSqlEdit: false,
    };
  },
  methods: {
    fatherMethod(key) {
      console.log("测试", key === '1');
      if (key === '1') {
        this.isTable = false;
        this.isSqlEdit = true;
      } else {
        this.isTable = true;
        this.isSqlEdit = false;
      }
    },
  },
  components: {
    vHeader,
    vSidebar,
    vContent,
  },
};
</script>
<style>
section.el-container.is-vertical {
  height: calc(100vh - 30px);
}
.el-main::-webkit-scrollbar {
  display: none;
}
.el-header {
  background-color: #2a7cb4;
  color: white;
  text-align: center;
}

.el-aside {
  /* background-color: #d3dce6; */
  color: var(--el-text-color-primary);
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  text-align: center;
}
</style>