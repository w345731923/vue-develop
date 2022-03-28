import { http } from "@/utils/http";
import { ResponseData, TreeNodeDel, TreeNodeRename, TreeNodeServerGroup, ServerGroupForm } from '@/types'


export async function getRoot() {
    return await http.request<ResponseData<TreeNodeServerGroup[]>>('/root/list', { method: 'POST' })
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
 * 添加分组
 * @param {*} data  {'serverGroupName':string} 
 * @returns 
 */
export async function addServerGroup(data: ServerGroupForm) {
    return await http.request<ResponseData>('/servergroup/add', { method: 'POST', data });
}