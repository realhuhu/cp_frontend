import {createRouter, createWebHistory} from 'vue-router'
import store from "../store/index.js"

import Home from "views/Home";

const routes = [
  {
    path: "",
    redirect: "/home",
    meta: {}
  },
  {
    path: "/home",
    component: Home,
    meta: {title : '校史知识竞赛'}
  },
  {
    path: "/login",
    component: () => import("views/Login"),
    meta: {
      auth: false,
      title : '登录'
    }
  },
  {
    path: "/reset-password",
    component: () => import("views/ResetPassword"),
    meta: {
      auth: false,
      title: '重置密码'
    }
  },
  {
    path: "/change-password",
    component: () => import("views/ChangePassword"),
    meta: {
      auth: true,
      title: '修改密码'
    }
  },
  {
    path: "/user-info",
    component: () => import("views/UserInfo"),
    meta: {
      auth: true,
      title: '用户信息'
    }
  },
  {
    path: "/change-icon",
    component: () => import("views/ChangeIcon"),
    meta: {
      auth: true,
      title: '修改头像'
    }
  },
  {
    path: "/competition",
    component: () => import("views/Competition"),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  to.matched.some(route => {
    if (route.meta.auth === undefined) {
      next()
    } else if (route.meta.auth === true) {
      let inter = setInterval(() => {
        if (store.state.is_init) {
          clearInterval(inter)
          if (!store.state.is_login) {
            next({path: "/login", query: {next: route.path}})
          } else {
            next()
          }
        }
      }, 100)
    } else if (route.meta.auth === false) {
      let inter = setInterval(() => {
        if (store.state.is_init) {
          clearInterval(inter)
          if (store.state.is_login) {
            next({path: "/home"})
          } else {
            next()
          }
        }
      }, 100)
    }
  })
})

router.return = function (path) {
  return (!window.history.state.back && path) ? router.replace(path) : router.back()
}

export default router
