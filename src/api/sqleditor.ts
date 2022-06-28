import { http } from "@/utils/http";
import {
    ResponseData, TreeNodeDel, TreeNodeRename, TreeNode, ServerGroupForm
    , ServerGroup, Server
    , Schema, ServerEditForm, Database, ServerPwdForm, DatabaseEditForm, SQLCreatePreview, SQLAlterPreview,
    SchemaEditForm, SQLDropPreview, TableSimple, DataType, TableDesignModel, TableEditForm
} from '@/types'


export async function initSQLEditor(data: TreeNode<any>) {
    return await http.request<ResponseData<string>>('/sqleditor/initSQLEditor', { method: 'POST', data });
}