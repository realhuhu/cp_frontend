<template>
  <pc-nav-bar/>
  <pe-tab-bar :active="active"/>

  <div id="content">
    <router-view></router-view>
  </div>

  <var-back-top style="right: 15%;" :duration="300"/>
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
        night: false,
      }
    },
    watch: {
      "$route"() {
        let index = ["/home", "/competition", "/profile"].indexOf(window.location.pathname)
        this.active = index
      }
    },
    beforeCreate() {
      let token = this.$cookies.get("token")
      if (!token) {
        this.$store.commit("initialize")
      } else {
        this.$ajax.api.get(
          "user/user_info/",
        ).then(res => {
          if (res.data.code === 107) {
            this.$store.commit("login", res.data.result.user)
          }
          this.$store.commit("initialize")
        }).catch(err => {
          this.$store.commit("initialize")
          console.log(err)
        })
      }
    },
  }
</script>
<style>
  @import "assets/css/normalize.css";

  @media screen and (min-width: 840px) {
    #content {
      margin: 64px 0 0;
      min-height: calc(70vh - 50px);
    }


  }

  @media screen and (max-width: 840px) {
  }
</style>
