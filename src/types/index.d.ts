
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface Login {
  username: string;
  password: string;
}
export interface Register {
  username: string;
  password: string;
  password1?: string;
  email: string;
}
/**
 * 动态tab页
 */
export interface EditableTabs {
  name: string;
  title: string;
  currentView: any;
}

export interface LoginResp {
  tokenHead: string;
  token: string;
}

export interface TreeNodeDel<T = any> {
  delObject: T;
  deleteOptions: { isCascadeDelete: boolean }
}

export interface TreeNodeRename<T = any> {
  dbObject: T;
  newName: string;
}
export interface DropDownMenu {
  key: number;
  text: string;
  disabled: boolean;
  onClick: Function
}
/**
 * 树形菜单
 */
export interface TreeNode<T> {
  text?: string;//工具栏显示名称
  type: string;//node类型
  contextId: string,//SQL编辑器
  nodePath: string,  //node整体路径
  object: T;
  connectionId: string | null;
  defConnectionId?: string;
  children?: TreeNode[];
  expanded?: boolean;//是否展开
  ex?: boolean;//是否存在，刷新时，old与new对比使用
}
/**
 * SQL编辑器，执行对象
 */
export interface SQLEditorExec extends TreeNode {
  sql: string,//SQL编辑器中传入的待执行SQL
  isExplain?: boolean,//"true: 返回执行计划； false：直接执行SQL"
  running?: boolean,//(true: 后端的SQL尚未执行结束； false:后端的SQL执行结束
}
//create SQL预览
export interface SQLCreatePreview<T = any, S = any> {
  newObject: T;
  parent: S;
}
//alter SQL预览
export interface SQLAlterPreview<T = any> {
  newObject: T;
  oldObject: T;
}
//drop SQL预览
export interface SQLDropPreview<T = any> {
  delObject: T;
  deleteOptions: {
    isCascadeDelete: boolean;
  }
}
export interface ServerGroup {
  '@clazz': string;
  oid?: number;
  name: string;
  isRoleLeaf?: boolean;
  displayName?: string;//显示名称
  caseModel?: string;
  leaf?: boolean;
  database?: string;
  schema?: string;
  keyString?: string;
}
//新建group
export interface ServerGroupForm {
  serverGroupName: string;
}
/**
 * 新建server
 */
export interface ServerForm {
  parent: TreeNode<ServerGroup> | null;
  newObject: TreeNode<Server>
}
/**
 * 修改server
 */
export interface ServerEditForm {
  newObject: TreeNode<Server>
  oldObject: TreeNode<Server>;
}

export interface Server {
  '@clazz': string;
  oid: string,
  name: string,//连接名
  hostAddress: string,
  port: number,
  databaseName: string,
  userName: string,
  password: string,
  isSavePassword: boolean,//记住密码
  isHGSE: boolean,//是否安全版
  isShowTemplateDb: boolean,//显示范本数据库
  isShowSystemSchema: boolean,//显示系统模式
  caseModel: string,//数据库默认大写 Uppper Lower
  useSSL: boolean,//开启ssl
  sslModel: string,//ssl模式
  sslKeyPath: string,//客户端密钥
  sslCrtPath: string,//客户端证书
  rootCrtPath: string,//根证书
  driverProList?: [];//properties 第一版先不带
  id?: string,
  isRoleLeaf?: boolean;
  displayName?: string;//显示名称    
  serverGlobalInfo?: string,
  defaultDatabase?: string,
  loginInfo?: string,
  sshInfo?: string,//当前版本不支持ssl
  leaf?: boolean;
  database?: string;
  schema?: string;
  keyString?: string;
}
export interface ServerPwdForm {
  newPassword: string,
  oldPassword: string,
  newPassword1?: string,
  nodePath: string,
}
/**
 * 修改Database
 */
export interface DatabaseEditForm {
  newObject: TreeNode<Database>
  oldObject: TreeNode<Database>;
}
export interface Database {
  '@clazz': string;
  oid?: string,
  name: string,//数据库名
  encoding: string;//编码 "UTF8"
  collation: string;//排序规则排序  "zh_CN.UTF-8"
  characterType: string;//字符分类  "zh_CN.UTF-8"
  connectionLimit: numnber;//连接限制 -1
  description: string;//注释
  databaseowner: string;//拥有者
  spcname: string;//表空间  "pg_default"
  templateName: string;//范本
  datistemplate: boolean;//是范本
  datallowconn: boolean;//允许连接
  isTerminatingDueToNoInputTimeout?: boolean;//
  displayName?: string;//显示html名称  
  isRoleLeaf?: boolean;
  caseModel?: string;
  leaf?: boolean;
  schema?: string;
  keyString?: string;
  connectionId?: string;//临时变量
}
export interface Schema {
  '@clazz': string;
  oid?: string,
  name: string,//数据库名
  describe: string;//注释
  rolname?: string;//角色
  displayName?: string;//显示html名称  
  isRoleLeaf?: boolean;
  caseModel?: string;
  leaf?: boolean;
  keyString?: string;
}
export interface SchemaEditForm {
  newObject: TreeNode<Schema>
  oldObject: TreeNode<Schema>;
}
export interface TableSimple {
  '@modelClass': string;
  oid: string,
  name: string,
  acl: string;
  tableOwner: string;//拥有者
  tableSpace: string;//表空间
}

//全部的数据类型
export interface DataType {
  oid: number,//1042
  name: string, "bpchar"
  formatName: string, "character"
  nspname: string, "pg_catalog"
  isCollatable: boolean  //true,可展开
}

export interface FieldList {
  '@clazz': string;//"com.highgo.developer.model.HgdbTable"
  oid: number,
  name: string,//"id"  字段名
  dataType: FieldDataType,
  isNotNull: boolean,//是否不为NULL
  isPrimaryKey: boolean,//是否主键
  pkEnabled?: boolean,
  comment: string,//注释
  collationSpaceName: string,//排序规则1-1
  collationName: string,//排序规则1-2
  defaultValue: string,//默认
  dimension?: number,//0
  foreignColumn?: undefined,
  ordinalPosition?: number,//1，字段排序下标
  completionShowValue?: string,//"public.c1.id"
  keyString?: string,//"HgdbField{ordinalPosition=1}"
  displayName?: string //"id"
}
//FieldList对象中的数据类型
export interface FieldDataType {
  name: string,//"integer"
  length: number,//32
  decimalNumber: number// 0  
}

export interface TableDesignModel {
  parent?: undefined;//{oid: 0, name: "public", isRoleLeaf: false, describe: null, rolname: null, displayName: "public",…}
  '@clazz': string;//"com.highgo.developer.model.HgdbTable"
  name: string,//表名
  hastriggers?: boolean,//false
  foreignTableOptions?: [];
  primaryConstraintName?: string;//c1_pkey
  fieldList: FieldList[],//字段列表
  indexList: IndexList[];//索引
  foreignKeyList: foreignKeyList[],//外键
  uniqueConstraintList: UniqueConstraintList[],//唯一键
  checkList: checkList[],//检查list
  ruleList: RuleList[];//规则RuleList
  excludeConstraintList: ExcludeConstraintList[],//排除list
  triggerList: TriggerList[],//触发器
  //选项
  unlogged: boolean,//不记录
  tableOwner: string,//"postgres"
  tableSpace: string,//表空间
  inheritNames: string[],//继承自
  hasOids: boolean,//有oids
  fillParam: number,//填充系数 -1
  cluster: string,//集群  
  comment: string,//表注释  

  acl?: string,
  hasPartition?: boolean,//是否分区
  oid?: number,
  reltuples?: number,//0
  partitionList?: [],//[]
  foreignServerType?: [],//null
  custerList?: string,
  hasindexes?: boolean,
  isForeignTable?: number,//是否外部表
  foreignTableOptionsShow?: string,
  roleChildrenModel?: [],
  partitionKeyList?: [],
  roleList?: [],
  hasrules?: boolean,
  partitionType?: string,
  isRoleLeaf?: boolean,
  foreignServerOption?: string,
  childrenModel?: [],
  tableSpaceList?: string,

  partitionDef?: string,
  foreignServerName?: string,
}
/**
 * 修改Table
 */
export interface TableEditForm {
  newObject: TreeNode<TableDesignModel>
  oldObject: TreeNode<TableDesignModel>;
}
//表-索引
export interface IndexList {
  '@clazz': string;//"com.highgo.developer.model.HgdbIndex"
  oid: number,
  name: string,//索引名 "index_a2_t1"
  columns: string,//索引字段，""1","444""
  columnsT?: string[],//临时使用，索引字段转换
  indexType: string,//索引方法  btree
  isUnique: boolean,//唯一键
  isClustered: boolean,//并发
  comment: string,//注释
  tableSpaceName: string,//表空间 pg_default
  reloptions: number,//填充系数
  constraint: string,//条件 "1 = 1"
  expression?: string,//表达式
  childrenModel?: [],
  roleChildrenModel?: [],
}
//表-外键
export interface ForeignKeyList {
  '@clazz': string;//"com.highgo.developer.model.HgdbForeignKey"
  oid: number,
  name: string,//外键名 "index_a2_t1"
  foreignKeyFields: string[],//外键字段，["fl1_id","fl1_id1"]
  referencesSchemaName: string,//参考模式
  referencesTableName: string,//参考表
  referencesFields: string[],//参考字段 ["fl1_id","fl1_id1"]
  updateStretegy: string,//删除时
  deleteStrategy: string,//更新时
  comment: string,//注释
  isMatchFull: boolean,//符合全部
  isDeferrable: boolean,//可搁置  false-NOT DEFERRABLE true-DEFERRABLE 
  isDeferred: boolean,//搁置 false-INITIALLY IMMEDIATE  true-INITIALLY DEFERRED

  confkeys?: string[],
  referencesFieldsTemp?: string[],
  isDeferrableTemp?: string,
  isDeferredTemp?: string,
}
//表-唯一
export interface UniqueConstraintList {
  '@clazz': string;//"com.highgo.developer.model.HgdbUniqueConstraint"
  oid: number,
  name: string,//唯一键约束名 "index_a2_t1"
  includeFieldNames: string[],//字段["fl1_id"]
  comment: string,//注释
  tableSpaceName: string,//表空间
  fillFactor: number,//填充系数 -1
  isDeferrable: boolean,//可搁置
  isDeferred: boolean,//搁置
  isDeferrableTemp?: string,//临时存储可搁置
  isDeferredTemp?: string,  //临时存储搁置
}
//表-检查
export interface CheckList {
  '@clazz': string;//"com.highgo.developer.model.HgdbCheck"
  oid: number,
  name: string,//检查约束名 "fl2_check_1"
  checkExpression: string,//表达式(1 = 1)
  isNoInherit: boolean,//没有继承
  comment: string,//注释
}

//表-规则
export interface RuleList {
  '@clazz': string;//"com.highgo.developer.model.HgdbRule"
  oid: number,
  name: string,//检查约束名 "fl2_check_1"
  ruleEvent: string,//事件INSERT
  isInstead: boolean,//代替运行
  isEnabled: boolean,//启用
  comment: string,//注释
  whereCondition: string,//条件 "(1 = 1)"
  command: string,//定义
}
//表-排除
export interface ExcludeConstraintList {
  '@clazz': string;//"com.highgo.developer.model.HgdbExcludeConstraint"
  oid: number,
  name: string,//检查约束名 "fl2_check_1"
  indexType: string,//索引方法  btree
  tableSpace: string,//表空间
  fillFactor: number,//填充系数 -1
  buffering: string,//缓存
  wherePredicate: string,//条件 "(1 = 1)"
  isDeferrable: boolean,//可搁置
  isDeferred: boolean,//搁置
  comment: string,//注释
  excludeConstraintElements: ExcludeConstraintElements[],

  elements?: string,//存储元素临时变量
  conindid?: number,
  isDeferrableTemp?: string,
  isDeferredTemp?: string,
}
//表-排除-元素
export interface ExcludeConstraintElements {
  '@clazz': string;//"com.highgo.developer.model.HgdbExcludeConstraintElement"
  elementName: string,//字段 id
  opsTypeSchema: string,//运算符类别模式 pg_catalog
  opsType: string,//运算符类别 varchar_pattern_ops
  sortType: string,//排序 ASC DESC
  sortNull: string,//nulls排序 null first
  opsSchema: string,//运算符模式 pg_catalog
  ops: string,//运算符 =

  id?: number;//标识列
  isChoosed?: boolean,
  cm?: string,
}

//表-触发器
export interface TriggerList {
  '@clazz': string;//"com.highgo.developer.model.HgdbTrigger"
  oid: number,
  name: string,
  forEach: string,//给每个 "ROW"
  fireTime: string,//触发 "AFTER"
  triggerEvents: string[],// ["INSERT", "TRUNCATE"]  插入INSERT 更新UPDATE 删除DELETE 截断TRUNCATE 
  updateColumns: string[],//更新字段["fl1_id,id"]
  isEnabled: boolean,//启用
  comment: string,//注释
  condition: string,//当
  functionSchema: string,//触发函数1 "pg_catalog"
  functionName: string,//触发函数2 RI_FKey_check_ins
  functionParams: string,//引数
  hasConstraint: boolean,//约束
  isDeferrable: boolean,//可搁置
  isDeferred: boolean,//搁置
  referencedTableSchema: string,//参考表1
  referencedTable: string,//参考表2

  triggerEventsTemp?: string[],
  isDeferrableTemp?: string,//可搁置临时变量
  isDeferredTemp?: string,//搁置临时变量
}


// functionParams: ""
// isInternal: true
// condition: ""

// 打开表 
// TODO 如果是打开视图/物化视图 未调查是否也使用该接口
export interface FetchDataInfoForm {
  // tableInfo : TreeNode<TableSimple>,    // 被选中要打开的Table对象
  nodePath: string,                     //node整体路径
  filterColumnList: string[],          // 过滤，用来显示的字段
  condition: string,                // SQL where
  limitNum: number,                    // SQL limit
  offsetNum: number,                   // SQL offset
}

export interface CountDataForm {
  nodePath: string,                     //node整体路径
  condition: string,                // SQL where
}

// DataModel,返回包括打开表、视图、物化视图 以及 SQLEditor可能返回的结果集
export interface DataModel {
  executeSQL: string,
  columnNames: string[],
  dataTypes: BaseDataType[],
  // datas : object[][],
  datas: Array,
  isNoMoreResult: boolean,
  maxRows: number,
  nowLastRows: number,
  offsetSize: number,
}

export interface BaseDataType {
  name: string
  decimalNumber: number,
  imageUrl: string,
  length: number,
}

export interface SaveDataInfo {
  nodePath : string,                    // nodePath，表路径
  columnNames : string[],               // 列名的链表
  dataTypes : BaseDataType[],           // 列类型的链表
  dataChangeInfos : DataChangeInfo[],   // 修改的数据，包括增/删/改的数据
}

//==============SQLEditor=============
export interface SqlEditorStatus {
  message: string
  status: string,
}
export interface SqlEditorPoll {
  dataModel: DataModel
  duration: number,
  errCode: number,
  errMsg: string,
  fetch_end: number,
  fetch_start: number,
  point: number,
  sql: string,
}
//切换Server
export interface SqlEditorItemChangeParam {
  autoCommit: boolean,
  contextId: string,//SQL编辑器的ID
  newServerItem: string | null,//在SQL编辑器中切换Database下拉框后选中的值
  newDatabaseItem: string | null,//在SQL编辑器中切换Schema下拉框后选中的值
  newSchemaItem: string | null,//在SQL编辑器中切换Server下拉框后选中的值
}