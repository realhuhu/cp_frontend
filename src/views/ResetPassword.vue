<template>
  <var-app-bar
    id="app-bar"
    class="var-elevation--1"
    title-position="center"
    color="#f6f6f6"
    text-color="#333"
  >
    <template #left @click="this.$router.back()">
      <var-icon name="chevron-left" :size="24" @click="this.$router.return('/login')"/>
      <div @click="this.$router.return('/login')">返回</div>
    </template>
  </var-app-bar>

  <div id="banner"/>

  <div id="wrap">
    <span id="to-login" @click="this.$router.push({path: '/login', query: {next: this.$route.query.next}})">登陆</span>
    <span>&nbsp;&gt;&nbsp;重置密码</span>
  </div>

  <div id="step-wrap">
    <var-steps :active="active">
      <var-step>确认账号</var-step>
      <var-step>重置密码</var-step>
      <var-step>重置成功</var-step>
    </var-steps>
  </div>

  <div id="input-wrap">
    <div v-if="active===0">
      <phone v-model:phone="phone"/>
      <msg-code v-model:code="code" method="reset_password" :phone="phone"/>
    </div>

    <div v-if="active===1">
      <var-input placeholder="电话号码" :line="false" disabled v-model="phone"/>
      <br>
      <password placeholder="新密码" v-model:password="password"/>
      <password placeholder="确认密码" v-model:password="confirm_password" :confirm="password"/>
    </div>

    <div v-if="active===2">
      <var-icon id="success" size="100px" color="green" name="check-circle-outline"/>
      <div style="text-align: center">修改完成，{{t}}秒后跳转到登陆页</div>
    </div>

    <br>
    <var-button v-if="active<2" type="primary" block @click="next">下一步</var-button>
  </div>
</template>

<script>
  import Phone from "components/input/Phone";
  import MsgCode from "components/input/MsgCode";
  import Password from "../components/input/Password";

  export default {
    name: "ResetPassword",
    components: {
      Password,
      Phone,
      MsgCode
    },
    data() {
      return {
        phone: "",
        code: "",
        active: 0,
        password: "",
        confirm_password: "",
        re_pattens: this.$settings.re_pattens,
        t: 5
      }
    },
    methods: {
      next() {
        switch (this.active) {
          case 0:
            if (!this.re_pattens.phone.test(this.phone)) return
            if (!this.re_pattens.code.test(this.code)) return
            this.validate_code()
            break
          case 1:
            if (!this.re_pattens.password.test(this.password)) return
            if (!this.re_pattens.password.test(this.confirm_password)) return
            if (this.password !== this.confirm_password) return
            this.reset_password()
            let inter = setInterval(() => {
              if (this.t === 1) {
                this.$router.push({path: "/login", query: {next: this.$route.query.next}})
                clearInterval(inter)
              }
              this.t--
            }, 1000)
            break
        }
      },
      validate_code() {
        this.$ajax.api.get(
          "common/code/",
          {
            params: {
              phone: this.phone,
              method: "reset_password",
              code: this.code
            }
          },
        ).then(res => {
          if (res.data.code !== 110) {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          } else {
            this.active++
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })
      },
      reset_password() {
        this.$ajax.api.post(
          "user/reset_password/",
          {
            phone: this.phone,
            code: this.code,
            password: this.password,
            confirm_password: this.confirm_password
          }
        ).then(res => {
          if (res.data.code === 104) {
            this.active++
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
    #app-bar {
      display: none;
    }

    #banner {
      width: 100vw;
      height: 8vw;
      background-image: linear-gradient(to top, rgba(255, 255, 255, .8), rgba(255, 255, 255, 0)), url(https://cp-1304907527.cos.ap-nanjing.myqcloud.com/static/banner.jpg);
      background-size: cover;
      z-index: -1;
    }

    #wrap {
      width: 50vw;
      margin: 20px 25vw 0;
    }

    #to-login {
      cursor: pointer;
      color: #3a7afe;
    }

    #step-wrap {
      width: 500px;
      margin: 30px calc(50vw - 250px);
    }

    #input-wrap {
      width: 400px;
      margin: 10px calc(50vw - 200px);
    }

    #success {
      margin: 30px 150px;
    }

  }

  @media screen and (max-width: 840px) {
    #banner, #wrap {
      display: none;
    }

    #step-wrap {
      margin: 20px 5vw;
    }

    #input-wrap {
      width: 70vw;
      margin: 10px 15vw;
    }

    #success {
      margin: 30px calc(35vw - 50px);
    }
  }
</style>