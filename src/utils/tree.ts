
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
