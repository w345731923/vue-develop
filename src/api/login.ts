import { http } from "@/utils/http";
import { ResponseData, Login,Register} from '@/types'


/**
 * 登录
 * @param {*} data  {'username':string,'password':string} 
 * @returns 
 */
export async function login(data: Login) {
    return await http.request<ResponseData>('/admin/login', { method: 'POST', data });
}
    // axios({
    //     method: "post",
    //     url: "http://192.168.8.91:8088/springboot-demo/api/v2/root/list",
    //     withCredentials: true,
    //   }).then((res) => {
    //     console.log("数据：", res);
    //   });  
export async function register(data: Register) {
    return await http.request<ResponseData>('/admin/register', { method: 'POST', data });
}
