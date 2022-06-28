<template>
<DataTab />
</template>

<script lang='ts'>
import { getTableData } from "@/api/treeNode";
import { FetchDataInfoForm, TableDesignModel, TableSimple, TreeNode } from "@/types";
import { getNodePath } from "@/utils/tree";
import { assertConditional } from "@babel/types";
import Node from "element-plus/es/components/tree/src/model/node";
import { defineComponent, onMounted, reactive } from "vue";
import DataTab from "./dataTab.vue";

interface IState {
  treeNode : TreeNode<TableSimple> | undefined;
  nodePath : string | undefined;
  limitNum : number;
  offsetNum : number;
  condition : string | undefined;
}

export default defineComponent({
  // props : ["treeData"],
  setup() {

    const state : IState = reactive({
      treeNode : undefined,
      nodePath : undefined,
      limitNum : 20,
      offsetNum : 0,
      condition : undefined
    });


    onMounted(() => {
      console.log('DOM挂载完毕')
      // state中初始化信息
      const selectTableNodeSession = sessionStorage.getItem("openTableNode");
      const selectTableNode = JSON.parse(selectTableNodeSession!) as TreeNode<TableSimple>;
      state.nodePath = selectTableNode.nodePath;
      state.treeNode = selectTableNode;
      refreshTableDataModel();
    });

    const refreshTableDataModel = () => {
      fetchTableData(state.nodePath!, [], 20, 0, state.condition);
    };

    const fetchTableData = (nodePath : string, filterColumnList : string[], limit : number, offset : number, condition : string | undefined) => {
      const fetchDataInfo : FetchDataInfoForm = {
        nodePath : nodePath,
        filterColumnList : filterColumnList,
        condition : condition!,
        limitNum : limit,
        offsetNum : offset,
      } 
      getTableData(fetchDataInfo).then((responseData) => {
        console.log("getTableData", responseData);

        
      });
    }

  },
  components: {
    DataTab,
  },
});
</script>