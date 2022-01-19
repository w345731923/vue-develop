import request from '@/utils/request'

export async function getRoot() {
    return await request({
        url: '/root/list',
        method: 'get',
    })
}

/**
 * 添加分组
 * @param {*} data  {'serverGroupName':string} 
 * @returns 
 */
export async function serverGroupAdd(data) {
    return await request({
        url: '/servergroup/add',
        method: 'post',
        data
    })
}