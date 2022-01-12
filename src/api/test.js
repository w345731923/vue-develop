import request from '@/utils/request'

export async function getList() {
    return await request({
        url: 'http://192.168.8.144:8080/sdnu-edu-api/course/getCourseDetail/6',
        method: 'get',
    })
}