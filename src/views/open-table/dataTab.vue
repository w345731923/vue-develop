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
    <!-- <div class="header" v-if="headTurn">
      TODO
      @current-change="handleCurrentChange"
    </div> -->
    <el-table style="width: 100%"
      :data="tableData"
      highlight-current-row

      @cell-click="cellclick"
      @cell-dblclick="celledit"
      :row-class-name="tableRowClassName"
      @row-click="setRowIndex"
      >
      <el-table-column prop="index" type="index" width="180">

      </el-table-column>
      <el-table-column prop="date" label="date" width="180">

      </el-table-column>
      <el-table-column prop="name" label="name" width="180">
        <template #default="scope">
          <el-input v-if="scope.row.name.edit"
                    ref="name"
                    v-model="scope.row.name.value"
                    style="width: 100%"
                    @blur="scope.row.name.edit">
          </el-input>
          <span v-else>{{scope.row.name.value}}{{scope.$index}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="address" >
        <template #default="scope">
          <el-input v-if="scope.row.address.edit"
                    ref="address"
                    v-model="scope.row.address.value"
                    style="width: 100%"
                    @blur="changeData(scope.row)">
          </el-input>
          <span v-else>{{scope.row.address.value}}</span>
        </template>
      </el-table-column>
    </el-table>
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
import { defineComponent, ref, reactive } from 'vue'

interface User {
  index : number
  date: string
  name: string
  address: string
}

interface rowData {
  value : User
  edit : boolean
}

interface DataModel {
  
  currentGrid : {
      rowId : null,     // 行ID
      colId : null,     // 列ID
      val : null,       // 单元格的值
      isHead : boolean | undefined  // 是否为表头 
  }

}


export default defineComponent ({
  name : "DataTabPageIndex",
  components : {},
  setup() {

    const tableData : User[] = [
      {
        index: 0,
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        index: 1,
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        index: 2,
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        index: 3,
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      }
    ];
    const state: DataModel = reactive({
      currentGrid : {
        rowId : null,     // 行ID
        colId : null,     // 列ID
        val : null,       // 单元格的值
        isHead : undefined  // 是否为表头 
      }
    });
    const getListHand = async () => {
      console.log("getListHand enter")
      tableData.forEach((item, index) => {
        item.index = index + 1;
        for(let i in item) {
          item[i] = {
            value: item[i],
            edit: false
          }
        }
      });
      console.log("create get table data.", tableData)
    };
    const setRowIndex = (row : any, event : any, column : any) => {
      console.log("setRowIndex", row.row_index);
      state.currentGrid.rowId = row.row_index;
    };
    const cellclick = (row : any, column : any) => {
      console.log("cellclick enter")
      console.log(row)
      console.log(column)
      state.currentGrid = {
        rowId : row ? row.row_index : null,     
        colId : column.index,
        val : row ? row[column.property] : column.label,
        isHead : !row
      }
      console.log("cell click", state)
    }
    const celledit = (row : any, column : any) => {
      if(row[column.property]){
        row[column.property].edit = true;
        setTimeout(() => {
          // this.$refs[column.property].focus()
        }, 20);
      }
    };
    const changeData = async (value : any) => {
      
        value.address.edit =false;
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
    const activeIndex = () => {
      ref('1')
    };
    const handleSelect = (key, keyPath) => {
      console.log(key, keyPath)
    };
    // const handleCurrentChange = (val : any) => {
    //   console.log("handle Current Change enter")
    //   console.log(val)
    //   val.address.edit=false
    //   // console.log(tableData.indexOf(val))
    // };
    return {
        Timer,
        state,
        tableData,
        cellclick,
        celledit,
        changeData,
        getListHand,
        setRowIndex,
        // handleCurrentChange,
    }
  },
  created () {
    this.getListHand();
  },
  // computed : {
  //   curColumn () {
  //     return this.
  //   }
  // },
  methods : {
    addRow() {
      console.log("addrow enter")
      const idx = this.tableData.length + 1;
      const obj : User = {
        index : idx,
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      }
      // this.columnList.forEach(p => obj[p.prop] = '')
      // 在指定的行号上添加一行数据
      this.tableData.splice(idx, 0, obj)
      // 修改行的结构，使其添加edit属性，使新添加的列可以被编辑
      for(let i in this.tableData[idx - 1]) {
        this.tableData[idx - 1][i] = {
          value : this.tableData[idx - 1][i],
          edit: false
        }
      }
      console.log("addrow ", obj)
    },
    
    delRow() {
      console.log("delete row enter.")
      console.log(this.state.currentGrid)
      this.state.currentGrid.rowId != null && this.tableData.splice(this.state.currentGrid.rowId, 1)
    },
    tableRowClassName ({row , rowIndex}) {
      console.log("tableRowClassName enter", row, rowIndex)
      row.row_index = rowIndex;
    }
  }
  
});

// const handleEdit = (index: number, row: User) => {
//   console.log(index, row)
// }
// const handleDelete = (index: number, row: User) => {
//   console.log(index, row)
// }


</script>
<style>
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
  bottom: 0;
  position: fixed;
}
.el-menu-demo {
  bottom: 0;
  position: fixed;
}
</style>