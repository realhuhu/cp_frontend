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
      <div id="title">登录</div>
    </var-divider>

    <var-card class="card" id="card">
      <template #extra>
        <div v-if="!is_use_phone">
          <username placeholder="一卡通号" v-model:username="card" @keyup.enter="login"/>
          <password v-model:password="password" @keyup.enter="login"/>
        </div>

        <div v-else>
          <phone v-model:phone="card" @keyup.enter="login"/>
          <msg-code v-model:code="password" method="login" :phone="card" @keyup.enter="login"/>
        </div>


        <div id="login-btn">
          <var-button block type="success" @click="login">登录账号</var-button>
        </div>


        <var-button style="width: 50%" text type="primary" @click="phone_toggle">
          {{is_use_phone? "密码登录":"短信验证码登录"}}
        </var-button>
        <var-button style="width: 50%;" text type="primary" @click="resetPassword">
          忘记密码?
        </var-button>
      </template>
    </var-card>

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
        card: "",
        password: "",
        is_use_phone: false,
        re_pattens: this.$settings.re_pattens
      }
    },
    methods: {
      login() {
        let url, data

        if (this.is_use_phone) {
          if (!this.re_pattens.phone.test(this.card)) return
          if (!this.re_pattens.code.test(this.password)) return
        } else if (!this.is_use_phone) {
          if (!this.re_pattens.card.test(this.card)) return
          if (!this.re_pattens.password.test(this.password)) return
        }

        url = "user/login/"
        data = {
          card: this.card,
          password: this.password
        }

        this.$ajax.api.post(
          url,
          data
        ).then(res => {
          if (res.data.code === 103) {
            this.$cookies.set("token", res.data.result.token)
            this.$store.commit("login", res.data.result["user"])
            console.log(this.$route.query.next);
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
      clear() {
        this.card = ""
        this.password = ""
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
