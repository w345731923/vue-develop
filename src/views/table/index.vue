<template>
  <div class="box">
    <div class="tool-buttons">
      <div class="row-button">
        <el-button size="small" color="#f2f2f2" @click="saveTable">
          <el-icon>
            <Avatar />
          </el-icon>
          保存
        </el-button>
        <el-button v-if="!state.isAdd" size="small" color="#f2f2f2" @click="refreshTableUI">
          <el-icon>
            <Avatar />
          </el-icon>
          刷新
        </el-button>
        <el-button-group v-if="state.tabsActive == 'columns'">
          <el-button size="small" color="#f2f2f2" @click="appendColumnVis(true)">
            <el-icon>
              <Avatar />
            </el-icon>
            添加字段
          </el-button>
          <el-button size="small" color="#f2f2f2" @click="test1">
            <el-icon>
              <Avatar />
            </el-icon>删除字段
          </el-button>
        </el-button-group>
        <el-button-group v-if="state.tabsActive == 'index'">
          <el-button size="small" color="#f2f2f2" @click="appendIndexVis(true)">
            <el-icon>
              <Avatar />
            </el-icon>添加索引
          </el-button>
          <el-button size="small" color="#f2f2f2">
            <el-icon>
              <Avatar />
            </el-icon>删除索引
          </el-button>
        </el-button-group>
        <el-button-group v-if="state.tabsActive == 'foreign'">
          <el-button size="small" color="#f2f2f2" @click="appendForeignVis(true)">
            <el-icon>
              <Avatar />
            </el-icon>添加外键
          </el-button>
          <el-button size="small" color="#f2f2f2">
            <el-icon>
              <Avatar />
            </el-icon>删除外键
          </el-button>
        </el-button-group>
        <el-button-group v-if="state.tabsActive == 'unique'">
          <el-button size="small" color="#f2f2f2" @click="appendUniqueVis(true)">
            <el-icon>
              <Avatar />
            </el-icon>添加唯一键
          </el-button>
        </el-button-group>
        <el-button-group v-if="state.tabsActive == 'check'">
          <el-button size="small" color="#f2f2f2" @click="appendCheckVis(true)">
            <el-icon>
              <Avatar />
            </el-icon>添加检查
          </el-button>
        </el-button-group>
        <el-button-group v-if="state.tabsActive == 'rule'">
          <el-button size="small" color="#f2f2f2" @click="appendRuleVis(true)">
            <el-icon>
              <Avatar />
            </el-icon>添加规则
          </el-button>
        </el-button-group>
        <el-button-group v-if="state.tabsActive == 'exclude'">
          <el-button size="small" color="#f2f2f2" @click="appendExcludeConstraintVis(true)">
            <el-icon>
              <Avatar />
            </el-icon>添加排除
          </el-button>
        </el-button-group>
        <el-button-group v-if="state.tabsActive == 'trigger'">
          <el-button size="small" color="#f2f2f2" @click="appendTriggerVis(true)">
            <el-icon>
              <Avatar />
            </el-icon>添加触发器
          </el-button>
        </el-button-group>
        <el-button-group v-if="state.tabsActive == 'comment'" />
      </div>
    </div>

    <!-- <img src="../assets/database.png" /> -->
    <div class="query-result">
      <el-tabs v-model="state.tabsActive" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="字段" name="columns" style="margin: 0.5rem">
          <ColumnTab :treeData="state.treeData" :tableData="state.fieldList" :visible="state.columnVisible"
            @saveModal="appendColumn" @removeRow="removeColumn" @visableFlag="appendColumnVis" />
        </el-tab-pane>
        <el-tab-pane label="索引" name="index" style="margin: 0.5rem">
          <IndexTab :treeData="state.treeData" :tableData="state.indexList" :visible="state.indexVisible"
            :fieldList="state.fieldList" :tableSpaceList="state.tableSpaceList" @saveModal="appendIndex"
            @removeRow="removeIndex" @visableFlag="appendIndexVis" v-if="state.tabsActive == 'index'" />
        </el-tab-pane>
        <el-tab-pane label="外键" name="foreign" style="margin: 0.5rem">
          <ForeignTab :treeData="state.treeData" :tableData="state.foreignKeyList" :visible="state.foreignVisible"
            :fieldList="state.fieldList" @saveModal="appendForeign" @removeRow="removeForeign"
            @visableFlag="appendForeignVis" v-if="state.tabsActive == 'foreign'" />
        </el-tab-pane>
        <el-tab-pane label="唯一键" name="unique" style="margin: 0.5rem">
          <UniqueTab :treeData="state.treeData" :tableData="state.uniqueConstraintList"
            :tableSpaceList="state.tableSpaceList" :visible="state.uniqueVisible" :fieldList="state.fieldList"
            @saveModal="appendUnique" @removeRow="removeUnique" @visableFlag="appendUniqueVis"
            v-if="state.tabsActive == 'unique'" />
        </el-tab-pane>
        <el-tab-pane label="检查" name="check" style="margin: 0.5rem">
          <CheckTab :tableData="state.checkList" :visible="state.checkVisible" @saveModal="appendCheck"
            @removeRow="removeCheck" @visableFlag="appendCheckVis" v-if="state.tabsActive == 'check'" />
        </el-tab-pane>
        <el-tab-pane label="排除" name="exclude" style="margin: 0.5rem">
          <ExcludeTab :tableData="state.excludeConstraintList" :treeData="state.treeData"
            :tableSpaceList="state.tableSpaceList" :visible="state.excludeConstraintVisible"
            :fieldList="state.fieldList" @saveModal="appendExcludeConstraint" @removeRow="removeExcludeConstraint"
            @visableFlag="appendExcludeConstraintVis" v-if="state.tabsActive == 'exclude'" />
        </el-tab-pane>
        <el-tab-pane label="规则" name="rule" style="margin: 0.5rem">
          <RuleTab :tableData="state.ruleList" :visible="state.ruleVisible" @saveModal="appendRule"
            @removeRow="removeRule" @visableFlag="appendRuleVis" v-if="state.tabsActive == 'rule'" />
        </el-tab-pane>
        <el-tab-pane label="触发器" name="trigger" style="margin: 0.5rem">
          <TriggerTab :treeData="state.treeData" :tableData="state.triggerList" :visible="state.triggerVisible"
            :fieldList="state.fieldList" @saveModal="appendTrigger" @removeRow="removeTrigger"
            @visableFlag="appendTriggerVis" v-if="state.tabsActive == 'trigger'" />
        </el-tab-pane>
        <el-tab-pane label="选项" name="options" style="margin: 0.5rem">
          <el-form label-width="120px">
            <el-form-item>
              <el-checkbox v-model="state.unlogged">无记录</el-checkbox>
            </el-form-item>
            <el-form-item>
              拥有者：<el-select v-model="state.tableOwner" placeholder=" ">
                <el-option v-for="item in state.databaseOwner" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              表空间：<el-select v-model="state.tableSpace" placeholder=" ">
                <el-option v-for="item in state.tableSpaceList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              继承自：<el-select v-model="state.inheritNames" placeholder=" ">
                <el-option v-for="item in state.inheritNamesList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="state.hasOids">有Oids</el-checkbox>
            </el-form-item>
            <el-form-item>
              填充系数：
              <el-input-number v-model="state.fillParam" />
            </el-form-item>
            <el-form-item>集群：<el-select v-model="state.cluster" placeholder=" ">
                <el-option v-for="item in state.clusterList" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注释" name="comment" style="margin: 0.5rem">
          <el-input v-model="state.comment" type="textarea" :rows="20" />
        </el-tab-pane>
        <el-tab-pane label="SQL预览" name="sqlview" style="margin: 0.5rem">
          <el-input v-model="state.sqlpreview" type="textarea" :rows="20" />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
  <template v-if="state.nameVisible">
    <TableNameDialog :visible="state.nameVisible" @saveModal="tableNameSubmit"
      @closeModal="state.nameVisible = false" />
  </template>
</template>

<script lang='ts'>
import { defineComponent, reactive, toRefs, watch, onMounted } from "vue";
import TableNameDialog from "./tableName.vue";
import {
  getDataType, getDatabaseTableSpace, showCreateSQL, showAlterSQL,
  findCusterList, findInheritedSourceTableList, getDatabaseRole,
  getTableDesign
} from "@/api/treeNode";

import { ElMessage } from "element-plus";
import { tableAdd, tableEdit } from "@/api/treeNode";
import { Avatar } from "@element-plus/icons-vue";
import ColumnTab from "@/components/table/columnTab.vue";
import IndexTab from "@/components/table/indexTab.vue";
import ForeignTab from "@/components/table/foreignTab.vue";
import UniqueTab from "@/components/table/uniqueTab.vue";
import CheckTab from "@/components/table/checkTab.vue";
import RuleTab from "@/components/table/ruleTab.vue";
import ExcludeTab from "@/components/table/excludeTab.vue";
import TriggerTab from "@/components/table/triggerTab.vue";



import { TabsPaneContext } from "element-plus";
import {
  TreeNode,
  TableEditForm,
  FieldList,
  IndexList,
  ForeignKeyList,
  UniqueConstraintList,
  CheckList,
  RuleList,
  ExcludeConstraintList,
  TriggerList,
  TableDesignModel, SQLCreatePreview, TableSimple,
} from "@/types";
interface IState {
  tabId: string;
  tabsActive: string | number;
  treeData: TreeNode<TableDesignModel> | undefined;
  nameVisible: boolean;

  oldObject: string;
  oldObjectField: string;
  oldObjectIndex: string;
  oldObjectForeign: string;
  oldObjectUnique: string;
  oldObjectCheck: string;
  oldObjectRule: string;
  oldObjectTrigger: string;
  oldObjectExcludeConstraint: string;
  oldComment: string;
  //选项
  old_unlogged: boolean,//不记录
  old_tableOwner: string,//"postgres"
  old_tableSpace: string,//表空间
  old_inheritNames: string[],//继承自
  old_hasOids: boolean,//有oids
  old_fillParam: number,//填充系数 -1
  old_cluster: string,//集群   

  fieldList: FieldList[];
  indexList: IndexList[];
  foreignKeyList: ForeignKeyList[];
  uniqueConstraintList: UniqueConstraintList[];
  checkList: CheckList[];
  ruleList: RuleList[];
  triggerList: TriggerList[];
  excludeConstraintList: ExcludeConstraintList[];
  comment: string;
  //选项
  unlogged: boolean,//不记录
  tableOwner: string,//"postgres"
  tableSpace: string,//表空间
  inheritNames: string[],//继承自
  hasOids: boolean,//有oids
  fillParam: number,//填充系数 -1
  cluster: string,//集群   

  columnVisible: boolean;
  indexVisible: boolean;
  foreignVisible: boolean;
  uniqueVisible: boolean;
  checkVisible: boolean;
  ruleVisible: boolean;
  triggerVisible: boolean;
  excludeConstraintVisible: boolean;

  isAdd: boolean; //新增还是修改
  databaseOwner: string[];//表空间
  tableSpaceList: string[];//表空间
  inheritNamesList: string[];//继承自列表
  clusterList: string[];//集群列表
  sqlpreview: string;//sql预览
}
export default defineComponent({
  name: "table-design",
  components: {
    Avatar,
    ColumnTab,
    IndexTab,
    ForeignTab,
    UniqueTab,
    CheckTab,
    RuleTab,
    ExcludeTab,
    TriggerTab,
    TableNameDialog,
  },
  props: {
    modifyTitle: Function,
    tabId: {
      type: String,
      default: '',
    },
  },
  emits: ["modifyTitle"],
  setup(props, { emit }) {
    onMounted(() => {
      console.log('table-design onMounted...');
      state.tabId = sessionStorage.getItem("tabId") as string;

      let createSession = sessionStorage.getItem("create-table-session");
      if (createSession) {
        //新建表
        state.treeData = JSON.parse(createSession!) as TreeNode<any>;
        console.log("create-table createSession treeData = ", state.treeData);
        sessionStorage.setItem("create-table-session", "");
      }
      const designSession = sessionStorage.getItem("table-design-session");
      if (designSession) {
        //设计表
        const data = JSON.parse(designSession!) as TreeNode<any>;
        console.log("table-design designSession data = ", data);
        sessionStorage.setItem("table-design-session", "");
        refreshTableDesign(data, data.connectionId!, data.nodePath);
      }
      //查询拥有者
      getDatabaseRole(state.treeData!.connectionId!).then((responseData) => {
        // console.log("getDatabaseRole ResponseData", responseData);
        state.databaseOwner = responseData.data;
      })
      //查询表空间
      getDatabaseTableSpace(state.treeData!.connectionId!).then((responseData) => {
        // console.log("getDatabaseTableSpace ResponseData", responseData);
        state.tableSpaceList = responseData.data;
      })
      //查询继承自
      findInheritedSourceTableList(state.treeData!).then((responseData) => {
        // console.log("findInheritedSourceTableList ResponseData", responseData);
        state.inheritNamesList = responseData.data;
      })
      //查询表集群
      findCusterList(state.treeData!).then((responseData) => {
        // console.log("findCusterList ResponseData", responseData);
        state.clusterList = responseData.data;
      })
    });
    const { tabId } = toRefs(props);
    const state: IState = reactive({
      tabId: tabId.value,
      tabsActive: "columns",
      isAdd: true, //新增还是修改
      oldObject: "", //修改时用的oldObject
      oldObjectField: "", //修改时用的FieldList
      oldObjectIndex: "", //修改时用的IndexList
      oldObjectForeign: "", //foreignKeyList
      oldObjectUnique: "",//唯一键
      oldObjectCheck: "",//检查
      oldObjectRule: "",//规则
      oldObjectExcludeConstraint: "",//排除
      oldObjectTrigger: "",//触发器
      oldComment: '',
      //选项
      old_unlogged: false,//不记录
      old_tableOwner: '',//"postgres"
      old_tableSpace: '',//表空间
      old_inheritNames: [],//继承自
      old_hasOids: false,//有oids
      old_fillParam: -1,//填充系数 -1
      old_cluster: '',//集群   

      treeData: undefined, //树形菜单值
      nameVisible: false, //输入表名称
      databaseOwner: [],
      tableSpaceList: [],
      inheritNamesList: [],
      clusterList: [],

      fieldList: [], //字段列表--fieldList
      indexList: [], //索引列表--indexList
      foreignKeyList: [],//外键列表--foreignKeyList
      uniqueConstraintList: [],//唯一列表--uniqueConstraintList
      checkList: [],//检查列表--checkList
      ruleList: [],//规则列表--checkList
      excludeConstraintList: [],//排除列表--excludeConstraintList
      triggerList: [],//触发器列表--triggerList

      comment: '',
      //选项
      unlogged: false,//不记录
      tableOwner: '',//"postgres"
      tableSpace: '',//表空间
      inheritNames: [],//继承自
      hasOids: false,//有oids
      fillParam: -1,//填充系数 -1
      cluster: '',//集群   

      columnVisible: false, //添加字段
      indexVisible: false, //添加索引
      foreignVisible: false,//添加外键
      uniqueVisible: false,//添加唯一
      checkVisible: false,//添加检查
      ruleVisible: false,//添加规则
      excludeConstraintVisible: false,//排查触发器
      triggerVisible: false,//添加触发器

      sqlpreview: "",
    });

    const handleTabClick = (pane: TabsPaneContext, ev: Event) => {
      state.tabsActive = pane.props.name;
      if ('sqlview' == pane.props.name) {
        if (state.isAdd) {
          const data: SQLCreatePreview = {
            newObject: packageAddData('Untitled'),
            parent: null,
          };
          showCreateSQL(data).then((resp) => {
            state.sqlpreview = resp.data;
          });
        } else {
          const data = packageUpdateData()
          showAlterSQL(data).then((resp) => {
            state.sqlpreview = resp.data;
          });
        }
      }
    };

    const packageAddData = (name: string) => {
      //对象复制
      let target = {} as TreeNode<TableDesignModel>;
      Object.assign(target, state.treeData);

      const data: TableDesignModel = {
        "@clazz": "com.highgo.developer.model.HgdbTable",
        fieldList: state.fieldList,
        indexList: state.indexList,
        foreignKeyList: state.foreignKeyList,
        uniqueConstraintList: state.uniqueConstraintList,
        checkList: state.checkList,
        ruleList: state.ruleList,
        excludeConstraintList: state.excludeConstraintList,
        triggerList: state.triggerList,

        name: name,
        comment: state.comment,
        unlogged: false,//不记录
        tableOwner: '',//"postgres"
        tableSpace: '',//表空间
        inheritNames: [],//继承自
        hasOids: false,//有oids
        fillParam: -1,//填充系数 -1
        cluster: '',//集群   
      };
      target.type = "Table";
      target.object = data;
      return target;
    }
    const packageUpdateData = () => {
      //newObject
      state.treeData!.object.fieldList = state.fieldList;
      state.treeData!.object.indexList = state.indexList;
      state.treeData!.object.foreignKeyList = state.foreignKeyList;
      state.treeData!.object.uniqueConstraintList = state.uniqueConstraintList;
      state.treeData!.object.checkList = state.checkList;
      state.treeData!.object.ruleList = state.ruleList;
      state.treeData!.object.excludeConstraintList = state.excludeConstraintList;
      state.treeData!.object.triggerList = state.triggerList;
      state.treeData!.object.comment = state.comment;
      //选项
      state.treeData!.object.unlogged = state.unlogged;
      state.treeData!.object.tableOwner = state.tableOwner;
      state.treeData!.object.tableSpace = state.tableSpace;
      state.treeData!.object.inheritNames = state.inheritNames;
      state.treeData!.object.hasOids = state.hasOids;
      state.treeData!.object.fillParam = state.fillParam;
      state.treeData!.object.cluster = state.cluster;

      //oldObject
      const oldData = JSON.parse(
        state.oldObject
      ) as TreeNode<TableDesignModel>;
      oldData.object.fieldList = JSON.parse(state.oldObjectField);
      oldData.object.indexList = JSON.parse(state.oldObjectIndex);
      oldData.object.foreignKeyList = JSON.parse(state.oldObjectForeign);
      oldData.object.uniqueConstraintList = JSON.parse(state.oldObjectUnique);
      oldData.object.checkList = JSON.parse(state.oldObjectCheck);
      oldData.object.ruleList = JSON.parse(state.oldObjectRule);
      oldData.object.excludeConstraintList = JSON.parse(state.oldObjectExcludeConstraint);
      oldData.object.triggerList = JSON.parse(state.oldObjectTrigger);
      oldData.object.comment = state.oldComment;
      //选项
      oldData.object.unlogged = state.old_unlogged;
      oldData.object.tableOwner = state.old_tableOwner;
      oldData.object.tableSpace = state.old_tableSpace;
      oldData.object.inheritNames = state.old_inheritNames;
      oldData.object.hasOids = state.old_hasOids;
      oldData.object.fillParam = state.old_fillParam;
      oldData.object.cluster = state.old_cluster;

      const data: TableEditForm = {
        newObject: state.treeData!,
        oldObject: oldData,
      };
      return data;
    }
    const tableNameSubmit = (form: { name: string }) => {
      const target = packageAddData(form.name)
      tableAdd(target).then((resp) => {
        console.log("新建table成功...", resp);
        state.nameVisible = false;
        succElMessage()
        target.nodePath = target.nodePath + '/tableName/' + target.object.name;
        //刷新设计表数据
        refreshTableDesign(resp.data, target.connectionId!, target.nodePath);
        const names = target.nodePath.split("/");
        emit(
          "modifyTitle",
          state.tabId,
          form.name + "@" + names[7] + "." + names[5] + '(' + names[3] + ')'
        );
      });
    };

    //刷新设计表数据
    const refreshTableDesign = (
      resp: TreeNode<TableDesignModel>,
      connectionId: string,
      nodePath: string
    ) => {
      state.isAdd = false;
      resp.nodePath = nodePath;
      resp.connectionId = connectionId;
      //给表格授权RESPONSE值
      state.fieldList = resp.object.fieldList;
      state.indexList = resp.object.indexList;
      state.foreignKeyList = resp.object.foreignKeyList;
      state.uniqueConstraintList = resp.object.uniqueConstraintList;
      state.checkList = resp.object.checkList;
      state.ruleList = resp.object.ruleList;
      state.excludeConstraintList = resp.object.excludeConstraintList;
      state.triggerList = resp.object.triggerList;
      state.comment = resp.object.comment;
      //选项
      state.unlogged = resp.object.unlogged;
      state.tableOwner = resp.object.tableOwner;
      state.tableSpace = resp.object.tableSpace;
      state.inheritNames = resp.object.inheritNames;
      state.hasOids = resp.object.hasOids;
      state.fillParam = resp.object.fillParam;
      state.cluster = resp.object.cluster;

      //保存old数据，用于修改
      state.oldObjectField = JSON.stringify(resp.object.fieldList);
      state.oldObjectIndex = JSON.stringify(resp.object.indexList);
      state.oldObjectForeign = JSON.stringify(resp.object.foreignKeyList);
      state.oldObjectUnique = JSON.stringify(resp.object.uniqueConstraintList);
      state.oldObjectCheck = JSON.stringify(resp.object.checkList);
      state.oldObjectRule = JSON.stringify(resp.object.ruleList);
      state.oldObjectExcludeConstraint = JSON.stringify(resp.object.excludeConstraintList);
      state.oldObjectTrigger = JSON.stringify(resp.object.triggerList);
      state.oldComment = resp.object.comment;
      //选项
      state.old_unlogged = resp.object.unlogged;
      state.old_tableOwner = resp.object.tableOwner;
      state.old_tableSpace = resp.object.tableSpace;
      state.old_inheritNames = resp.object.inheritNames;
      state.old_hasOids = resp.object.hasOids;
      state.old_fillParam = resp.object.fillParam;
      state.old_cluster = resp.object.cluster;

      //清空无用字段，最小化保存字符串
      resp.object.fieldList = [];
      resp.object.indexList = [];
      resp.object.foreignKeyList = [];
      resp.object.uniqueConstraintList = [];
      resp.object.checkList = [];
      resp.object.ruleList = [];
      resp.object.excludeConstraintList = [];
      resp.object.triggerList = [];
      resp.object.childrenModel = [];
      state.oldObject = JSON.stringify(resp);
      //刷新设计表动态数据
      state.treeData = resp;
    };
    /**
     * 保存表
     */
    const saveTable = () => {
      if (state.isAdd) {
        //新增表，输入表名称
        state.nameVisible = true;
      } else {
        tableEdit(packageUpdateData()).then((resp) => {
          console.log("修改table成功...");
          succElMessage()
          if (resp.data) {
            refreshTableDesign(
              resp.data,
              state.treeData!.connectionId!,
              state.treeData!.nodePath!
            );
          }
        });
      }
    };
    /**
     * 刷新页面
     */
    const refreshTableUI = () => {
      console.log(state);
      console.log(state.treeData);
      // const data = state.treeData as TreeNode<any>;
      const data = {} as TreeNode<TableSimple>;
      Object.assign(data, state.treeData);
      getTableDesign(data).then((responseData) => {
        console.log("刷新table成功 ", responseData);
        succElMessage('操作成功');
        if (responseData.data) {
            refreshTableDesign(
              responseData.data,
              state.treeData!.connectionId!,
              state.treeData!.nodePath!
            );
        }
     });
    }
    //===============字段========================
    const appendColumnVis = (flag: boolean) => {
      state.columnVisible = flag;
    };
    const appendColumn = (form: FieldList) => {
      console.log("appendColumn form", form);
      //校验重名
      const nIndex = state.fieldList.findIndex(
        (item) => item.name === form.name
      );
      //判断新增还是修改
      const index = state.fieldList.findIndex((item) => item.oid === form.oid);
      if (nIndex > -1 && nIndex != index) {
        //重名，且不是self，报错
        ElMessage({
          message: "列名称不能相同",
          type: "error",
          duration: 5 * 1000,
        });
        return;
      }

      if (index > -1) {
        const item = state.fieldList[index];
        state.fieldList.splice(index, 1, {
          ...item,
          ...form,
        });
      } else {
        state.fieldList.push(form);
      }
      appendColumnVis(false);
    };
    const removeColumn = (form: FieldList) => {
      const index = state.fieldList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        state.fieldList.splice(index, 1);
      }
      console.log("removeColumn state.fieldList", state.fieldList);
    };
    const test1 = () => {
      // console.log("test1 state", state);
      // getDataType(state.treeData!).then((responseData) => {
      //   console.log("getDataType ResponseData", responseData);
      //   responseData.data.forEach((item, index) => {
      //     const demo: FieldList = {
      //       "@clazz": "com.highgo.developer.model.HgdbField",
      //       oid: -new Date().getTime() - index,
      //       name: "a" + index,
      //       dataType: { name: item.formatName, length: 0, decimalNumber: 0 },
      //       isNotNull: false,
      //       isPrimaryKey: false,
      //       comment: "",
      //       defaultValue: "", //默认
      //       collationSpaceName: "", //规则1-1
      //       collationName: "", //规则1-2
      //     };
      //     state.fieldList.push(demo);
      //   });
      // });
    };
    //=========================索引=====================
    const appendIndexVis = (flag: boolean) => {
      state.indexVisible = flag;
    };
    const appendIndex = (form: IndexList) => {
      console.log("appendIndex form", form);
      //校验重名
      // const nIndex = state.indexList.findIndex(
      //   (item) => item.name === form.name
      // );
      //判断新增还是修改
      const index = state.indexList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        const item = state.indexList[index];
        state.indexList.splice(index, 1, {
          ...item,
          ...form,
        });
      } else {
        state.indexList.push(form);
      }
      appendIndexVis(false);
    };
    const removeIndex = (form: IndexList) => {
      const index = state.indexList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        state.indexList.splice(index, 1);
      }
      console.log("removeIndex state.indexList", state.indexList);
    };

    //=========================外键=====================
    const appendForeignVis = (flag: boolean) => {
      state.foreignVisible = flag;
    };
    const appendForeign = (form: ForeignKeyList) => {
      console.log("appendForeign form", form);
      //判断新增还是修改
      const index = state.foreignKeyList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        const item = state.foreignKeyList[index];
        state.foreignKeyList.splice(index, 1, {
          ...item,
          ...form,
        });
      } else {
        state.foreignKeyList.push(form);
      }
      appendForeignVis(false);
    };
    const removeForeign = (form: ForeignKeyList) => {
      const index = state.foreignKeyList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        state.foreignKeyList.splice(index, 1);
      }
      console.log("removeForeign state.foreignKeyList", state.foreignKeyList);
    };

    //=========================唯一键=====================
    const appendUniqueVis = (flag: boolean) => {
      state.uniqueVisible = flag;
    };
    const appendUnique = (form: UniqueConstraintList) => {
      console.log("appendUnique form", form);
      //判断新增还是修改
      const index = state.uniqueConstraintList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        const item = state.uniqueConstraintList[index];
        state.uniqueConstraintList.splice(index, 1, {
          ...item,
          ...form,
        });
      } else {
        state.uniqueConstraintList.push(form);
      }
      appendUniqueVis(false);
    };
    const removeUnique = (form: UniqueConstraintList) => {
      const index = state.uniqueConstraintList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        state.uniqueConstraintList.splice(index, 1);
      }
      console.log("removeUnique state.uniqueConstraintList", state.uniqueConstraintList);
    };

    //=========================检查=====================
    const appendCheckVis = (flag: boolean) => {
      state.checkVisible = flag;
    };
    const appendCheck = (form: CheckList) => {
      console.log("appendCheck form", form);
      //判断新增还是修改
      const index = state.checkList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        const item = state.checkList[index];
        state.checkList.splice(index, 1, {
          ...item,
          ...form,
        });
      } else {
        state.checkList.push(form);
      }
      appendCheckVis(false);
    };
    const removeCheck = (form: CheckList) => {
      const index = state.checkList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        state.checkList.splice(index, 1);
      }
      console.log("removeCheck state.checkList", state.checkList);
    };
    //========================排除=====================
    const appendExcludeConstraintVis = (flag: boolean) => {
      state.excludeConstraintVisible = flag;
    };
    const appendExcludeConstraint = (form: ExcludeConstraintList) => {
      console.log("appendExcludeConstraint form", form);
      //判断新增还是修改
      const index = state.excludeConstraintList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        const item = state.excludeConstraintList[index];
        state.excludeConstraintList.splice(index, 1, {
          ...item,
          ...form,
        });
      } else {
        state.excludeConstraintList.push(form);
      }
      appendExcludeConstraintVis(false);
    };
    const removeExcludeConstraint = (form: ExcludeConstraintList) => {
      const index = state.excludeConstraintList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        state.excludeConstraintList.splice(index, 1);
      }
      console.log("removeTrigger state.excludeConstraintList", state.excludeConstraintList);
    };
    //=========================规则=====================
    const appendRuleVis = (flag: boolean) => {
      state.ruleVisible = flag;
    };
    const appendRule = (form: RuleList) => {
      console.log("appendRule form", form);
      //判断新增还是修改
      const index = state.ruleList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        const item = state.ruleList[index];
        state.ruleList.splice(index, 1, {
          ...item,
          ...form,
        });
      } else {
        state.ruleList.push(form);
      }
      appendRuleVis(false);
    };
    const removeRule = (form: RuleList) => {
      const index = state.ruleList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        state.ruleList.splice(index, 1);
      }
      console.log("removeRule state.ruleList", state.ruleList);
    };
    //========================触发器=====================
    const appendTriggerVis = (flag: boolean) => {
      state.triggerVisible = flag;
    };
    const appendTrigger = (form: TriggerList) => {
      console.log("appendTrigger form", form);
      //判断新增还是修改
      const index = state.triggerList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        const item = state.triggerList[index];
        state.triggerList.splice(index, 1, {
          ...item,
          ...form,
        });
      } else {
        state.triggerList.push(form);
      }
      appendTriggerVis(false);
    };
    const removeTrigger = (form: TriggerList) => {
      const index = state.triggerList.findIndex((item) => item.oid === form.oid);
      if (index > -1) {
        state.triggerList.splice(index, 1);
      }
      console.log("removeTrigger state.triggerList", state.triggerList);
    };
    const succElMessage = (title = '保存成功') => {
      ElMessage({
        message: title,
        type: "success",
      });
    }
    return {
      state,
      handleTabClick,
      appendColumnVis,
      appendColumn,
      removeColumn,
      saveTable,
      refreshTableUI,
      tableNameSubmit,
      test1,

      appendIndexVis,
      appendIndex,
      removeIndex,

      appendForeignVis,
      appendForeign,
      removeForeign,

      appendUniqueVis,
      appendUnique,
      removeUnique,

      appendCheckVis,
      appendCheck,
      removeCheck,

      appendExcludeConstraintVis,
      appendExcludeConstraint,
      removeExcludeConstraint,

      appendRuleVis,
      appendRule,
      removeRule,

      appendTriggerVis,
      appendTrigger,
      removeTrigger
    };
  },
  data() {
    return {};
  },
});
</script>

<style scoped>
.box {
  margin: 0;
  padding: 0;
  width: 100%;
}

.tool-buttons {
  padding: 4px 4px 8px 4px;
  background-color: #f2f2f2;
}
</style>
