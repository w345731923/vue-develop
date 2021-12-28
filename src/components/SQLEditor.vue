<template>
  <div class="box">
    <CodeMirror />
  </div>
</template>

<script>
import CodeMirror from "./codemirror/CodeMirror.vue";

export default {
  name: "sqleditor",
  props: {},
  data() {
    return {};
  },
  components: {
    CodeMirror,
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
</style>