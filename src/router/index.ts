
import { createRouter, createWebHistory, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Home from '../layout/index.vue'
import Login from '../views/login/index.vue'
import Register from '../views/register/index.vue'

const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: Home
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
]
export const router = createRouter({
  history: createWebHistory(),//createWebHashHistory
  routes: routes
})