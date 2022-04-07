
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
}
export interface ServerGroup {
  oid: number;
  name: string;
  class: string;
  isRoleLeaf: boolean;
  displayName: string | undefined;
  keyString: string;
  schema: string;
  caseModel: string;
  leaf: boolean;
  database: string;
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
  newObject: ServerObject
}
/**
 * 修改server
 */
export interface ServerEditForm {
  editDBObjectInfo: {
    newObject: ServerObject
    oldObject: ServerObject;
  }
  serverGroupName: string | null
}
export interface ServerObject {
  connectionId: string,
  databaseOid: number,
  object: Server,
  serverId: string,
  type: string,
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
}
