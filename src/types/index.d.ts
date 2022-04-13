
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
}
// export interface TreeNode<T = any> {
//   type: string;//node类型
//   databaseOid: number;
//   serverId: string;
//   object: T;
// }

export interface Login {
  username: string;
  password: string;
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
/**
 * group
 */
export interface TreeNode<T> {
  type: string;//node类型
  databaseOid: number;
  serverId: string;
  object: T;
  connectionId: string;
  children?:TreeNode[];
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
  editDBObjectInfo: {
    newObject: TreeNode<Server>
    oldObject: TreeNode<Server>;
  }
  serverGroupName: string | null;
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
  driverProList?:[];//properties 第一版先不带
  id?:string,
  isRoleLeaf?: boolean;
  displayName?: string;//显示名称    
  serverGlobalInfo?:string,
  defaultDatabase?:string,
  loginInfo?:string,
  sshInfo?:string,//当前版本不支持ssl
  caseModel?: string;
  leaf?: boolean;
  database?: string;
  schema?: string;
  keyString?: string;
}
export interface Database {
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
  driverProList?:[];//properties 第一版先不带
  id?:string,
  isRoleLeaf?: boolean;
  displayName?: string;//显示名称    
  serverGlobalInfo?:string,
  defaultDatabase?:string,
  loginInfo?:string,
  sshInfo?:string,//当前版本不支持ssl
  caseModel?: string;
  leaf?: boolean;
  database?: string;
  schema?: string;
  keyString?: string;
}

// @clazz: "com.highgo.developer.model.HgdbDatabase"
// oid: 13214
// name: "postgres"
// isRoleLeaf: false
// owner: null
// template: null
// encoding: "UTF8"
// collation: "zh_CN.UTF-8"
// characterType: "zh_CN.UTF-8"
// connectionLimit: -1
// description: "default administrative connection database"
// databaseowner: "apache"
// spcname: "pg_default"
// templateName: ""
// datistemplate: false
// datallowconn: true
// isTerminatingDueToNoInputTimeout: false
// displayName: "<strong>postgres</strong>"
// schema: null
// caseModel: "Upper"
// leaf: false
// keyString: null
