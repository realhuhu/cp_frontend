<template>
  <div id="background"></div>

  <var-app-bar
    id="app-bar"
    class="var-elevation--1"
    title-position="center"
    color="#f6f6f6"
    text-color="#333"
  >
    <template #left>
      <var-icon name="chevron-left" :size="24" @click="this.$router.return('/home')"/>
      <div :size="24" @click="this.$router.return('/home')">返回</div>
    </template>
  </var-app-bar>


  <div id="wrap">
    <var-divider>
      <div id="title">{{is_to_login? "登录":"注册"}}</div>
    </var-divider>

    <var-card class="card" id="card">
      <template #extra>
        <div v-if="!is_use_phone">
          <username :placeholder="is_to_login? '用户名/手机号':'用户名'" v-model:username="username"/>
          <password v-model:password="password"/>
        </div>

        <div v-else>
          <phone v-model:phone="username"/>
          <msg-code v-model:code="password" :method="is_to_login?'login':'register'" :phone="username"/>
        </div>

        <div v-if="!is_use_phone && !is_to_login">
          <password placeholder="确认密码" v-model:password="confirm_password" :confirm="password"/>
        </div>

        <div id="login-btn">
          <var-button block type="success" @click="login">{{is_to_login? "登录账号":"注册账号"}}</var-button>
        </div>


        <var-button style="width: 50%" text type="primary" @click="phone_toggle">
          {{is_use_phone? is_to_login?"密码登录":"用户名密码注册":is_to_login?"短信验证码登录":"手机号注册"}}
        </var-button>
        <var-button style="width: 50%;" text type="primary" @click="resetPassword">
          忘记密码?
        </var-button>
      </template>
    </var-card>

    <div id="register">
      <var-chip block plain color="#333" text-color="#254b8f" @click="login_toggle">
        {{is_to_login?"没有账号？注册一个！":"已有账号？快去登录！"}}
      </var-chip>
    </div>

  </div>
</template>

<script>
  import Username from "components/input/Username";
  import Password from "components/input/Password";
  import Phone from "components/input/Phone";
  import MsgCode from "components/input/MsgCode";

  export default {
    name: "login",
    components: {
      Username,
      Password,
      Phone,
      MsgCode,
    },
    data() {
      return {
        username: "",
        password: "",
        confirm_password: "",
        is_use_phone: false,
        is_to_login: true,
        re_pattens: this.$settings.re_pattens
      }
    },
    methods: {
      login() {

        let url, data


        if (this.is_use_phone && this.is_to_login) {
          if (!this.re_pattens.phone.test(this.username)) return
          if (!this.re_pattens.code.test(this.password)) return
          url = "user/login/"
          data = {
            username: this.username,
            password: this.password
          }

        } else if (this.is_use_phone && !this.is_to_login) {
          if (!this.re_pattens.phone.test(this.username)) return
          if (!this.re_pattens.code.test(this.password)) return
          url = "user/register/"
          data = {
            phone: this.username,
            code: this.password
          }

        } else if (!this.is_use_phone && this.is_to_login) {
          if (!this.re_pattens.username.test(this.username)) return
          if (!this.re_pattens.password.test(this.password)) return
          url = "user/login/"
          data = {
            username: this.username,
            password: this.password
          }

        } else {
          if (!this.re_pattens.username.test(this.username)) return
          if (!this.re_pattens.password.test(this.password)) return
          if (this.password !== this.confirm_password) return
          url = "user/register/"
          data = {
            username: this.username,
            password: this.password,
            confirm_password: this.confirm_password
          }
        }

        this.$ajax.api.post(
          url,
          data
        ).then(res => {
          if (res.data.code === 103 && this.is_to_login || res.data.code === 102 && !this.is_to_login) {
            this.$cookies.set("token", res.data.result.token)
            this.$store.commit("login", res.data.result["user"])
            this.$router.replace(this.$route.query.next || "/home")
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
      },
      resetPassword() {
        this.$router.push({path: "/reset-password", query: {next: this.$route.query.next}})
      },
      phone_toggle() {
        this.clear()
        this.is_use_phone = !this.is_use_phone
      },
      login_toggle() {
        this.clear()
        this.is_to_login = !this.is_to_login
      },
      clear() {
        this.username = ""
        this.password = ""
        this.confirm_password = ""
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #background {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-image: url(https://newids.seu.edu.cn/authserver/custom/images/bg5.jpg);
      background-size: cover;
      opacity: 0.95;
      z-index: -1;
    }

    #app-bar {
      display: none;
    }


    #wrap {
      width: 500px;
      margin: 20vh 10vw 0 calc(90vw - 500px);
      padding: 30px;
      border-radius: 30px;
      background-color: rgba(255, 255, 255, .95);
    }

    #title {
      color: #333;
      font-size: 38px;
      padding: 0 2vw;
    }

    #card {
      width: 400px;
      padding: 20px 50px;
      margin: 20px calc(50% - 250px);
    }

    #register {
      width: 500px;
      margin: 30px calc(50% - 250px);
    }

    #register * {
      cursor: pointer;
    }

  }

  @media screen and (max-width: 840px) {
    #wrap {
      width: 90vw;
      margin: 20px 5vw 0;
    }

    #title {
      color: #333;
      font-size: 38px;
      padding: 0 2vw;
    }

    #card {
      width: 80%;
      padding: 10%;
      background-color: #f6f6f6;
    }

    #register {
      width: 90%;
      margin: 30px 5%;
    }
  }

  #login-btn {
    margin: 20px 0;
  }
</style>
