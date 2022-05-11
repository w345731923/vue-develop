<template>
  <div class="_content">
    <el-tabs
      v-model="activeName"
      type="card"
      closable
      @tab-remove="handleRemoveTab"
    >
      <!-- @tab-click="handleClick" -->
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
                <component v-bind:is="item.currentView"></component>
        <!-- <component :is="item.currentView"></component> -->
      </el-tab-pane>
      <!-- <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        {{ item.currentView }}
      </el-tab-pane> -->
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

  },
  mounted() {},
  methods: {
    // handleClick(tab, event) {
    //   console.log(tab, event);
    // },
    handleRemoveTab(targetName) {
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