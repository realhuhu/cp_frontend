<template>
  <div id="background"/>

  <var-tabs
    id="tabs"
    class="vertical-tabs"
    elevation
    layout-direction="vertical"
    color="#303f56"
    active-color="#95bbff"
    inactive-color="#f6f6f6"
    v-model:active="active"
  >
    <div id="title">校史竞赛管理系统</div>
    <var-divider description="用户管理"/>
    <var-tab class="tab" @click="this.$router.replace('/admin/user')">
      <var-icon class="tab-icon" size="30px" name="account-circle"/>
      用户信息
    </var-tab>
    <var-tab class="tab" @click="this.$router.replace('/admin/score')">
      <var-icon class="tab-icon" size="30px" name="file-document-outline"/>
      成绩管理
    </var-tab>
    <var-divider description="题库管理"/>
    <var-tab class="tab" @click="this.$router.replace('/admin/question-edit')">
      <var-icon class="tab-icon" size="30px" name="notebook"/>
      题库信息
    </var-tab>
    <var-tab class="tab" @click="this.$router.replace('/admin/upload-question')">
      <var-icon class="tab-icon" size="30px" name="upload"/>
      上传题目
    </var-tab>
    <var-divider description="竞赛管理"/>
    <var-tab class="tab" @click="this.$router.replace('/admin/competition')">
      <var-icon class="tab-icon" size="30px" name="format-list-checkbox"/>
      竞赛列表
    </var-tab>
    <var-tab class="tab" @click="this.$router.replace('/admin/create-competition')">
      <var-icon class="tab-icon" size="30px" name="plus"/>
      新建竞赛
    </var-tab>
    <var-divider description="其它"/>
    <var-tab class="tab" @click="this.$router.replace('/admin/notice')">
      <var-icon class="tab-icon" size="30px" name="content-copy"/>
      公告管理
    </var-tab>
    <var-tab class="tab" @click="this.$router.replace('/admin/link')">
      <var-icon class="tab-icon" size="30px" name="plus"/>
      链接设置
    </var-tab>
    <div id="foot">
      <div id="bottom">
        <img id="logo" src="~assets/img/logo.png" alt="" style="color: green;" @click="this.$router.replace('/home')">
      </div>
    </div>
  </var-tabs>

  <div id="banner">
    <span>
      <var-icon style="margin: 25px 10px 25px 50px" size="30px" name="menu-open"/>
    </span>
    <span>当前：{{title}}</span>

    <span style="float: right;padding: 0 50px 0 0">
      <var-button type="warning" size="small" @click="logout">退出登录</var-button></span>
    <span id="username">{{user.username}}</span>

  </div>

  <div style="padding: 30px">
    <router-view/>
    <div style="height: 30vh"></div>
  </div>

</template>

<script>
  export default {
    name: "AdminTag",
    watch: {
      "$route"() {
        let path = window.location.pathname
        for (let i of this.data) {
          if (i.re.test(path)) {
            this.active = i.active
            this.title = i.title
          }
        }
      }
    },
    data() {
      return {
        active: 0,
        re_pattens: [],
        data: [
          {
            re: /^\/admin\/user$/,
            title: "用户管理 > 用户信息",
            active: 0
          },
          {
            re: /^\/admin\/score$/,
            title: "用户管理 > 成绩管理",
            active: 1
          },
          {
            re: /^\/admin\/question-edit$/,
            title: "题库管理 > 题库信息",
            active: 2
          },
          {
            re: /^\/admin\/upload-question$/,
            title: "题库管理 > 上传题目",
            active: 3
          },
          {
            re: /^\/admin\/competition\/[0-9]*$/,
            title: "竞赛管理 > 竞赛详情",
            active: 4
          },
          {
            re: /^\/admin\/competition$/,
            title: "竞赛管理 > 竞赛列表",
            active: 4
          },
          {
            re: /^\/admin\/create-competition$/,
            title: "竞赛管理 > 新建竞赛",
            active: 5
          },
          {
            re: /^\/admin\/notice$/,
            title: "其它 > 公告管理",
            active: 6
          },
          {
            re: /^\/admin\/link$/,
            title: "其它 > 链接管理",
            active: 7
          }
        ],
        title: ""
      }
    },
    computed: {
      user() {
        return this.$store.state.user
      },
      icon() {
        return this.$settings.cos_url + (this.$store.state.user.icon || "icon/login.jpg")
      },
    },
    methods: {
      logout() {
        this.$cookies.remove("token")
        this.$store.commit("logout")
        this.$router.replace("/login")
      },
    },
    created() {
      let path = window.location.pathname
      for (let i of this.data) {
        if (i.re.test(path)) {
          this.active = i.active
          this.title = i.title
        }
      }
    }
  }
</script>

<style scoped>
  #background {
    position: fixed;
    left: 250px;
    top: 80px;
    width: calc(100% - 250px);
    height: calc(100% - 80px);
    background-image: url(https://cp-1304907527.cos.ap-nanjing.myqcloud.com/static/background.jpg);
    background-size: cover;
    opacity: 0.4;
    z-index: -1;
  }

  #tabs {
    position: fixed;
    left: 0;
    top: 0;
    height: 100vh;
    width: 250px;
  }

  .tab {
    font-size: 15px;
    font-weight: bolder;
    justify-content: left;
  }

  .tab:hover {
    background-color: #2a2e3b;
  }

  #title {
    width: 100%;
    background-color: #2a2e3b;
    color: white;
    line-height: 80px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
  }

  .tab-icon {
    margin: 0 10px;
  }

  #foot {
    height: 40vh;
  }

  #bottom {
    position: absolute;
    bottom: 0;
  }

  #logo {
    width: 150px;
    margin: 50px;
  }

  #logo:hover {
    cursor: pointer;
  }

  #banner {
    position: fixed;
    left: 250px;
    top: 0;
    z-index: 1000;
    width: calc(100vw - 250px);
    line-height: 80px;
    background-color: #f6f6f6;
  }

  #username {
    font-size: 20px;
    font-weight: bolder;
    float: right;
    color: #444;
    margin-right: 10px;
  }

</style>
