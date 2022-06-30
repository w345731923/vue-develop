<template>
<DataTab :dataModel="state.dataModel"/>
<!-- <DataTab v-bind="state.dataModel"/> -->
<DataTabTest />
</template>

<script lang='ts'>
import { getTableData } from "@/api/treeNode";
import { DataModel, FetchDataInfoForm, TableDesignModel, TableSimple, TreeNode } from "@/types";
import { getNodePath } from "@/utils/tree";
import { assertConditional } from "@babel/types";
import Node from "element-plus/es/components/tree/src/model/node";
import { defineComponent, onMounted, reactive } from "vue";
import DataTab from "./dataTab.vue";
import DataTabTest from "./dataTabTest.vue";

interface IState {
  treeNode : TreeNode<TableSimple> | undefined;   // 本页面对应的Node节点
  nodePath : string | undefined;                  // node的路径
  limitNum : number;                              // 限制每次查询获取多少行数据
  offsetNum : number;                             // 当前页面最后一次查询的偏移量
  condition : string | undefined;                 // 当前页面的查询条件

  dataModel : DataModel | undefined;              // 当前页面操作的数据
}

export default defineComponent({
  // props : ["treeData"],
  setup() {

    const state : IState = reactive({
      treeNode : undefined,           
      nodePath : undefined,           
      limitNum : 20,                  
      offsetNum : 0,                  
      condition : undefined,           

      dataModel : undefined
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
        state.dataModel = responseData.data;
        console.log("修改state", state);
      });
    };

    return {
      state
    }

  },
  components: {
    DataTab,
    DataTabTest,
  },
});
</script>