import {createStore} from 'vuex'

export default createStore({
  state: {
    is_init: false,
    is_login: false,
    is_superuser: false,
    user: {username: "未登录用户"}
  },
  mutations: {
    initialize(state) {
      state.is_init = true
    },
    login(state, user) {
      state.is_login = true
      state.is_superuser = user.is_superuser
      state.user = user
      state.user.address = user.address ? user.address : "未设置"
      state.user.phone = user.phone ? user.phone : "未绑定"
    },
    logout(state) {
      state.is_login = false
      state.user = {username: "未登录用户"}
    },
  },
  actions: {},
  modules: {}
})
