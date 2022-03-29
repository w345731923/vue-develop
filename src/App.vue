<template>
  <!-- router-link会被渲染成a标签 -->
  <!-- <router-link to="/home">home</router-link> -->
  <!-- <router-link to="/login">login</router-link> -->
  
  <!-- 路由出口 -->
  <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view/>
</template>

<script lang="ts">
import { defineComponent } from "vue";
  
export default defineComponent({
  name: "app"
});
</script>
<style lang="less">
html, body {
  margin: 0;
  padding: 0;
}

</style>






