<template>
  <div class="_content">
    <!-- <el-button @click="modifyTitle1"> 保存 </el-button> -->
    <el-tabs v-model="state.tabActiveName" type="card" closable>
      <!-- @tab-remove="handleRemoveTab" -->
      <!-- @tab-click="handleClick" -->
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <component
          v-bind:is="item.currentView"
          @modifyTitle="modifyTitle1"
        ></component>
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

<script lang="ts">
import { defineComponent, reactive, toRefs, watch, onMounted } from "vue";

export default defineComponent({
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
    modifyTitle: Function,
  },
  emits: ["modifyTitle"],
  setup(props, { emit }) {
    const { tabActiveName } = toRefs(props);
    const state = reactive({
      tabActiveName: tabActiveName.value,
    });
    watch(
      tabActiveName,
      (newValue) => {
        state.tabActiveName = newValue;
      },
      { immediate: true }
    );
    const handleRemoveTab = (targetName) => {
      console.log("handleRemoveTab targetName", targetName);
    };
    const modifyTitle1 = (tabId: string, title: string) => {
      // const tabId = sessionStorage.getItem("tabId");
      emit("modifyTitle", tabId, title);
    };
    return {
      state,
      handleRemoveTab,
      modifyTitle1,
    };
  },
});
</script>


<style scoped>
</style>