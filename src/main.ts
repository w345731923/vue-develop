import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
// import 'element-plus/lib/theme-chalk/index.css'
import 'element-plus/dist/index.css'
import './main.css'
import { router } from './router/index'
import { getToken } from "@/utils/auth";
import { ElMessage } from 'element-plus'
import TableCreate from './components/table/index.vue'


//  判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
    const token = getToken();
    if (token) {
        return next();
    } else {
        if (to.path == '/login') {
            return next();
        }

        ElMessage({
            message: 'token失效，重新登录',
            type: 'error',
            duration: 5 * 1000
        })
        next({
            path: '/login',
        })

    }
})

const app = createApp(App);
app.component('table-create', TableCreate);
app.use(router).use(ElementPlus).mount('#app');








