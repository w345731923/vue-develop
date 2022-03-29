
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
  dbObject: T;
}

export interface TreeNodeRename<T = any> {
  dbObject: T;
  newName: string;
}

export interface TreeNodeServerGroup {
  type: string;//node类型
  databaseOid: number;
  serverId: string;
  object: ServerGroup;
}
export interface ServerGroup {
  oid: number;
  name: string;
  class: string;
  isRoleLeaf: boolean;
  displayNmae: string;
  keyString: string;
  schema: string;
  caseModel: string;
  leaf: boolean;
  database: string;
}
export interface ServerGroupForm {
  serverGroupName: string;
}
