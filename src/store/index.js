import {createStore} from 'vuex'

export default createStore({
  state: {
    is_init: false,
    is_login: false,
    login: null,
    is_login_init: false,
    is_superuser: false,
    user: {username: "未登录用户"},
    swipe: "",
    top: "",
  },
  mutations: {
    initialize(state, login) {
      state.is_init = true
      state.login = login
    },
    login(state, user) {
      state.is_login = true
      state.is_login_init = true
      state.is_superuser = user.is_superuser
      state.user = user
      state.user.address = user.address ? user.address : "未设置"
      state.user.phone = user.phone ? user.phone : "未绑定"
    },
    login_init(state, flag) {
      state.is_login_init = flag
    },
    logout(state) {
      state.is_login = false
      state.user = {username: "未登录用户"}
    },
    swipe(state, res) {
      state.swipe = res
    },
    top(state, res) {
      state.top = res
    }
  },
  actions: {},
  modules: {}
})
