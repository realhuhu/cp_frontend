<template>
  <div id="pc-nav-bar" class="clear-fix var-elevation--2">
    <div id="left" @click="to_home">
      <img id="logo" src="~assets/img/logo.png" alt="" style="color: green;">
    </div>

    <var-divider class="divider" vertical/>

    <div id="center">
      <div id="name" @click="to_home">
        校史知识竞赛
      </div>


      <div v-if="this.$store.state.is_login" id="message">
        <var-badge type="danger" position="right-top" style="line-height: 16px" :value="0" :hidden="true">
          <var-icon name="message-processing-outline" size="26px"/>
        </var-badge>
      </div>

      <div id="search">
        <var-input
          :hint="false"
          :line="false"
          text-color="#333"
          placeholder="输入竞赛名称..."
          v-model="value"
          clearable>
          <template #prepend-icon>
            <var-icon id="search-btn" name="magnify"/>
          </template>
        </var-input>
      </div>
    </div>

    <var-divider class="divider" vertical/>

    <div id="right">
      <var-image
        id="avatar"
        width="48px"
        height="48px"
        fit="cover"
        radius="50%"
        style="border: 2px solid rgba(200,200,200,0.9)"
        :src="icon"
        @click.stop="avatar_click"
      />

      <var-button style="width: 20%" text type="primary" @click="adminLogin">
        admin
      </var-button>

      <div class="var-elevation--1" id="popup" v-if="show_user_info" @click="show_user_info=false">
        <div id="options-wrap">
          <var-image
            width="70px"
            height="70px"
            fit="cover"
            radius="50%"
            style="margin: 20px 70px 10px;border: 1px solid rgba(200,200,200,0.9)"
            :src="icon"
            @click.stop="avatar_click"
          />
          <div id="username">
            {{user.username}}
          </div>

          <var-divider margin="0"/>

          <div class="btn" @click="this.$router.push({path: '/user-info', query: {next: this.$route.path}})">
            <var-icon class="btn-icon-left" size="20" name="account-circle-outline"/>
            个人信息
            <var-icon class="btn-icon-right" size="20" name="chevron-right"/>
          </div>
          <div class="btn">
            <var-icon class="btn-icon-left" size="20" name="format-list-checkbox"/>
            参赛记录
            <var-icon class="btn-icon-right" size="20" name="chevron-right"/>
          </div>
          <div class="btn" @click="this.$router.replace('change-password')">
            <var-icon class="btn-icon-left" size="20" name="cog-outline"/>
            修改密码
            <var-icon class="btn-icon-right" size="20" name="chevron-right"/>
          </div>

          <var-divider margin="0"/>

          <div class="btn" @click="logout">
            <var-icon class="btn-icon-left" size="20" name="information-outline"/>
            退出登录
          </div>
        </div>
      </div>
    </div>

  </div>

</template>

<script>

  export default {
    name: "PcNavBar",
    components: {},
    data() {
      return {
        value: null,
        show_user_info: false,
        show_login_popup: false,
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      icon() {
        return this.$settings.cos_url + (this.$store.state.user.icon || "icon/login.jpg")
      },
    }, methods: {
      avatar_click() {
        if (this.$store.state.is_login) {
          this.show_user_info = !this.show_user_info
        } else {
          this.$router.replace("/login?next=/home")
        }
      },
      adminLogin() {
        this.$router.replace("/AdminLogin?next=/home")
      },
      logout() {
        this.$cookies.remove("token")
        this.$store.commit("logout")
      },
      to_home() {
        this.$router.push("/home")
      }
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {

    #pc-nav-bar {
      position: fixed;
      left: 0;
      top: 0;
      z-index: 996;
      width: 100%;
      line-height: 64px;
      background-color: white;
      --tabs-item-horizontal-height: 64px
    }

    #left, #right, #center {
      height: 64px;
      float: left;
      display: inline-block;
    }

    #left {
      width: 20%;
    }

    #center {
      width: calc(60% - 2px);
    }

    #right {
      width: 20%;
    }

    .divider {
      margin: 20px 0;
      height: 24px;
      width: 1px;
      float: left;
    }

    #logo {
      float: right;
      height: 30px;
      margin: 17px 2%;
    }

    #name {
      font-size: 16px;
      float: left;
      margin: 0 5% 0 1%;
      font-weight: bold;
      width: 40%;
    }


    #search {
      float: right;
      height: 30px;
      margin: 15px;
      padding: 2px 10px;
      width: 25%;
      border: 1px solid #f6f6f6;
      border-radius: 10px;
    }

    #search-btn {
      padding: 3px;
      margin: 2px;
      border-radius: 5px;
      background-color: #fff;
      border: 1px dashed rgba(200, 200, 200, 0.8);
    }

    #message {
      float: right;
      padding: 19px;
      line-height: 26px;
    }

    #avatar {
      margin: 10px;
    }

    #adminLog{
      margin: 10px;
      line-height: 26px;
    }

    #popup {
      position: fixed;
      top: 64px;
      right: calc(20% - 60px);
      width: 250px;
      background-color: white;
      border-radius: 0 0 20px 20px;
      z-index: 1000;
    }

    #options-wrap {
      margin: 20px;
    }

    #username {
      font-weight: bolder;
      line-height: 24px;
      text-align: center;
      margin-bottom: 10px;
    }

    .btn {
      line-height: 40px;
      border-radius: 5px;
    }

    .btn-icon-left {
      margin: 10px;
    }

    .btn-icon-right {
      margin: 10px;
      float: right;
    }

    #message:hover, #search:hover, .btn:hover {
      background-color: #f6f6f6;
    }

    #avatar, #message, #search-btn, #name, #logo, .btn {
      cursor: pointer;
    }


  }


  @media screen and (max-width: 840px) {
    #pc-nav-bar {
      display: none;
    }
  }
</style>
