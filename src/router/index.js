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
    meta: {
      title: '校史知识竞赛'
    }
  },
  {
    path: "/exercise",
    component: () => import("views/Exercise"),
    meta: {
      auth: 1,
      title: '练习'
    }
  },
  {
    path: "/entries",
    component: () => import("views/Entries"),
    meta: {
      auth: 1,
      title: '参赛记录'
    }
  },
  {
    path: "/user-info",
    component: () => import("views/UserInfo"),
    meta: {
      auth: 1,
      title: '用户信息'
    }
  },
  {
    path: "/login",
    component: () => import("views/Login"),
    meta: {
      auth: 0,
      title: '登录'
    }
  },
  {
    path: "/reset-password",
    component: () => import("views/ResetPassword"),
    meta: {
      title: '重置密码'
    }
  },
  {
    path: "/change-password",
    component: () => import("views/ChangePassword"),
    meta: {
      auth: 1,
      title: '修改密码'
    }
  },
  {
    path: "/change-icon",
    component: () => import("views/ChangeIcon"),
    meta: {
      auth: 1,
      title: '修改头像'
    }
  },
  {
    path: "/competition/:id",
    component: () => import("views/Competition"),
    meta: {
      auth: 1,
      title: '答题页'
    }
  },
  {
    path: "/article/:id",
    component: () => import("views/Article"),
    meta: {
      auth: 1,
      title: '公告'
    }
  },
  {
    path: "/score/:id",
    component: () => import("views/Score"),
    meta: {
      auth: 1,
      title: '成绩'
    }
  },
  {
    path: "/admin",
    component: () => import("views/admin/AdminTab"),
    redirect: "/admin/user",
    children: [
      {
        path: "user",
        component: () => import("views/admin/UserEdit"),
      },
      {
        path: "score",
        component: () => import("views/admin/Score"),
      },
      {
        path: 'question-edit',
        component: () => import("views/admin/QuestionBankEdit"),
      },
      {
        path: 'upload-question',
        component: () => import("views/admin/UploadQuestion")
      },
      {
        path: 'competition',
        component: () => import("views/admin/CompetitionList")
      },
      {
        path: 'competition/:id',
        component: () => import("views/admin/CompetitionDetail")
      },
      {
        path: 'create-competition',
        component: () => import("views/admin/CreateCompetition")
      },
      {
        path: 'notice',
        component: () => import("views/admin/Notice")
      },
      {
        path: 'link',
        component: () => import("views/admin/Other")
      }
    ],
    meta: {
      auth: 2,
      title: "管理员界面"
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  to.matched.some(route => {
    let inter = setInterval(() => {
      if (store.state.is_init) {
        if (route.meta.auth === undefined) {
          next()
        } else {
          if (route.meta.auth === 1 && !store.state.is_login) {
            if (route.path.search(":") === -1) {
              next({path: "/login", query: {next: route.path}})
            } else {
              next({path: "/login"})
            }
          } else if (route.meta.auth === 0 && store.state.is_login) {
            next(to.query.next || "/home")
          } else if (route.meta.auth === 2 && !store.state.is_superuser) {
            next({path: "/home"})
          } else {
            next()
          }
        }
        clearInterval(inter)
      }
    }, 100)
  })
})

router.return = function (path) {
  return (!window.history.state.back && path) ? router.replace(path) : router.back()
}

export default router
