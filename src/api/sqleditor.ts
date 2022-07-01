import { http } from "@/utils/http";
import {
    ResponseData, TreeNodeDel, TreeNodeRename, TreeNode, ServerGroupForm
    , ServerGroup, Server
    , Schema, ServerEditForm, Database, ServerPwdForm, DatabaseEditForm, SQLCreatePreview, SQLAlterPreview,
    SchemaEditForm, SQLDropPreview, TableSimple, DataType, TableDesignModel, SQLEditorExec
} from '@/types'


export async function initSQLEditor(data: TreeNode<any>) {
    return await http.request<ResponseData<string>>('/sqleditor/initSQLEditor', { method: 'POST', data });
}
export async function formatSQL(data: string) {
    const headers = { 'content-type': 'text/plain' };
    return await http.request<ResponseData<string>>('/sqleditor/formatSQL', { method: 'POST', headers, data });
}
/**
 * 执行SQL
 * @param data 
 * @returns 
 */
export async function executeSQL(data: SQLEditorExec) {
    return await http.request<ResponseData<string>>('/sqleditor/executeSQL', { method: 'POST', data });
}