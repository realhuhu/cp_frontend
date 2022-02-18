<template>
  <div id="background"></div>

  <div id="wrap">
    <var-divider>
      <div id="title">Admin</div>
    </var-divider>

    <var-card class="card" id="card">
      <template #extra>
        <div>
          <username :placeholder="'用户名'" v-model:username="username"/>
          <password v-model:password="password"/>
        </div>

        <div id="login-btn">
          <var-button block type="success" @click="login">登录账号</var-button>
        </div>

      </template>
    </var-card>


  </div>
</template>

<script>
import Username from "components/input/Username";
import Password from "components/input/Password";

export default {
  name: "adminLogin",
  components: {
    Username,
    Password,
  },
  data() {
    return {
      username: "",
      password: "",
      re_pattens: this.$settings.re_pattens
    }
  },
  methods: {
    login() {

      let url, data


      if (this.is_use_phone && this.is_to_login) {
        url = "admin/login/"
        data = {
          username: this.username,
          password: this.password
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
    background-image: url(https://cp-1304907527.cos.ap-nanjing.myqcloud.com/static/background.jpg);
    background-size: cover;
    opacity: 0.4;
    z-index: -1;
  }
}

@media screen and (max-width: 840px) {
}

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
