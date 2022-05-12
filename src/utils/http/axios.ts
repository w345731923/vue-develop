
import { getToken } from "@/utils/auth";
import axios from "axios";

axios.defaults.baseURL = '/api';
// axios.defaults.baseURL = 'http://192.168.8.91:8088/springboot-demo/api/v2';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers["Authorization"] = 
axios.defaults.headers.common['Authorization'] = "Bearer " + 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ3YW5nZGFwZW5nIiwiY3JlYXRlZCI6MTY1MjI1ODI1NTc1NiwiZXhwIjoxNjUyODYzMDU1fQ.yh6AW03xMojRGqvQ0gNnnDadsH6v6caZeIlu19bD6DfctJsrzUWc4gLQlYjdQyxqUK2d3OHqXw-LSLnSzGmxGA';
axios.defaults.withCredentials = true;


// 添加请求拦截器
axios.interceptors.request.use(function (config: any) {
  const $config = config;
  const token = getToken();
  $config.headers["Authorization"] = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiZXhwIjoxOTY3Nzg3MjI1fQ.DUTe0-GiNzO9BgH54vsj1bfgCK4HVuL-HQENjtYpgD0';

  return $config;
  // return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

export default axios