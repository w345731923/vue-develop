<template>
  <!-- <div class="_content"> -->
  <div style="overflow:visible">
    <el-tabs v-model="state.tabActiveName" type="card" closable @tab-click="handleTabClick"
      @tab-remove="handleTabRemove" style="height:100%">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name"
        style="height: calc(100% - 41px);">
        <component v-bind:is="item.currentView" @modifyTitle="modifyTabTitle" :tabId="item.name"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
      <!-- <el-tab-pane
        v-for="item in editableTabs"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        {{ item.currentView }}
      </el-tab-pane> -->
<script lang="ts">
import { TabsPaneContext } from "element-plus";
import { defineComponent, reactive, toRefs, watch } from "vue";
import { EditableTabs } from "@/types";

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
  emits: ["modifyTitle", 'modifyTabCurrent', 'closeTab'],
  setup(props, { emit }) {
    const { tabActiveName, editableTabs } = toRefs(props);
    const state = reactive({
      tabActiveName: tabActiveName.value,
    });
    const tabs = editableTabs.value as EditableTabs[];
    watch(
      tabActiveName,
      (newValue) => {
        state.tabActiveName = newValue;
      },
      { immediate: true }
    );
    /**
     * 关闭tab
     */
    const handleTabRemove = (name: string) => {
      emit("closeTab", name);
    };
    /**
     * tab点击事件
     * @param pane 
     * @param ev 
     */
    const handleTabClick = (pane: TabsPaneContext, ev: Event) => {
      emit("modifyTabCurrent", pane.props.name);
    }
    /**
     * 修改tab标题
     * @param tabId 
     * @param title 
     */
    const modifyTabTitle = (tabId: string, title: string) => {
      emit("modifyTitle", tabId, title);
    };
    const getTabId = (item: any) => {
      console.log('getTabId item', item)
      return item.name;
    }
    return {
      state,
      handleTabRemove,
      handleTabClick,
      modifyTabTitle,
      getTabId,
      tabs
    };
  },
});
</script>


<style scoped>
</style>