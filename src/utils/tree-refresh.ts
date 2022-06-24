
import Node from "element-plus/es/components/tree/src/model/node";
import {
    ResponseData,
    TreeNode,
    Database,
} from "@/types";
import {
    getServerList,
    getDatabaseList,
    getSchemaList,
    openDatabase,
    getTableList,

} from "@/api/treeNode";
import { getNodePath } from "@/utils/tree";
import {
    defineComponent,
    toRefs,
    computed,
    ref,
    watch,
    Ref,
    watchEffect,
} from "vue";

/**
 * 查询节点展开方法==========================================
 */
interface ExpandList {
    server_open: boolean;
    database_conn: string[];
    paths: string[]
}
export const getExpandList = async (node: Node) => {
    console.log('getExpandList start', node)
    // [
    //   {conn:{},paths:["server_group/1,server/2,coll-database/2,database/20225]},
    //   {conn:{},paths:["server_group/1,server/3,coll-database/2,database/20225]}
    // ]

    const result: ExpandList[] = [];
    let parent: string[] = [];

    //查找选中节点的全部父节点
    getParentNode(node, parent);
    parent = parent.reverse();
    console.log('parent', parent.toString())

    let allPath: string[] = [];
    if (node.data.type == 'ServerGroup') {
        for (let i = 0; i < node.childNodes.length; i++) {
            //遍历的是每个Server
            const childPath: string[] = [];
            Object.assign(childPath, parent)
            console.log('node.childNodes forEach', node.childNodes[i], parent.toString())
            await queryChildrenExpand(node.childNodes[i], childPath, allPath);
            if (allPath.length > 0) {
                console.log('serverGroup push for push ', allPath)
                result.push({
                    server_open: true,
                    database_conn: queryDatabaseOpen(node.childNodes[i]),
                    paths: allPath
                })
                allPath = [];
            }
        }
    } else {
        //非servergroup
        for (let i = 0; i < node.childNodes.length; i++) {
            const childPath: string[] = [];
            Object.assign(childPath, parent)
            console.log('node.childNodes forEach', node.childNodes[i], parent.toString())
            await queryChildrenExpand(node.childNodes[i], childPath, allPath);
        }
        console.log('非servergroup allPath=', allPath)
        if (allPath.length > 0) {
            console.log('非ServerGroup push ', allPath)
            result.push({
                server_open: validateServerOpen(node),
                database_conn: queryDatabaseOpen(node),
                paths: allPath,
            })
        }
    }
    console.log('if判断后 allPath,result', allPath, result)
    //如果没有子节点
    if (allPath.length == 0 && result.length == 0) {
        console.log('没有子节点--------------------', node.data.type)
        allPath.push(parent.join(','))
        result.push({
            server_open: validateServerOpen(node),
            database_conn: queryDatabaseOpen(node),
            paths: allPath
        })
    }
    return result;
}
/**
 * 递归查询展开节点
 * @param child 
 * @param path 
 * @param allPath 
 */
const queryChildrenExpand = async (child: Node, path: string[], allPath: string[]) => {
    console.log('queryChildrenExpand child', getNodeRefreshPath(child), path.toString())
    const pathIndex = path.findIndex(item => item.indexOf(child.data.type + '/') > -1);
    console.log('查询是否分叉', pathIndex, getNodeRefreshPath(child))
    if (pathIndex > -1) {
        path.splice(pathIndex)
    }
    //添加自己
    if (child.expanded) {
        path.push(getNodeRefreshPath(child))
    }
    //查询是否有展开的子节点，如果没有展开的子节点，那么添加到数组里，
    let isChildrenExpand = false;
    for (let i = 0; i < child.childNodes.length; i++) {
        if (child.childNodes[i].expanded) {
            isChildrenExpand = true;
        }
    }
    console.log('查询子节点是否展开=', isChildrenExpand, child.childNodes.length)

    //子节点没有展开，并且子节点个数>0
    if (!isChildrenExpand && child.childNodes.length > 0) {
        console.log('push content ', path.toString())
        allPath.push(path.join(','))
        path = []
    } else {
        if (child.expanded && child.childNodes.length == 0) {
            //子节点有展开，但是子节点是空的
            console.log('子节点有展开，但是子节点是空的 push content ', path.toString())
            allPath.push(path.join(','))
            path = []
        } else {
            console.log('子节点有展开，继续递归', path.toString(), child.childNodes.length)
            for (let i = 0; i < child.childNodes.length; i++) {
                if (child.childNodes[i].expanded) {
                    await queryChildrenExpand(child.childNodes[i], path, allPath)
                }
            }
        }
    }
}
/**
 * 查询数据
 * @param node 
 * @returns 
 */
const queryNodeChildrenData = async (node: Node) => {
    console.log('queryChildren node', node)
    const nodeData = node.data as TreeNode<any>;
    node.data.nodePath = getNodePath(node);
    if (nodeData.type == 'ServerGroup') {
        return await getServerList(nodeData.object.name);
    } else if (nodeData.type == 'Server') {
        return await getDatabaseList(nodeData);
    } else if (nodeData.type == 'SchemaGroup') {
        return await getSchemaList(nodeData)
    } else if (nodeData.type == 'TableGroup') {
        return await getTableList(nodeData)
    } else if (nodeData.type == 'Database') {
        const result: ResponseData<TreeNode<any>[]> = {} as ResponseData<TreeNode<any>[]>;
        const data = [] as TreeNode<any>[];
        data.push({
            type: "SchemaGroup",
            contextId: "",
            nodePath: "",
            connectionId: nodeData.connectionId,
            object: nodeData.object,
            text: "模式",
        });
        result.data = data;
        return result;
    } else if (nodeData.type == 'Schema') {
        const result: ResponseData<TreeNode<any>[]> = {} as ResponseData<TreeNode<any>[]>;
        const data = [] as TreeNode<any>[];
        data.push({
            type: "TableGroup",
            contextId: "",
            nodePath: "",
            connectionId: nodeData.connectionId,
            object: nodeData.object,
            text: "表",
        });
        result.data = data;
        return result;
    }
}

/**
 * 查询节点的第一个父节点
 * @param node 
 * @param parent 
 */
export const getParentNode = (node: Node, parent: string[]) => {
    parent.push(getNodeRefreshPath(node));
    if (node.parent && node.parent.id != 0) {
        //父节点不是id=0的隐藏节点，追加到数组中
        getParentNode(node.parent, parent)
    }
}

/**
 * 节点刷新的路径
 * @param child 
 * @returns 
 */
export const getNodeRefreshPath = (child: Node) => {
    if (child.data.type == 'ServerGroup') {
        return 'ServerGroup/' + child.data.object.name
    } else if (child.data.type == 'Server') {
        return 'Server/' + child.data.object.id
    } else if (child.data.type == 'Database') {
        return 'Database/' + child.data.object.oid
    } else if (child.data.type == 'SchemaGroup') {
        return 'SchemaGroup/' + child.data.object.oid;
    } else if (child.data.type == 'Schema') {
        return 'Schema/' + child.data.object.oid
    } else if (child.data.type == 'TableGroup') {
        return 'TableGroup/' + child.data.object.oid
    } else if (child.data.type == 'Table') {
        return 'Table/' + child.data.object.oid
    }
    return '';
}
/**
 *  验证Server是否打开
 *  只有传入server，并且当前server下有子节点，否则返回false
 * @param node 
 * @returns 
 */
export const validateServerOpen = (node: Node) => {
    if ((node.data.type == 'Server' && node.childNodes.length > 0)
        || (node.data.type != 'Server' && node.data.type != 'ServerGroup')
    ) return true;
    return false;
}
/**
 * 根据Server节点，返回节点下的database是否打开
 * @param node 
 * @returns 
 */
export const queryDatabaseOpen = (node: Node): string[] => {
    const database_conn: string[] = [];
    if (node.data.type == 'ServerGroup') {
        return [];
    } else if (node.data.type == 'Server') {
        //遍历Server下的database是否打开
        for (let index = 0; index < node.childNodes.length; index++) {
            const element = node.childNodes[index];
            if (element.data.connectionId != '' && element.data.connectionId != null) database_conn.push(getNodeRefreshPath(element))
        }
    } else if (node.data.type == 'Database') {
        if (node.data.connectionId != '' && node.data.connectionId != null) database_conn.push(getNodeRefreshPath(node))
    } else {
        //向上查找到database
        const databasePath = findDatabaseNode(node);
        if (databasePath != '') database_conn.push(databasePath)
    }
    return database_conn;
}
/**
 * 传入节点，向上查找返回database节点
 * @param node 
 * @returns 
 */
export const findDatabaseNode = (node: Node): string => {
    if (node.data.type == 'Database') return getNodeRefreshPath(node);
    if (node.parent) return findDatabaseNode(node.parent);
    return '';
}

//===============================节点更新方法====================================
/**
 * 递归核心方法
 * @param child 
 * @param index 
 * @param paths 
 * @param server_open 打开的server
 * @param database_conn 打开的database
 * @param treeRef 树形菜单
 * @returns 
 */
export const coreFun = async (child: Node, index: number, paths: string[], server_open: boolean, database_conn: string[], treeRef: Ref<any>) => {
    console.log('f1>>>>>> type=', child.data.type + ', path=' + paths[index] + ', oid=' + child.data.object.oid)
    console.log('查询节点是否展开', child.data.type + ',expanded =' + child.expanded + ',server_open=' + server_open)
    if (child.data.type == 'Server') {
        if (!server_open) {
            //刷新前没有展开
            return null;
        }
    }
    if (child.data.type == 'Database') {
        console.log('查询Database节点是否需要打开0 ', child.data.object.oid, database_conn)
        // let flag = false;
        // for (let j = 0; j < database_conn.length; j++) {
        //     console.log('查询Database节点  ', 'Database/' + child.data.object.oid, database_conn[j]
        //         , child.data.connectionId == null)
        //     if ('Database/' + child.data.object.oid == database_conn[j]) {
        //         console.log('ok1=========', child.data)
        //         flag = true;
        //         if (child.data.connectionId == null) {
        //             const data = child.data as TreeNode<Database>;
        //             data.nodePath = getNodePath(child);
        //             await openDatabase(data).then((result) => child.data.connectionId = result.data);
        //         }
        //     }
        // }
        // if (!flag) {
        //     console.log('Database不需要打开', getNodeRefreshPath(child))
        //     return null;
        // }        
        const isOpen = await validateOpenDB(child, database_conn);
        if (!isOpen) {
            console.log('Database不需要打开', getNodeRefreshPath(child))
            return null;
        }
    }

    if (!child.expanded) {
        const result = await queryNodeChildrenData(child)
        console.log('子节点查询成功，result =', result)
        //没有展开节点
        await noExpand(child, result, treeRef)
    }
    /**
     * 打开database
     */
    if (child.data.type == 'Server') {
        if (server_open) {
            // const children = child.childNodes;
            // for (let j = 0; j < database_conn.length; j++) {
            //     //如果是打开的Server，遍历database打开数组
            //     for (let index = 0; index < children.length; index++) {
            //         const node = children[index];
            //         if ('Database/' + node.data.object.oid == database_conn[j]
            //             && node.data.connectionId == null) {
            //             console.log('ok0=========', node.data)
            //             const data = node.data as TreeNode<Database>;
            //             data.nodePath = getNodePath(node);
            //             await openDatabase(data).then((result) => node.data.connectionId = result.data);
            //         }
            //     }
            // }
            for (let i = 0; i < child.childNodes.length; i++) {
                const element = child.childNodes[i];
                //解析database是否打开
                if (element.data.type == 'Database') {
                    //一般刷新ServerGroup进此地
                    console.log('查询Database节点是否展开1 ', element.data.object.oid)
                    await validateOpenDB(element, database_conn);
                }
            }
        }
    }
    /**
      * 查询子元素是否需要展开
      * n=0,0是当前自己，所以从1开始
      */
    if (index + 1 >= paths.length) {
        //是最后一个，不操作
        console.log('当前path是最后一个,index=' + index + ',paths.length=', paths.length)
        for (let i = 0; i < child.childNodes.length; i++) {
            const element = child.childNodes[i];
            //解析database是否打开
            if (element.data.type == 'Database') {
                //一般刷新ServerGroup进此地
                console.log('查询Database节点是否展开2 ', element.data.object.oid, paths[index + 1])
                // for (let index = 0; index < database_conn.length; index++) {
                //     if ('Database/' + element.data.object.oid == database_conn[index]
                //         && element.data.connectionId == null) {
                //         console.log('ok2=========', element.data)
                //         const data = element.data as TreeNode<Database>;
                //         data.nodePath = getNodePath(element);
                //         await openDatabase(data).then((result) => element.data.connectionId = result.data);
                //     }
                // }
                await validateOpenDB(element, database_conn);
            }
        }
    } else {
        console.log('查询子元素是否需要展开,index=' + index + ',paths.length=', paths.length + 'children length = ' + child.childNodes.length)
        for (let i = 0; i < child.childNodes.length; i++) {
            await switchDbobject(child.childNodes[i], index + 1, paths, server_open, database_conn, treeRef)
        }
    }
}
/**
 * 验证数据库是否需要打开
 * @param childNodes 
 * @param database_conn 
 * @returns 
 */
const validateOpenDB = async (node: Node, database_conn: string[]) => {
    let isOpen = false;
    //解析database是否打开
    if (node.data.type == 'Database') {
        //一般刷新ServerGroup进此地
        console.log('查询Database节点是否展开2 ', node.data.object.oid)
        for (let index = 0; index < database_conn.length; index++) {
            if ('Database/' + node.data.object.oid == database_conn[index]) {
                console.log('validate open database =========', node.data)
                isOpen = true;
                if (node.data.connectionId == null) {
                    const data = node.data as TreeNode<Database>;
                    data.nodePath = getNodePath(node);
                    await openDatabase(data).then((result) => node.data.connectionId = result.data);
                }
            }
        }
    }
    return isOpen;
}
/**
 * 切换进入不同的对象，进行递归
 */
export const switchDbobject = async (next: Node, index: number, paths: string[], server_open: boolean, database_conn: string[], treeRef: Ref<any>) => {
    console.log('switchDbobject type=', next.data.type + ', path=' + paths[index] + ', oid=' + next.data.object.oid)
    if (next.data.type == 'Server' && paths[index].indexOf(next.data.object.id) > -1) {
        console.log('Server enter,', next)
        await coreFun(next, index, paths, server_open, database_conn, treeRef)
    } else if (next.data.type == 'Database' && paths[index].indexOf(next.data.object.oid) > -1) {
        console.log('Database enter,', next)
        await coreFun(next, index, paths, false, database_conn, treeRef)
    } else if (next.data.type == 'SchemaGroup' && paths[index].indexOf(next.data.object.oid) > -1) {
        console.log('SchemaGroup enter,', next)
        await coreFun(next, index, paths, false, database_conn, treeRef)
    } else if (next.data.type == 'Schema' && paths[index].indexOf(next.data.object.oid) > -1) {
        console.log('Schema enter,', next)
        await coreFun(next, index, paths, false, database_conn, treeRef)
    } else if (next.data.type == 'TableGroup' && paths[index].indexOf(next.data.object.oid) > -1) {
        console.log('TableGroup enter,', next)
        await coreFun(next, index, paths, false, database_conn, treeRef)
    }
}
/**
 * 没有展开节点的处理，移除元素和添加元素
 * @param child 
 * @param result 
 */
const noExpand = (child: Node, result: any, treeRef: Ref<any>) => {
    /**
    * a)移除节点的子节点
    */
    const length = child.childNodes.length;
    console.log('开始移除old节点 childNodes length =', length)
    for (let i = 0; i < length;) {
        child.removeChild(child.childNodes[i])
        if (child.childNodes.length == 0) break;
    }
    /**
     * b)给刷新节点添加获取的新元素
     */
    console.log('移除old节点成功，添加子节点 respon!.data length =', result!.data.length)
    for (let i = 0; i < result!.data.length; i++) {
        treeRef.value.append(result!.data[i], child);
    }
    child.expanded = true;
}


/**
 * 查找当前节点的起始下表
 * @param node 
 * @returns 
 */
export const getPathIndex = (node: Node): number => {
    if (node.data.type == 'ServerGroup') {
        return 0
    } else if (node.data.type == 'Server') {
        return 1
    } else if (node.data.type == 'Database') {
        return 2
    } else if (node.data.type == 'SchemaGroup') {
        return 3
    } else if (node.data.type == 'Schema') {
        return 4
    } else if (node.data.type == 'TableGroup') {
        return 5
    } else if (node.data.type == 'Table') {
        return 6
    } else {
        return 0
    }
}