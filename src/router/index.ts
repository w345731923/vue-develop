
import { createRouter, createWebHistory, createWebHashHistory,RouteRecordRaw } from 'vue-router';

import Home from '../layout/index.vue'
import Login from '../views/login/index.vue'

// import home from './home.vue'

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
  // { path: "/", redirect: "/login" },
  // {
  //   path: "/home",
  //   name: "home",
  //   component: Index
  // },
  // {
  //   path: "/login",
  //   name: "login",
  //   component: Login
  // },
  // {
  //   path: '/about/:item',
  //   alias: '/about',
  //   name: 'About',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About/index.vue'),
  // },
]
export const router = createRouter({
  history: createWebHistory(),//createWebHashHistory
  routes: routes
})