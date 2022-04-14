import { http } from "@/utils/http";
import {
    ResponseData, TreeNodeDel, TreeNodeRename, TreeNode, ServerGroupForm
    , ServerGroup, Server
    , ServerForm, ServerEditForm,DatabaseForm
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
export async function addServer(data: ServerForm) {
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
 * 测试server
 * @param {*} data  
 * @returns 
 */
export async function testServer(data: TreeNode<Server>) {
    return await http.request<ResponseData>('/server/testConnect', { method: 'POST', data });
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
    return await http.request<ResponseData<TreeNode<Server>[]>>('/server/list', { method: 'POST', data });
}
/**
 * 新建server
 * @param {*} data  
 * @returns 
 */
 export async function addDB(data: DatabaseForm) {
    return await http.request<ResponseData>('/database/add', { method: 'POST', data });
}