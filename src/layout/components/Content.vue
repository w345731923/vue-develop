<template>
  <div class="_content">
    <el-tabs
      v-model="activeName"
      type="card"
      closable
      @tab-click="handleClick"
      @tab-remove="handleRemoveTab"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <component :is="item.content"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "vContent",
  props: {
    tabActiveName: {
      type: String,
      dafault: () => "0",
    },
    editableTabs: {
      type: Array,
      dafault: () => [],
    },
    removeTab: {
      type: Function,
      default: null,
    },
  },
  components: {
    // SQLEditor,
    // TableEditor,
  },
  mounted() {
    var promise1 = new Promise(function (resolve, reject) {
      setTimeout(() => {
        resolve("success", resolve, reject);
      }, 2000);
    });
    promise1
      .then((data) => {
        console.log("data", data);
      })
      .catch((err) => {
        console.log("err", err);
      });
    var a = [1, 4, -5, 10].find((n) => n < 0);
    console.log(a);
    var b = [1, 5, 10, 15].find((n) => {
      const aaa = n > 9;
      console.log('aaa',aaa,n,9)
      return aaa});
    console.log(b);
    var c = [1, 5, 10, 15].findIndex((n) => n > 9);
    console.log(c);
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleRemoveTab(targetName) {
      var a = `abc`;
      console.log(a);
      this.removeTab(targetName);
    },
  },
  watch: {
    tabActiveName: {
      immediate: true,
      handler(val) {
        this.activeName = val;
      },
    },
  },
};
</script>


<style scoped>
</style>