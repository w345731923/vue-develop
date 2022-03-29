import { http } from "@/utils/http";
import { ResponseData, Login} from '@/types'


/**
 * 登录
 * @param {*} data  {'username':string,'password':string} 
 * @returns 
 */
export async function login(data: Login) {
    return await http.request<ResponseData>('/admin/login', { method: 'POST', data });
}