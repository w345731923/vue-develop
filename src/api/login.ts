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
export async function register(data: Register) {
    return await http.request<ResponseData>('/admin/register', { method: 'POST', data });
}
