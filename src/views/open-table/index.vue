<template>
<!-- <DataTabV2 :dataModel="state.dataModel"/> -->
<DataTab :dataModel="state.dataModel" :nodePath="state.nodePath" :currentPage="state.currentPage"
  :pageSize="state.pageSize" :pageSizes="state.pageSizes" :total="state.total"
  @refreshTableDataModel="refreshTableDataModel" @handleSizeChange="handleSizeChange" 
  @handleCurrentChange="handleCurrentChange"/>
<!-- <DataTabTest /> -->
</template>

<script lang='ts'>
import { countData, getTableData } from "@/api/treeNode";
import { CountDataForm, DataModel, FetchDataInfoForm, TableDesignModel, TableSimple, TreeNode } from "@/types";
import { getNodePath } from "@/utils/tree";
import { assertConditional } from "@babel/types";
import Node from "element-plus/es/components/tree/src/model/node";
import { defineComponent, onMounted, reactive, ref } from "vue";
import DataTab from "./dataTab.vue";
import DataTabV2 from "./dataTabV2.vue";
import DataTabTest from "./dataTabTest.vue";

interface IState {
  treeNode : TreeNode<TableSimple> | undefined;   // 本页面对应的Node节点
  nodePath : string | undefined;                  // node的路径
  limitNum : number;                              // 限制每次查询获取多少行数据
  offsetNum : number;                             // 当前页面最后一次查询的偏移量
  condition : string | undefined;                 // 当前页面的查询条件

  dataModel : DataModel | undefined;              // 当前页面操作的数据

  // 分页控件所需的属性
  currentPage : number;         // 当前页的页码
  pageSize : number;            // 每页显示多少条数据
  pageSizes : number[];         // Element-plus 的分页控件用于显示可选每页显示多少数据
  total : number;               // Element-plus 的分页控件使用，获取总的数目，控件会自动计算显示多少页
  
}

const defaultCurrentPage = 1;
const defaultPageSize = 2;
const defaultPageSizes = [2, 200, 300, 400];

export default defineComponent({
  // props : ["treeData"],
  setup() {

    const state : IState = reactive({
      treeNode : undefined,           
      nodePath : undefined,           
      limitNum : 20,                  
      offsetNum : 0,                  
      condition : undefined,           

      dataModel : undefined,

      currentPage : defaultCurrentPage,
      pageSize : defaultPageSize,
      pageSizes : defaultPageSizes,
      total : 100,

    });


    onMounted(() => {
      console.log('DOM挂载完毕')
      // state中初始化信息
      const selectTableNodeSession = sessionStorage.getItem("openTableNode");
      const selectTableNode = JSON.parse(selectTableNodeSession!) as TreeNode<TableSimple>;
      state.nodePath = selectTableNode.nodePath;
      state.treeNode = selectTableNode;
      getDataCount();
      refreshTableDataModel();
    });

    const refreshTableDataModel = () => {
      console.log("刷新表数据")
      fetchTableData(state.nodePath!, [], defaultCurrentPage, defaultPageSize, state.condition);
    };

    const fetchTableDataByState = (filterColumnList : string[]) => {
      fetchTableData(state.nodePath!, filterColumnList, state.currentPage, state.pageSize, state.condition);
    }

    const fetchTableData = (nodePath : string, filterColumnList : string[], currentPage : number, pageSize : number, condition : string | undefined) => {
      const fetchDataInfo : FetchDataInfoForm = {
        nodePath : nodePath,
        filterColumnList : filterColumnList,
        condition : condition!,
        limitNum : pageSize,
        offsetNum : (currentPage - 1) * pageSize,
      };
      getTableData(fetchDataInfo).then((responseData) => {
        console.log("getTableData", responseData);
        state.dataModel = responseData.data;
        console.log("修改state", state);
      });
    }

    // const fetchTableData = (nodePath : string, filterColumnList : string[], limit : number, offset : number, condition : string | undefined) => {
    //   const fetchDataInfo : FetchDataInfoForm = {
    //     nodePath : nodePath,
    //     filterColumnList : filterColumnList,
    //     condition : condition!,
    //     limitNum : limit,
    //     offsetNum : offset,
    //   };
    //   getTableData(fetchDataInfo).then((responseData) => {
    //     console.log("getTableData", responseData);
    //     state.dataModel = responseData.data;
    //     console.log("修改state", state);
    //   });
    // };

    const handleSizeChange = (val: number) => {
      console.log(`${val} items per page`)

      state.pageSize = val;
      fetchTableDataByState([]);
      
    }
    const handleCurrentChange = (val: number) => {
      state.currentPage = val;
      console.log(`current page: ${val}`)
      fetchTableDataByState([]);
    }

    const getDataCount = () => {
      console.log("查询表数据的数量")
      const countDataForm : CountDataForm = {
        nodePath : state.nodePath!,
        condition : state.condition!,
      };
      countData(countDataForm).then((responseData) => {
        console.log("countDataForm", responseData);
        state.total = responseData.data;
      });
    }

    return {
      state,
      refreshTableDataModel,
      
      handleSizeChange,
      handleCurrentChange,
    }

  },
  components: {
    DataTab,
    // DataTabV2,
    // DataTabTest,
  },
});
</script>