
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
  children?: TreeNode[];
  index?: number;
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

export interface TableRow {
  id: number,
  column: string;
  type: string,
  length: numnber,
  point: numnber;
  notnull: boolean;
  primary: boolean;
  comment: string;
}
export interface DataType {
  oid: number,//1042
  name: string, "bpchar"
  formatName: string, "character"
  nspname: string, "pg_catalog"
  isCollatable: boolean  //true,可展开
}