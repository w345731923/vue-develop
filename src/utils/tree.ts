
import Node from "element-plus/es/components/tree/src/model/node";
import {
    TreeNode,
} from "@/types";
/**
 * 返回一个nodePath字符串
 * @param { Node } node树形节点
 * @return {String}
 */
export const getNodePath = (node: Node) => {
    const arr: string[] = [];
    getNodeName(arr, node);
    if (arr.length > 0) {
        arr.push('hgdbDeveloper:/');
    }
    return arr.reverse().join('');
};
const getNodeName = (data: string[], node: Node) => {
    if (node.level > 0) {
        const treeData: TreeNode<any> = node.data as TreeNode<any>;
        if (treeData.type == 'ServerGroup') {
            data.push('/serverGroupName/' + treeData.object.name);
        } else if (treeData.type == 'Server') {
            data.push('/serverName/' + treeData.object.name);
        } else if (treeData.type == 'Database') {
            data.push('/databaseName/' + treeData.object.name);
        } else if (treeData.type == 'Schema') {
            data.push('/schemaName/' + treeData.object.name);
        } else if (treeData.type == 'Table') {
            data.push('/tableName/' + treeData.object.name);
        }
        getNodeName(data, node.parent);
    }
}

export const getConnectionId = (node: Node) => {
    const nodeData = node.data as TreeNode<any>;
    const key =
        "connectionId" +
        nodeData.object.userName +
        nodeData.object.id +
        nodeData.object.databaseName;
    return localStorage.getItem(key);
};
/**
 * 根据nodepath获取某个节点的值
 * @param nodePath 
 * @param startName 
 * @param endName 
 * @returns 
 */
const getNodePathObj = (nodePath: string, startName: string, endName: string) => {
    //hgdbdeveloper://serverGroupName/11/serverName/test123/databaseName/postgres/schemaName/public/tableName/a
    //把前面部分截取
    const n = nodePath.substring(16);
    let startIndex = n.indexOf(startName);
    if (startIndex == -1) {
        return ''
    }
    startIndex += startName.length;
    let endIndex = n.indexOf(endName);
    if (endIndex == -1) endIndex = n.length;
    const obj = n.substring(startIndex, endIndex);
    return obj;
};
export const getNodePathServerGroup = (nodePath: string) => {
    return getNodePathObj(nodePath, 'serverGroupName/', '/serverName');
};
export const getNodePathServerName = (nodePath: string) => {
    return getNodePathObj(nodePath, 'serverName/', '/databaseName');
};
export const getNodePathDB = (nodePath: string) => {
    return getNodePathObj(nodePath, 'databaseName/', '/schemaName');
};
export const getNodePathSchema = (nodePath: string) => {
    return getNodePathObj(nodePath, 'schemaName/', '/tableName');
};