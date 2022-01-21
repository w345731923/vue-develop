import { http } from "@/utils/http";
import { ResponseData, ServerGroup, ServerGroupForm } from '@/types'


export async function getRoot() {
    return await http.request<ResponseData<ServerGroup[]>>('/root/list', { method: 'POST' })
}

/**
 * 添加分组
 * @param {*} data  {'serverGroupName':string} 
 * @returns 
 */
export async function serverGroupAdd(data: ServerGroupForm) {
    const ss = await http.request<ResponseData>('/servergroup/add', { method: 'POST', data });
}