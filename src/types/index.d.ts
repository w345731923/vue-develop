
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

export interface TreeNode<T> {
  text?: string;//工具栏显示名称
  type: string;//node类型
  contextId: string,//SQL编辑器
  nodePath: string,  //node整体路径
  object: T;
  connectionId: string | null;
  defConnectionId?: string;
  children?: TreeNode[];
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
  caseModel?: string;
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
  cluster?: number,
  parent?: undefined;//{oid: 0, name: "public", isRoleLeaf: false, describe: null, rolname: null, displayName: "public",…}
  '@clazz': string;//"com.highgo.developer.model.HgdbTable"
  hastriggers?: boolean,//false
  foreignTableOptions?: [];
  primaryConstraintName?: string;//c1_pkey
  ruleList?: [];//[]
  indexList: IndexList[];//[]
  acl?: string,
  hasPartition?: boolean,
  oid?: number,
  reltuples?: number,//0
  partitionList?: [],//[]
  foreignServerType?: [],//null
  isLeaf?: boolean,//false
  triggerList?: [],//触发器
  custerList?: string,
  hasindexes?: boolean,
  inheritNames?: string,
  fieldList: FieldList[],//字段列表
  isForeignTable?: number,//是否外部表
  foreignTableOptionsShow?: string,
  roleChildrenModel?: [],
  partitionKeyList?: [],
  excludeConstraintList?: [],
  hasOids?: boolean,
  fillParam?: number,
  roleList?: [],
  hasrules?: boolean,
  partitionType?: string,
  foreignKeyList: foreignKeyList[],
  uniqueConstraintList: UniqueConstraintList[],
  isRoleLeaf?: boolean,
  tableSpace?: string,
  foreignServerOption?: string,
  unlogged?: boolean,
  tableOwner?: string,//"postgres"
  childrenModel?: [],
  tableSpaceList?: string,
  checkList?: [],
  name: string,//表名
  comment: string,//表注释
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
  tablespaceName: string,//表空间 pg_default
  reloption: number,//填充系数
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
  isDeferrableTemp?:string,
  isDeferredTemp?:string,
}
//表-唯一
export interface UniqueConstraintList {
  '@clazz': string;//"com.highgo.developer.model.HgdbForeignKey"
  oid: number,
  name: string,//外键名 "index_a2_t1"
  comment: string,//注释

}




