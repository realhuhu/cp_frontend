<template>
  <div id="banner"/>

  <div id="wrap">
    <var-divider>
      <div id="title">修改密码</div>
    </var-divider>

    <div v-if="!success" style="padding: 30px">
      <password placeholder="旧密码" v-model:password="old_password"/>
      <password placeholder="新密码" v-model:password="new_password"/>
      <password placeholder="确认密码" v-model:password="confirm_password" :confirm="new_password"/>

      <br>
      <div id="login-btn">
        <var-button block type="success" @click="change_password">确认修改</var-button>
      </div>
    </div>

    <div v-else>
      <var-icon id="success" size="100px" color="green" name="check-circle-outline"/>
      <div style="text-align: center">修改完成，{{t}}秒后跳转到登陆页</div>
    </div>
  </div>
</template>

<script>
  import Password from "components/input/Password";

  export default {
    name: "ChangePassword",
    components: {
      Password
    },
    data() {
      return {
        old_password: "",
        new_password: "",
        confirm_password: "",
        re_pattens: this.$settings.re_pattens,
        success: false,
        t: 5
      }
    },
    methods: {
      change_password() {
        if (!this.re_pattens.password.test(this.old_password)) return
        if (!this.re_pattens.password.test(this.new_password)) return
        if (!this.re_pattens.password.test(this.confirm_password)) return
        if (this.new_password !== this.confirm_password) return

        this.$ajax.api.post(
          "user/change_password/",
          {
            old_password: this.old_password,
            new_password: this.new_password,
            confirm_password: this.confirm_password,
          }
        ).then(res => {
          if (res.data.code === 104) {
            this.$cookies.remove("token")
            this.success = true
            let inter = setInterval(() => {
              if (this.t === 1) {
                this.$router.push({path: "/login", query: {next: this.$route.query.next}})
                clearInterval(inter)
              }
              this.t--
            }, 1000)
            this.$store.commit("logout")
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })

      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #banner {
      width: 100vw;
      height: 8vw;
      background-image: linear-gradient(to top, rgba(255, 255, 255, .8), rgba(255, 255, 255, 0)), url(https://cp-1304907527.cos.ap-nanjing.myqcloud.com/static/banner.jpg);
      background-size: cover;
      z-index: -1;
    }

    #wrap {
      width: 500px;
      margin: 20px calc(50vw - 250px);
      padding: 30px;
      border-radius: 30px;
      background-color: rgba(255, 255, 255, .95);
    }

    #title {
      color: #333;
      font-size: 38px;
      padding: 0 2vw;
    }

    #success {
      margin: 30px 200px;
    }
  }
</style>