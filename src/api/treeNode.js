import request from '@/utils/request'

export async function getRoot() {
    return await request({
        url: '/root/list',
        method: 'get',
    })
}