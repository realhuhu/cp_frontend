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
        path: "upload-user",
        component: () => import("views/admin/UploadUser"),
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
  if (to.meta.title) {
    document.title = to.meta.title
  }

  let login = store.state.login
  let login_init = store.state.is_login_init
  if (!login_init) {
    if (to.meta.auth === 0) {
      if (!login) {
        next()
      } else {
        login.then(() => {
          next(to.query.next || "/home")
        }).catch(() => {
          next()
        })
      }
    } else if (to.meta.auth === 1) {
      if (!login) {
        next({path: "/login", query: {next: to.path}})
      } else {
        login.then(() => {
          next()
        }).catch(() => {
          next({path: "/login", query: {next: to.path}})
        })
      }
    } else {
      next()
    }
  } else {
    let is_login = store.state.is_login
    if (to.meta.auth === 0) {
      if (!is_login) {
        next()
      } else {
        next(to.query.next || "/home")
      }
    } else if (to.meta.auth === 1) {
      if (!is_login) {
        next({path: "/login", query: {next: to.path}})
      } else {
        next()
      }
    } else {
      next()
    }
  }
})

router.return = function (path) {
  return (!window.history.state.back && path) ? router.replace(path) : router.back()
}

export default router
