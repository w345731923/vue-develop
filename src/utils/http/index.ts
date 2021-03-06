import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { ElMessageBox, ElMessage } from 'element-plus'

import {
  resultType,
  PureHttpError,
  RequestMethods,
  PureHttpResoponse,
  PureHttpRequestConfig
} from "./types.d";
import { getToken } from "@/utils/auth";
import { router } from '@/router/index'

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  baseURL: '/api/v2',
  // baseURL: "http://192.168.110.117:8088",
  // baseURL: "http://192.168.8.75:8088",
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  withCredentials: true,
  // 数组格式参数序列化
  // paramsSerializer: params => qs.stringify(params, { indices: false })
};

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }
  // 初始化配置对象
  private static initConfig: PureHttpRequestConfig = {};

  // 保存当前Axios实例对象
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  // 请求拦截
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      // (config: PureHttpRequestConfig) => {
      (config: any) => {
        const $config = config;
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        // if (typeof config.beforeRequestCallback === "function") {
        //   config.beforeRequestCallback($config);
        //   return $config;
        // }
        // if (PureHttp.initConfig.beforeRequestCallback) {
        //   PureHttp.initConfig.beforeRequestCallback($config);
        //   return $config;
        // }
        // return $config;
        const token = getToken();
        $config.headers["Authorization"] = "Bearer " + token;

        // if (token) {
        //   $config.headers["Authorization"] = "Bearer " + token;
        // } else {
        //   ElMessage({
        //     message: 'token失效，重新登录',
        //     type: 'error',
        //     duration: 5 * 1000
        //   })
        // }
        return $config;

        // const token = getToken();
        // if (token) {
        //   const data = JSON.parse(token);
        //   const now = new Date().getTime();
        //   const expired = parseInt(data.expires) - now <= 0;
        //   if (expired) {
        //     // token过期刷新
        //     useUserStoreHook()
        //       .refreshToken(data)
        //       .then((res: resultType) => {
        //         config.headers["Authorization"] = "Bearer " + res.accessToken;
        //         return $config;
        //       });
        //   } else {
        //     config.headers["Authorization"] = "Bearer " + data.accessToken;
        //     return $config;
        //   }
        // } else {
        //   return $config;
        // }
      },
      error => {
        return Promise.reject(error);
      }
    );
  }

  // 响应拦截
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResoponse) => {
        // console.log('httpInterceptorsResponse response', response)
        // const $config = response.config;
        // 关闭进度条动画
        // NProgress.done(); 
        // 优先判断post/get等方法是否传入回掉，否则执行初始化设置等回掉
        // if (typeof $config.beforeResponseCallback === "function") {
        //   $config.beforeResponseCallback(response);
        //   return response.data;
        // }
        // if (PureHttp.initConfig.beforeResponseCallback) {
        //   PureHttp.initConfig.beforeResponseCallback(response);
        //   return response.data;
        // }
        const result = response.data;
        if (result.code != 200) {
          if (result.code == 401) {
            ElMessage({
              message: result.message,
              type: 'error',
              duration: 5 * 1000
            })
            router.push('/login')
          } else {
            ElMessage({
              message: result.message || 'Error',
              type: 'error',
              duration: 5 * 1000
            })
          }
          return Promise.reject(new Error(result.message || 'Error'))
        }
        return result;
      },
      (error: PureHttpError) => {
        const $error = error;
        ElMessage({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
        $error.isCancelRequest = Axios.isCancel($error);
        // 关闭进度条动画
        // NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }
  // 通用请求工具函数
  // public request<T>(
  //   url: string,
  //   method: RequestMethods,
  //   param?: AxiosRequestConfig,
  //   axiosConfig?: PureHttpRequestConfig
  // ): Promise<T> {
  //   const config = {
  //     url,
  //     method,      
  //     ...param,
  //     ...axiosConfig
  //   } as PureHttpRequestConfig;

  //   // 单独处理自定义请求/响应回掉
  //   return new Promise((resolve, reject) => {
  //     PureHttp.axiosInstance
  //       .request(config)
  //       .then((response: any) => {
  //         resolve(response);
  //       })
  //       .catch(error => {
  //         reject(error);
  //       });
  //   });
  // }

  public request<T>(
    url: string,
    options?: any
  ): Promise<T> {
    const config = {
      url,
      ...options
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回掉
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: any) => {
          resolve(response);
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  // // 单独抽离的post工具函数
  // public post<T>(
  //   url: string,
  //   params?: T,
  //   params?: T,
  //   config?: PureHttpRequestConfig
  // ): Promise<T> {
  //   return this.request<T>("post", url, params, config);
  // }
  // 单独抽离的post工具函数

  // 单独抽离的get工具函数
  // public get<T>(
  //   url: string,
  //   params?: T,
  //   config?: PureHttpRequestConfig
  // ): Promise<T> {
  //   return this.request<T>("get", url, params, config);
  // }
}

export const http = new PureHttp();
