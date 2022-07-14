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
    <div class="datatableDiv">
      <!-- <div class="header" v-if="headTurn">
        TODO
        @current-change="handleCurrentChange"
      </div> -->
      <el-table ref="dataTable"
        style="width: 100%"
        :data="state.data?.datas"
        highlight-current-row

        @cell-click="cellclick"
        @cell-dblclick="celledit"
        :row-class-name="tableRowClassName"
        @row-click="setRowIndex"
        >
        <!-- 动态生成列名 -->
        <el-table-column v-for="(item, index) in state.data?.columnNames" :key="index" :label="item" :prop="item" >
          <template #default="scope">
            <!-- <span>{{scope.row[index]}}</span> -->
            <el-input v-if="scope.row[index].edit"
                      :ref="item"
                      v-model="scope.row[index].value"
                      style="width: 100%"
                      @blur="changeData(scope.row)">
            </el-input>
            <span v-else>{{scope.row[index].value}}</span>
          </template>
        </el-table-column>
        
        <!-- <el-table-column v-for="item in data.columnNames" :key="item.value" ></el-table-column> -->
        <!-- <el-table-column v-if="dataModel.columnNames.length > 0" v-model="dataModel.co"></el-table-column> -->
      </el-table>
    </div>  
    <div class="el-row toolbar bottomToolBar">
      <el-button @click="addRow">添加新行</el-button>
      <el-button @click="delRow">删除行</el-button>
      <el-button @click="saveClick">保存</el-button>
      <el-button @click="cancleClick">取消</el-button>
      <el-button @click="$emit('refreshTableDataModel')">刷新</el-button>
      <el-pagination 
        v-model:currentPage="state.currentPage"
        v-model:page-size="state.pageSize"
        :page-sizes="state.pageSizes"
        :small="small"
        :disabled="disabled"
        :background="background"
        layout="total, sizes, prev, pager, next, jumper"
        :total="state.total"
        @size-change="$emit('handleSizeChange', state.pageSize)"
        @current-change="$emit('handleCurrentChange', state.currentPage)"
      />
    </div>
  </div>
</template>

<script lang='ts' >
import { Timer } from '@element-plus/icons-vue'
import { defineComponent, ref, reactive, toRefs, PropType } from 'vue'
import { BaseDataType, DataModel, SaveDataInfo } from "@/types";
import { saveTable } from '@/api/treeNode';

interface IState {
  nodePath : string,                        // nodePath
  currentGrid : {
      rowId : number,     // 行ID
      colId : number,     // 列ID
      val : any,       // 单元格的值
      isHead : boolean | undefined  // 是否为表头 
  }
  data : DataModel | undefined,                   // 页面中显示的数据
  inputData : DataModel | undefined,              // 该页面传入的数据的备份，用于与修改后的数据进行对比
  changeData : DataChangeInfo[] | undefined      // 页面中修改的数据

  currentPage : number,         // 当前页的页码
  pageSize : number,            // 每页显示多少条数据
  pageSizes : number[],         // Element-plus 的分页控件用于显示可选每页显示多少数据
  total : number,               // Element-plus 的分页控件使用，获取总的数目，控件会自动计算显示多少页
}

interface DataColumnInfo {
  column : number,                     // 列号
  oldValue : object | undefined,                  // 旧值
  newValue : object | undefined,                  // 新值
}

interface DataChangeInfo {
  rowId: number,                      // 行号
  type : string,                // ADD : 新增行,default, UPDATE: 修改行，DELETE:删除行
  dataList : DataColumnInfo[] | undefined,  // 该行修改的数据,列数据的对比的集合（新增行与删除行时该属性为空，其数据可通过state.data.datas去获取）
}

// 标记行的修改类型
const ADD = 'ADD';
const UPDATE = 'UPDATE';
const DELETE = 'DELETE';
// 分页相关的属性

const small = ref(false)        // Element-plus的分页控件使用小图标的样式
const background = ref(false)   // Element-plus的分页控件是否使用背景
const disabled = ref(false)     // Element-plus的分页控件是否禁用

export default defineComponent ({
  name : "DataTabPageIndex",
  components : {},
  // props : {
  //   dataModel : {
  //     type: Object as PropType<DataModel>,
  //     // dafault: () => [],
  //   },
  // } , //['dataModel']
  // props :['dataModel'],
  props : {
    dataModel : Object,
    nodePath : String,

    currentPage : Number,
    pageSize : Number,
    pageSizes : Array,
    total : Number,

    // refreshTableDataModel : Function,
  },
  emits : ["refreshTableDataModel", "handleSizeChange", "handleCurrentChange"],
  watch : {
    // 监听父控件中dataModel的变化
    dataModel : {
      immediate : true,
      handler(newValue, oldValue) {
        console.log("监听到父控件的数据变化", oldValue, newValue);
        this.state.inputData = newValue as DataModel;
        if (this.state.inputData) {
          // Object.assign(this.state.data, this.state.inputData!);
          this.state.data = JSON.parse(JSON.stringify(this.state.inputData));
        }
        this.getListHand();
      }
    },
    nodePath : {
      immediate : true,
      handler(newValue, oldValue) {
        this.state.nodePath = newValue;
      }
    }
    // state.data? : {
    //   immediate : true,
    //   handler(newValue, oldValue) {
    //     // console.log("监听到父控件的数据变化", oldValue, newValue);
    //     // this.state.inputData = newValue as DataModel;
    //     // if (this.state.inputData) {
    //     //   // Object.assign(this.state.data, this.state.inputData!);
    //     //   this.state.data = JSON.parse(JSON.stringify(this.state.inputData));
    //     // }
    //     this.getListHand();
    //   }
    // },
  },
  setup(props) {
    
    const state: IState = reactive({
      nodePath : '',
      data :  {} as DataModel,
      inputData : {} as DataModel,
      changeData : [],
      currentGrid : {
        rowId : 0,     // 行ID
        colId : 0,     // 列ID
        val : '',       // 单元格的值
        isHead : undefined  // 是否为表头 
      },
      
      currentPage : ref(props.currentPage!).value,
      pageSize : ref(props.pageSize!).value,
      pageSizes : ref(props.pageSizes!).value as number[],
      total : ref(props.total!).value,
      
    });

    state.nodePath = ref(props.nodePath!).value;
    state.inputData = ref(props.dataModel!).value as DataModel;
    // state.data = JSON.parse(JSON.stringify(state.inputData));
    if (state.inputData) {
      // Object.assign(state.data, state.inputData!);
      state.data = JSON.parse(JSON.stringify(state.inputData));
    }
    
    // const { dataModel } = toRefs(props);
    // state.data = dataModel.value as DataModel;
    // const data : DataModel = ref(props.dataModel!);
    // console.log("是我i", data);

    const getListHand = async () => {
      console.log("封装单元格数据，嵌套添加edit属性");
      state.data?.datas?.forEach((item, index) => {
        item.index = index;
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
        // 设置数据，数据的持久化
        // value.edit = false;
        const colId = state.currentGrid.colId;
        value[colId].edit=false;
        
        // 检查当前行是否已经在state.changeData中
        let changeData = findChangeDataByRowId(value.row_index);
        console.log(changeData)
        if (changeData) {
          // 只修改新数据
          console.log(value, state)
          // value.forEach((element, index) => {
          //   console.log("修改新值:", changeData!.dataList![index].newValue, value[index].value);
          //   changeData!.dataList![index].newValue = value[index].value;
          // });
          for (let i = 0; i < value.length; i++) {
            console.log("修改新值:", value[i].value);
            if (changeData.dataList![i]) {
              changeData.dataList![i].newValue = value[i].value;
            } else {
              changeData.dataList![i] = {
                column : i,
                oldValue : undefined,
                newValue : value[i].value,
              }
            }
            // changeData.dataList![i] = {
            //   colId : number,
            //   oldValue : object,                  // 旧值
            //   newValue : object,                  // 新值
            // };
            // changeData.dataList![i].newValue = value[i].value;
          }
        } else {
          // 为state.changeData添加一个新的修改对象
          let dataColumnInfo : DataColumnInfo[] = [];
          console.log("xxxx", value, state.data?.datas)
          value.forEach((element, index) => {
            let changeColumnInfo : DataColumnInfo = {
              column: index,
              oldValue: state.inputData?.datas[value.row_index][index],
              newValue: element.value,
            } 
            dataColumnInfo.push(changeColumnInfo);
          });
          console.log(dataColumnInfo)
          let updateRow : DataChangeInfo = {
            rowId: value.row_index,
            type: UPDATE,
            dataList: dataColumnInfo
          }
          console.log("修改行:", updateRow)
          state.changeData?.push(updateRow);
        }
        
        console.log("修改后的changeData:", state.changeData);
        console.log("修改data 查看初始数据:", state.inputData);
    };

    const findChangeDataByRowId = (rowId : number) => {
      console.log(state.changeData);
      for (let i = 0; i < state.changeData!.length; i++) {
        if(rowId === state.changeData![i].rowId) {
          return state.changeData![i];
        }
      }
    }
    
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
        findChangeDataByRowId,
        // handleCurrentChange,

        small,
        background,
        disabled,
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
      const idx = this.state.data?.datas.length;
      let obj : string[] = new Array(this.state.data?.dataTypes.length);
      console.log(obj)
      // 根据Type添加,为新增行添加初始数据
      // this.state.data?.columnNames.forEach(p => obj[p.no] = '')
      // this.state.data?.dataTypes.forEach((item, index) => {
      //   obj[index] = '';
      // });
      // this.columnList.forEach(p => obj[p.prop] = '')
      // 在指定的行号上添加一行数据
      this.state.data?.datas.splice(idx, 0, obj);

      let addRow : DataChangeInfo = {
        rowId: idx,
        type: ADD,
        dataList: []
      }
      this.state.changeData?.push(addRow);

      // 修改行的结构，使其添加edit属性，使新添加的列可以被编辑
      for (let i = 0; i < this.state.data?.dataTypes!.length!; i++) {
        console.log("封装单元格数据，嵌套添加edit属性");

        this.state.data!.datas![idx]![i] = {
          value : this.state.data?.datas[idx][i],
          edit: false
        }
      }
      // for(let i in this.state.data?.datas) {
      //   console.log("封装单元格数据，嵌套添加edit属性");

      //   this.state.data!.datas![idx]![i] = {
      //     value : this.state.data?.datas[idx][i],
      //     edit: false
      //   }
      // }
      // this.$refs.dataTable.toggleRowSelection(row);
      console.log("添加新行 ", obj)
    },
    
    delRow() {
      console.log("删除被选中的行. rowID:", this.state.currentGrid.rowId)
      let delRowId = this.state.currentGrid.rowId;
      // console.log(this.state.currentGrid)
      // delRowId != null && this.state.data?.datas.splice(delRowId!, 1)
      let index = -1;
      let changeData : DataChangeInfo;
      for (let i = 0; i < this.state.changeData!.length; i++) {
        if(delRowId === this.state.changeData![i].rowId) {
          changeData = this.state.changeData![i];
          index = i;
        }
      }
      // let changeData = this.findChangeDataByRowId(delRowId);
      if (changeData!) {
        console.log(changeData)
        // 如果delRow的rowId已经在changeData中，且状态为新增(说明删除的是新增的数据，且未持久化)，将其删除
        if (changeData.type == ADD) {
          // 清除展示用的数据
          this.state.data?.datas.splice(changeData.rowId, 1);
          // 清除修改的数据
          this.state.changeData?.splice(index, 1);
          return;
        // 如果delRow的rowId已经在changeData中，且状态为修改，将changeData中旧的删除
        } else if (changeData.type == UPDATE) {
          this.state.changeData?.splice(index, 1);
        }
      }
      let dataColumnInfo : DataColumnInfo[] = [];
      this.state.inputData?.datas[delRowId].forEach((element, index) => {
        let changeColumnInfo : DataColumnInfo = {
          column: index,
          oldValue: element,
          newValue: undefined,
        } 
        dataColumnInfo.push(changeColumnInfo);
      });
      let delRow : DataChangeInfo = {
        rowId: delRowId,
        type: DELETE,
        dataList: dataColumnInfo
      }
      this.state.changeData?.push(delRow);
    },

    saveClick() {
      // TODO 将修改的数据持久化到数据库中
      console.log("保存数据", this.state.changeData)
      let saveData : SaveDataInfo = {
        nodePath : this.state.nodePath,
        columnNames : this.state.data?.columnNames!,
        dataTypes : this.state.data?.dataTypes!,           
        dataChangeInfos : this.state.changeData!,  
      }
      saveTable(saveData).then((responseData) => {
        console.log("saveData 结果", responseData);
        if (responseData.data) {
          // 数据刷新，重新获取数据
          this.$emit("refreshTableDataModel");
          // 刷新UI组件
          this.$forceUpdate;
        }
      });
    },

    cancleClick () {
      console.log("点击取消操作，清空所有的临时数据", this.state)
      // 如果是新增行，因为数据已经通过addRow添加到state.data.datas,因此需要将其删除
      // if (this.state.changeData) {
      //   let changeData = this.state.changeData;
      //   for (let i = changeData.length - 1; i >= 0; i--) {
      //     // 如果是新增行，去掉state.data.datas中新增的数据
      //     if (changeData[i].changeType == 1) {
      //       this.state.data?.datas.splice(changeData[i].rowId - 1, 1)
      //     } else if (changeData[i].changeType == 2) {
      //       // 如果是修改行，将修改还原
      //       console.log("还原旧的数据", changeData[i])
      //       this.state.data?.datas[changeData[i].rowId - 1].forEach((element, index) => {
      //         element.value = changeData[i].dataColumnInfo![index].oldValue;
      //       });
      //     }
      //   }
      // }
      this.state.data = JSON.parse(JSON.stringify(this.state.inputData));
      // Object.assign(this.state.data, this.state.inputData!);
      
      // 清空changeData
      this.state.changeData = []
      console.log(this.state.changeData, this.state.data)
    },

    tableRowClassName ({row , rowIndex}) {
      // console.log("tableRowClassName enter", row, rowIndex)
      row.row_index = rowIndex;
      // 设置行的className，从而修改其样式
      let res = '';
      this.state.changeData?.forEach((r, i) => {
        if (rowIndex == r.rowId) {
          console.log("设置行的className", r, i)
          if (r.type == ADD) {
            res = 'add-row';
          } else if (r.type == UPDATE) {
            res = 'update-row';
          } else if (r.type == DELETE) {
            res = 'delete-row';
          }
        }
      });
      return res;
    }
  }
  
});


</script>
<style>
.el-table .update-row {
  --el-table-tr-bg-color: yellow;
}
.el-table .add-row {
  --el-table-tr-bg-color: pink;
}
.el-table .delete-row {
  --el-table-tr-bg-color: red;
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
  bottom: 0;
  position: fixed;
}
.el-menu-demo {
  bottom: 0;
  position: fixed;
}
</style>