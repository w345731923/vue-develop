import { http } from "@/utils/http";
import {
    ResponseData, TreeNodeDel, TreeNodeRename, TreeNode, ServerGroupForm
    , ServerGroup, Server
    , Schema, ServerEditForm, Database, ServerPwdForm, DatabaseEditForm, SQLCreatePreview, SQLAlterPreview,
    SchemaEditForm, SQLDropPreview, TableSimple, DataType, TableDesignModel, TableEditForm
} from '@/types'


export async function getRoot() {
    return await http.request<ResponseData<TreeNode<ServerGroup>[]>>('/root/list', { method: 'POST' })
}

/**
 * 删除节点
 * @param data 
 * @returns 
 */
export async function getTreeNodeDel(data: TreeNodeDel) {
    return await http.request<ResponseData>('/deleteNode', { method: 'POST', data });
}
/**
 * 重命名节点
 * @param data 
 * @returns 
 */
export async function getTreeNodeRename(data: TreeNodeRename) {
    return await http.request<ResponseData>('/rename', { method: 'POST', data });
}
/**
 * 新建group
 * @param {*} data  {'serverGroupName':string} 
 * @returns 
 */
export async function addServerGroup(data: ServerGroupForm) {
    return await http.request<ResponseData>('/servergroup/add', { method: 'POST', data });
}

/**
 * 新建server
 * @param {*} data  
 * @returns 
 */
export async function addServer(data: TreeNode<Server>) {
    return await http.request<ResponseData>('/server/add', { method: 'POST', data });
}
/**
 * 修改server
 * @param {*} data  
 * @returns 
 */
export async function editServer(data: ServerEditForm) {
    return await http.request<ResponseData>('/server/edit', { method: 'POST', data });
}
/**
 * 关闭连接
 * @param {*} data  
 * @returns 
 */
export async function closeServer(data: TreeNode<Server>) {
    return await http.request<ResponseData>('/server/close', { method: 'POST', data });
}
/**
 * 测试连接
 * @param {*} data  
 * @returns 
 */
export async function testServer(data: TreeNode<Server>) {
    return await http.request<ResponseData>('/server/testConnect', { method: 'POST', data });
}
/**
 * 修改密码
 * @returns 
 */
export async function updatePassword(data: ServerPwdForm) {
    return await http.request<ResponseData<any>>('/server/updatePassword', { method: 'POST', data });
}
/**
 * 查询group下的server
 * @returns 
 */
export async function getServerList(groupName: string) {
    return await http.request<ResponseData<TreeNode<Server>[]>>('/servergroup/list/' + groupName, { method: 'POST' })
}
/**
 * 给Server节点建立连接，并返回ConnectionID
 * @returns 
 */
export async function serverConnect(data: TreeNode<Server>) {
    return await http.request<ResponseData<TreeNode<Server>[]>>('/server/connect', { method: 'POST', data });
}
/**
 * 查询server下的database
 * @returns 
 */
export async function getDatabaseList(data: TreeNode<Server>) {
    return await http.request<ResponseData<TreeNode<Database>[]>>('/server/list', { method: 'POST', data });
}
/**
 * 新建database
 * @param {*} data  
 * @returns 
 */
export async function addDB(data: TreeNode<Database>) {
    return await http.request<ResponseData>('/database/add', { method: 'POST', data });
}
/**
 * 修改database
 * @param {*} data  
 * @returns 
 */
export async function editDatabase(data: DatabaseEditForm) {
    return await http.request<ResponseData>('/database/edit', { method: 'POST', data });
}
/**
 * 查询database 角色
 * @returns 
 */
export async function getDatabaseRole(connectionID: string) {
    const headers = { 'content-type': 'application/x-www-form-urlencoded' };
    return await http.request<ResponseData<string[]>>('/dbinfo/findRole?connectionID=' + connectionID, {
        method: 'POST', headers
    });
}
/**
 * 查询database 表空间
 * @returns 
 */
export async function getDatabaseTableSpace(connectionID: string) {
    const headers = { 'content-type': 'application/x-www-form-urlencoded' };
    return await http.request<ResponseData<string[]>>('/dbinfo/findTableSpace?connectionID=' + connectionID, {
        method: 'POST', headers
    });
}
/**
 * 查询database 范本
 * @returns 
 */
export async function getDatabaseTempDB(connectionID: string) {
    const headers = { 'content-type': 'application/x-www-form-urlencoded' };
    return await http.request<ResponseData<string[]>>('/dbinfo/findTempDB?connectionID=' + connectionID, {
        method: 'POST', headers
    });
}
/**
 * create sql预览
 * @returns 
 */
export async function showCreateSQL(data: SQLCreatePreview) {
    return await http.request<ResponseData<string>>('/showCreateSQL', { method: 'POST', data });
}
/**
 * alter sql预览
 * @returns 
 */
export async function showAlterSQL(data: SQLAlterPreview) {
    return await http.request<ResponseData<string>>('/showAlterSQL', { method: 'POST', data });
}
/**
 * drop sql预览
 * @returns 
 */
export async function showDropSQL(data: SQLDropPreview) {
    return await http.request<ResponseData<string>>('/showDropSQL', { method: 'POST', data });
}
/**
 * 关闭database
 * @param {*} data  
 * @returns 
 */
export async function closeDatabase(data: TreeNode<Database>) {
    return await http.request<ResponseData>('/database/close', { method: 'POST', data });
}
/**
 * 打开database
 * @param {*} data  
 * @returns 
 */
export async function openDatabase(data: TreeNode<Database>) {
    return await http.request<ResponseData>('/database/connect', { method: 'POST', data });
}
/**
 * 查询database下的schema
 * @returns 
 */
export async function getSchemaList(data: TreeNode<Database>) {
    return await http.request<ResponseData<TreeNode<any>[]>>('/database/list/', { method: 'POST', data });
}
/**
 * 新建schema
 * @param {*} data  
 * @returns 
 */
export async function addSchema(data: TreeNode<Schema>) {
    return await http.request<ResponseData>('/schema/add', { method: 'POST', data });
}
/**
 * 修改schema
 * @param {*} data  
 * @returns 
 */
export async function editSchema(data: SchemaEditForm) {
    return await http.request<ResponseData>('/schema/edit', { method: 'POST', data });
}
/**
 * 查询schema下的table
 * @returns 
 */
export async function getTableList(data: TreeNode<Schema>) {
    return await http.request<ResponseData<TreeNode<TableSimple>[]>>('/schema/listTable', { method: 'POST', data });
}
/**
 * 查询当前连接是否有效(新建表/设计表前的校验)
 * @returns 
 */
export async function checkConnect(connectionID: string) {
    const headers = { 'content-type': 'application/x-www-form-urlencoded' };
    return await http.request<ResponseData<string[]>>('/tool/checkConnect?connectionID=' + connectionID, {
        method: 'POST', headers
    });
}
/**
 * 设计表
 * @returns 
 */
export async function getTableDesign(data: TreeNode<TableSimple>) {
    return await http.request<ResponseData<TreeNode<TableDesignModel>>>('/table/designTable', { method: 'POST', data });
}

/**
 * 清空表
 * @param data 
 * @returns 
 */
export async function apiEmptyTable(data: TreeNode<TableSimple>) {
    return await http.request<ResponseData<TreeNode<TableDesignModel>>>('/table/empty', { method: 'POST', data } )
}

/**
 * 查询数据类型
 * @returns 
 */
export async function getDataType(data: TreeNode<any>) {
    return await http.request<ResponseData<DataType[]>>('/dbinfo/findDataType', { method: 'POST', data });
}
/**
 * 查询数据库排序规则
 * @returns 
 */
export async function getCollation(data: TreeNode<any>) {
    return await http.request<ResponseData<Map<string, string>>>('/dbinfo/findCollation', { method: 'POST', data });
}
/**
 * 新建表
 * @returns 
 */
export async function tableAdd(data: TreeNode<TableDesignModel>) {
    return await http.request<ResponseData<TreeNode<TableDesignModel>>>('/table/add', {
        timeout: 25000,
        method: 'POST', data
    });
}
/**
 * 修改表
 * @returns 
 */
export async function tableEdit(data: TableEditForm) {
    return await http.request<ResponseData<TreeNode<TableDesignModel>>>('/table/edit', {
        timeout: 25000,
        method: 'POST', data
    });
}
/**
 * 查询database下的schema的列表string[]
 * @returns 
 */
 export async function findSchema(data: TreeNode<any>) {
    return await http.request<ResponseData<string[]>>('/dbinfo/findSchema', { method: 'POST', data });
}
/**
 * 查询schema下的table的列表string[]
 * @returns 
 */
 export async function findTable(data: TreeNode<any>) {
    return await http.request<ResponseData<string[]>>('/dbinfo/findTable', { method: 'POST', data });
}
/**
 * 查询table下的table的列表field[]
 * @returns 
 */
 export async function findField(data: TreeNode<any>) {
    return await http.request<ResponseData<string[]>>('/dbinfo/findField', { method: 'POST', data });
}
/**
 * 设计表-触发器-触发函数
 * @returns 
 */
 export async function findTriggerFunctionMap(data: TreeNode<any>) {
    return await http.request<ResponseData<Map<string, string>>>('/dbinfo/findTriggerFunctionMap', { method: 'POST', data });
}
/**
 * 设计表-触发器-参考表
 * @returns 
 */
 export async function findReferTableMap(data: TreeNode<any>) {
    return await http.request<ResponseData<Map<string, string>>>('/dbinfo/findReferTableMap', { method: 'POST', data });
} 
/**
 * 查询table下的集群
 * @returns 
 */
 export async function findCusterList(data: TreeNode<any>) {
    return await http.request<ResponseData<string[]>>('/dbinfo/findCusterList', { method: 'POST', data });
}
/**
 * 查询table下的继承自
 * @returns 
 */
 export async function findInheritedSourceTableList(data: TreeNode<any>) {
    return await http.request<ResponseData<string[]>>('/dbinfo/findInheritedSourceTableList', { method: 'POST', data });
}
/**
 * 设计表-排除约束-索引方法，不同的索引方法存在不同的运算符类别模式，key是索引方法，value是模式
 * @returns 
 */
 export async function findIndexTypeToOpClassSchema(data: TreeNode<any>) {
    return await http.request<ResponseData<Map<string, string>>>('/dbinfo/findIndexTypeToOpClassSchema ', { method: 'POST', data });
}
/**
 * 设计表-排除-元素-运算符类别,key为schema，value是类别
 * @returns 
 */
 export async function findOpClassName(data: TreeNode<any>) {
    return await http.request<ResponseData<Map<string, string>>>('/dbinfo/findOpClassName ', { method: 'POST', data });
}
/**
 * 设计表-排除-元素-运算符，key是运算符模式，value是运算符
 * @returns 
 */
 export async function findSchemaToOperatorMap(data: TreeNode<any>) {
    return await http.request<ResponseData<Map<string, string>>>('/dbinfo/findSchemaToOperatorMap ', { method: 'POST', data });
}