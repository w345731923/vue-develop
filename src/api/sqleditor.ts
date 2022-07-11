import { http } from "@/utils/http";
import {
    ResponseData, TreeNodeDel, TreeNodeRename, TreeNode, ServerGroupForm
    , ServerGroup, Server
    , Schema, ServerEditForm, Database, ServerPwdForm, DatabaseEditForm, SQLCreatePreview, SQLAlterPreview,
    SchemaEditForm, SQLDropPreview, SqlEditorItemChangeParam, SqlEditorPoll, SqlEditorStatus, SQLEditorExec
} from '@/types'


export async function api_initSQLEditor(data: TreeNode<any>) {
    return await http.request<ResponseData<string>>('/sqleditor/initSQLEditor', { method: 'POST', data });
}
export async function api_formatSQL(data: string) {
    const headers = { 'content-type': 'text/plain' };
    return await http.request<ResponseData<string>>('/sqleditor/formatSQL', { method: 'POST', headers, data });
}
/**
 * 执行SQL
 * @param data 
 * @returns 
 */
export async function api_executeSQL(data: SQLEditorExec) {
    return await http.request<ResponseData<string>>('/sqleditor/executeSQL', { method: 'POST', data });
}
/**
 * 查询全部Server
 * @returns 
 */
export async function api_findAllServer() {
    return await http.request<ResponseData<string[]>>('/sqleditor/findAllServer', { method: 'POST' });
}
/**
 * 切换db节点
 * @returns 
 */
export async function api_findDatabases(data: SqlEditorItemChangeParam) {
    return await http.request<ResponseData<string[]>>('/sqleditor/findDatabases', { method: 'POST', data });
}
/**
 * 切换schema节点
 * @returns 
 */
export async function api_findSchemas(data: SqlEditorItemChangeParam) {
    return await http.request<ResponseData<string[]>>('/sqleditor/findSchemas', { method: 'POST', data });
}
/**
 * 查询SQLEditor执行状态
 * @returns 
 */
export async function api_sqleditorStatus(contextId: string) {
    return await http.request<ResponseData<SqlEditorStatus>>('/sqleditor/status/' + contextId, { method: 'GET' });
}
/**
 * 查询SQLEditor执行结果集
 * @returns 
 */
export async function api_sqleditorPoll(contextId: string) {
    return await http.request<ResponseData<SqlEditorPoll[]>>('/sqleditor/poll/' + contextId, { method: 'GET' });
}
/**
 * SQLEditor点击停止
 * @returns 
 */
 export async function api_sqleditorCancle(contextId: string) {
    return await http.request<ResponseData<SqlEditorPoll[]>>('sqleditor/cancle/' + contextId, { method: 'GET' });
}

/**
 * 切换server节点
 * @returns 
 */
export async function api_changeServerItem(data: SqlEditorItemChangeParam) {
    return await http.request<ResponseData<string>>('/sqleditor/changeServerItem', { method: 'POST', data });
}
/**
 * 切换db节点
 * @returns 
 */
 export async function api_changeDatabaseItem(data: SqlEditorItemChangeParam) {
    return await http.request<ResponseData<string>>('/sqleditor/changeDatabaseItem', { method: 'POST', data });
}
/**
 * 切换server节点
 * @returns 
 */
 export async function api_changeSchemaItem(data: SqlEditorItemChangeParam) {
    return await http.request<ResponseData<SqlEditorPoll[]>>('/sqleditor/changeSchemaItem', { method: 'POST', data });
}
