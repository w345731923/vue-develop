import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
import { ElMessageBox, ElMessage } from 'element-plus'
import { ResponseData } from '@/types'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use((config: AxiosRequestConfig) => {
    // if (store.getters.token) {
    //   config.headers['X-Token'] = getToken()
    // }
    return config
},
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// 通用的请求函数
export default async function request<T>(config: AxiosRequestConfig) {
    return service
        .request<ResponseData<T>>(config)
}

// response interceptor
service.interceptors.response.use((response: AxiosResponse): Promise<ResponseData> => {
    const res = response.data;
    console.log('enter response1111', response)
    console.log('enter response2222', res)

    if (res.code !== 200) {
        ElMessage({
            message: res.message || 'Error',
            type: 'error',
            duration: 5 * 1000
        })

        // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        //     // to re-login
        //     ElMessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //         confirmButtonText: 'Re-Login',
        //         cancelButtonText: 'Cancel',
        //         type: 'warning'
        //     }).then(() => {
        //         // store.dispatch('user/resetToken').then(() => {
        //         //     location.reload()
        //         // })
        //     })
        // }
        return Promise.reject(new Error(res.message || 'Error'))
    } else {
        console.log('return res....', res.data);
        return res;
    }
},
    error => {
        console.log('err' + error) // for debug
        ElMessage({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

// export default service
