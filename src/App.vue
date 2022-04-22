<template>
  <pc-nav-bar v-if="!is_admin"/>
  <pe-tab-bar v-if="!is_admin" :active="active"/>

  <div v-if="!is_admin" id="content">
    <router-view></router-view>
  </div>

  <div v-else id="admin-content">
    <router-view></router-view>
  </div>

  <var-back-top bottom="60px" :duration="300"/>
</template>

<script>
  import PcNavBar from "components/bar/PcNavBar";
  import PeTabBar from "components/bar/PeTabBar";

  export default {
    name: "app",
    components: {
      PcNavBar,
      PeTabBar,
    },
    data() {
      return {
        active: 0,
        is_admin: false,
        is_show: false
      }
    },
    watch: {
      "$route"() {
        let index = ["/home", "/exercise", "/entries", "/user-info"].indexOf(window.location.pathname)
        this.is_admin = window.location.pathname.indexOf("admin") !== -1
        this.active = index
        this.is_show = index !== -1
      }
    },
    beforeCreate() {
      let token = this.$cookies.get("token")
      if (token) {
        let login = this.$ajax.api.get(
          "user/user_info/"
        ).then(res => {
          if (res.data.code === 107) {
            this.$store.commit("login", res.data.result.user)
            return new Promise(resolve => {
              resolve()
            })
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 2000,
            })
            return new Promise((resolve, reject) => {
              reject(res.data.msg)
            })
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
          return new Promise((resolve, reject) => {
            reject(err)
          })
        })
        this.$store.commit("initialize", login)
      } else {
        this.$store.commit("initialize", null)
      }

      this.$ajax.api.get(
        "common/swipe/"
      ).then(res => {
        this.$store.commit("swipe", res.data.result)
      })

      this.$ajax.api.get(
        "common/top/"
      ).then(res => {
        this.$store.commit("top", res.data.result)
      })
    },
  }
</script>
<style scoped>
  @import "assets/css/normalize.css";

  @media screen and (min-width: 840px) {
    #content {
      margin: 64px 0 0;
      min-height: calc(70vh - 50px);
    }

    #admin-content {
      margin: 80px 0 0 250px;
    }

  }

  @media screen and (max-width: 840px) {
  }
</style>
