<template>
  
  <div>
  <div class="toolbar topToolBar">
    <el-row :gutter="20">
      <el-col :span="2">
        <div class="toolbar-button"><el-button type="primary" 
              :icon="Timer">导出</el-button>
        </div>
      </el-col>
      <el-col :span="2">
        <div class="toolbar-button">
          <el-button>导入</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
  <!-- <div class="el-row toolbar topToolBar">
    <el-button>导入</el-button>
    <el-button type="primary" 
              :icon="Timer">导出</el-button>
  </div> -->
  <div class="datatable">
    ！！！Element-plus需要 2.2.0 以上
  <el-table-v2 style="width: 100%"
                
                :columns="columns"
                :data="datax"
              :width="700"
              :height="400"
                fixed
                />
  </div>  
  <div class="el-row toolbar bottomToolBar">
    <el-button @click="addRow">添加新行</el-button>
    <el-button @click="delRow">删除行</el-button>
    <el-button>保存</el-button>
    <el-button>取消</el-button>
    <el-button>刷新</el-button>
  </div>
  <!-- <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
    <el-menu-item index="0">LOGO</el-menu-item>
    <div class="flex-grow" />
    <el-menu-item index="1">Processing Center</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
  </el-menu> -->
  </div>
</template>

<script lang='ts' >
import { Timer } from '@element-plus/icons-vue'
import { defineComponent, ref, reactive, toRefs, PropType } from 'vue'
import { DataModel } from "@/types";

interface IState {
  data : DataModel | undefined,
  currentGrid : {
      rowId : number,     // 行ID
      colId : number,     // 列ID
      val : any,       // 单元格的值
      isHead : boolean | undefined  // 是否为表头 
  }

}
export default defineComponent ({
  name : "DataTabPageIndex",
  components : {},
  // props : {
  //   dataModel : {
  //     type: Object as PropType<DataModel>,
  //     // dafault: () => [],
  //   },
  // } , //['dataModel']
  props :['dataModel'],
  watch : {
    // 监听父控件中dataModel的变化
    dataModel : {
      immediate : true,
      handler(newValue, oldValue) {
        console.log("监听到父控件的数据变化", oldValue, newValue);
        this.state.data = newValue as DataModel;
        this.getListHand();
      }
    }
  },
  setup(props) {
    
    // const dataModel = this.dataModel;
    // const dataModels = dataModel.datas ;
    // const dataModel : User[] = [
    //   {
    //     index: 0,
    //     date: '2016-05-03',
    //     name: 'Tom',
    //     address: 'No. 189, Grove St, Los Angeles',
    //   },
    //   {
    //     index: 1,
    //     date: '2016-05-02',
    //     name: 'Tom',
    //     address: 'No. 189, Grove St, Los Angeles',
    //   },
    //   {
    //     index: 2,
    //     date: '2016-05-04',
    //     name: 'Tom',
    //     address: 'No. 189, Grove St, Los Angeles',
    //   },
    //   {
    //     index: 3,
    //     date: '2016-05-01',
    //     name: 'Tom',
    //     address: 'No. 189, Grove St, Los Angeles',
    //   }
    // ];
    const state: IState = reactive({
      data :  undefined,
      currentGrid : {
        rowId : 0,     // 行ID
        colId : 0,     // 列ID
        val : '',       // 单元格的值
        isHead : undefined  // 是否为表头 
      }
    });

    state.data = ref(props.dataModel!);
    // const data : DataModel = ref(props.dataModel!);
    // console.log("是我i", data);

    const getListHand = async () => {
      console.log("封装单元格数据，嵌套添加edit属性");
      state.data?.datas.forEach((item, index) => {
        item.index = index + 1;
        for(let i in item) {
          item[i] = {
            value: item[i],
            edit: false
          }
        }
      });
      console.log("create get table data.", state.data)
    };
    const setRowIndex = (row : any, event : any, column : any) => {
      console.log("setRowIndex", row.row_index);
      state.currentGrid.rowId = row.row_index;
    };
    const cellclick = (row : any, column : any) => {
      console.log("单击单元格，进入", row, column)
      state.currentGrid = {
        rowId : row ? row.row_index : null,     
        colId : column.no,
        val : row ? row[column.no] : column.label,
        isHead : !row
      }
      console.log("单击单元格，修改state的currentGrid状态", state)
    }
    const celledit = (row : any, column : any) => {
      console.log('双击单元格，进入', row, column)
      if(row[column.no]){
        console.log('双击单元格，修改编辑状态')
        row[column.no].edit = true;
        setTimeout(() => {
          // this.$refs[column.property].focus()
        }, 20);
      }
    };
    const changeData = async (value : any) => {
        console.log("编辑的单元格失去焦点，触发编辑事件", value)
        value.edit = false;
        const colId = state.currentGrid.colId;
        value[colId].edit=false;
        // TODO 设置数据，数据的持久化
        // const reg = /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g
        // if(!reg.test(value.kpi.value)){
        //   return this.$message.error('只能输入数字')
        // } else if (value.kpi.value > 1000000000) {
        //   return this.$message.error('输入数字过大')
        // }
        // let params = {
        //   feeKpi:    value.kpi.value,
        //   meetingId: value.id.value,
        //   paperKpi:0,
        //   registerKpi:0,
        //   viewKpi:0,
        //   type:1
        // };
        // let {data} = await setUpMeeting(params);
        // if( data.code==0) {
        //   // this.$message.success('设置成功');
        //   value.address.edit =false;
        // }
    };

    const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
      Array.from({ length }).map((_, columnIndex) => ({
        ...props,
        key: `${prefix}${columnIndex}`,
        dataKey: `${prefix}${columnIndex}`,
        title: `Column ${columnIndex}`,
        width: 150,
      }))

    const generateData = (
      columns: ReturnType<typeof generateColumns>,
      length = 200,
      prefix = 'row-'
    ) =>
      Array.from({ length }).map((_, rowIndex) => {
        return columns.reduce(
          (rowData, column, columnIndex) => {
            rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`
            return rowData
          },
          {
            id: `${prefix}${rowIndex}`,
            parentId: null,
          }
        )
      })

    const columns = generateColumns(10)
    const datax = generateData(columns, 200)
    // const handleCurrentChange = (val : any) => {
    //   console.log("handle Current Change enter")
    //   console.log(val)
    //   val.address.edit=false
    //   // console.log(tableData.indexOf(val))
    // };
    return {
        Timer,
        state,
        // data,
        cellclick,
        celledit,
        changeData,
        getListHand,
        setRowIndex,
        // handleCurrentChange,

        datax,
        columns,
    }
  },
  created () {
    // this.getListHand();
  },
  // computed : {
  //   curColumn () {
  //     return this.
  //   }
  // },
  methods : {
    addRow() {
      console.log("添加新行,enter")
      const idx = this.state.data?.datas.length + 1;
      let obj = {};
      // 根据Type添加,为新增行添加初始数据
      // this.state.data?.columnNames.forEach(p => obj[p.no] = '')
      this.state.data?.dataTypes.forEach((item, index) => {
        obj[index] = '';
      });
      // this.columnList.forEach(p => obj[p.prop] = '')
      // 在指定的行号上添加一行数据
      this.state.data?.datas.splice(idx, 0, obj);

      // 修改行的结构，使其添加edit属性，使新添加的列可以被编辑
      for(let i in this.state.data?.datas) {
        console.log("封装单元格数据，嵌套添加edit属性");

        this.state.data!.datas![idx - 1]![i] = {
          value : this.state.data?.datas[idx - 1][i],
          edit: false
        }
      }
      console.log("添加新行 ", obj)
    },
    
    delRow() {
      console.log("删除被选中的行. rowID:", this.state.currentGrid.rowId)
      console.log(this.state.currentGrid)
      this.state.currentGrid.rowId != null && this.state.data?.datas.splice(this.state.currentGrid.rowId!, 1)
    },
    tableRowClassName ({row , rowIndex}) {
      console.log("tableRowClassName enter", row, rowIndex)
      row.row_index = rowIndex;
    }
  }
  
});


</script>
<style>
.el-table .update-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .add-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .delete-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-row {
  /* margin-bottom: 20px; */
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.toolbar {
  height: 50px;
  width: 100%;
}
.toolbar-button {
  border-radius: 4px;
  min-height: 36px;
}
.bottomToolBar {
  /* bottom: 0;
  position: fixed; */
}
.el-menu-demo {
  bottom: 0;
  position: fixed;
}
</style>