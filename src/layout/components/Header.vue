<template>
  <div class="header">
    <div class="logo">瀚高管理工具</div>
    <div class="menu">
      <el-menu
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#338ecc"
        text-color="#fff"
        active-text-color="none"
        @select="handleSelect"
      >
        <el-menu-item index="1">SQL</el-menu-item>
        <el-menu-item index="2">Table</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    fatherMethod: {
      type: Function,
      default: null,
    },
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.fatherMethod(key);
    },
  },
};
</script>

<style>
.header {
  display: flex;
  align-items: center;
  height: 60px;
  line-height: 60px;
  padding: 0 16px;
  z-index: 1;
}
.logo {
  height: 100%;
  width: 250px;
  cursor: pointer;
  margin-right: 16px;
}
.menu {
  height: 100%;
}
</style>