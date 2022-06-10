<template>
  <div class="_content">
    <!-- <el-button @click="modifyTitle1"> 保存 </el-button> -->
    <el-tabs v-model="state.tabActiveName" type="card" closable @tab-click="handleTabClick"
      @tab-remove="handleTabRemove">
      <el-tab-pane v-for="item in editableTabs" :key="item.name" :label="item.title" :name="item.name">
        <component v-bind:is="item.currentView" @modifyTitle="modifyTitle1" :tabId="item.name"></component>
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
import { TabsPaneContext } from "element-plus";
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
  emits: ["modifyTitle", 'modifyTabCurrent', 'closeTab'],
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
    const handleTabRemove = (name: string) => {
      emit("closeTab", name);
    };
    const handleTabClick = (pane: TabsPaneContext, ev: Event) => {
      emit("modifyTabCurrent", pane.props.name);
    }
    const modifyTitle1 = (tabId: string, title: string) => {
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
      modifyTitle1,
      getTabId
    };
  },
});
</script>


<style scoped>
</style>