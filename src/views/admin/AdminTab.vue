<template>
  <div id="background"/>
  <div id="tabs" style="background-color: rgb(48, 63, 86)">
    <div id="title">校史竞赛管理系统</div>

    <var-collapse v-model="value" accordion :offset="false"
                  style="--collapse-background:rgb(48, 63, 86);--collapse-text-color:#999;--collapse-content-padding:0">
      <var-collapse-item title="用户管理" name="1">
        <div class="tab" @click="this.$router.replace('/admin/user')">
          <var-icon class="tab-icon" size="30px" name="account-circle"/>
          用户信息
        </div>
        <div class="tab" @click="this.$router.replace('/admin/upload-user')">
          <var-icon class="tab-icon" size="30px" name="account-circle"/>
          导入用户
        </div>
        <div class="tab" @click="this.$router.replace('/admin/score')">
          <var-icon class="tab-icon" size="30px" name="file-document-outline"/>
          成绩管理
        </div>
      </var-collapse-item>
      <var-collapse-item title="题库管理" name="2">
        <div class="tab" @click="this.$router.replace('/admin/question-edit')">
          <var-icon class="tab-icon" size="30px" name="notebook"/>
          题库信息
        </div>
        <div class="tab" @click="this.$router.replace('/admin/upload-question')">
          <var-icon class="tab-icon" size="30px" name="upload"/>
          上传题目
        </div>
      </var-collapse-item>
      <var-collapse-item title="竞赛管理" name="3">
        <div class="tab" @click="this.$router.replace('/admin/competition')">
          <var-icon class="tab-icon" size="30px" name="format-list-checkbox"/>
          竞赛列表
        </div>
        <div class="tab" @click="this.$router.replace('/admin/create-competition')">
          <var-icon class="tab-icon" size="30px" name="plus"/>
          新建竞赛
        </div>
      </var-collapse-item>
      <var-collapse-item title="其它" name="4">
        <div class="tab" @click="this.$router.replace('/admin/notice')">
          <var-icon class="tab-icon" size="30px" name="content-copy"/>
          公告管理
        </div>
        <div class="tab" @click="this.$router.replace('/admin/link')">
          <var-icon class="tab-icon" size="30px" name="plus"/>
          链接设置
        </div>
      </var-collapse-item>
    </var-collapse>
    <div id="bottom">
      <img id="logo" src="~assets/img/logo.png" alt="" style="color: green;" @click="this.$router.replace('/home')">
    </div>
  </div>

  <!--    <var-tabs-->
  <!--      id="tabs"-->
  <!--      class="vertical-tabs"-->
  <!--      elevation-->
  <!--      layout-direction="vertical"-->
  <!--      color="#303f56"-->
  <!--      active-color="#95bbff"-->
  <!--      inactive-color="#f6f6f6"-->
  <!--      v-model:active="active"-->
  <!--    >-->
  <!--      <div id="title">校史竞赛管理系统</div>-->

  <!--      <var-divider description="用户管理"/>-->
  <!--      <var-tab class="tab" @click="this.$router.replace('/admin/user')">-->
  <!--        <var-icon class="tab-icon" size="30px" name="account-circle"/>-->
  <!--        用户信息-->
  <!--      </var-tab>-->
  <!--      <var-tab class="tab" @click="this.$router.replace('/admin/upload-user')">-->
  <!--        <var-icon class="tab-icon" size="30px" name="account-circle"/>-->
  <!--        导入用户-->
  <!--      </var-tab>-->
  <!--      <var-tab class="tab" @click="this.$router.replace('/admin/score')">-->
  <!--        <var-icon class="tab-icon" size="30px" name="file-document-outline"/>-->
  <!--        成绩管理-->
  <!--      </var-tab>-->
  <!--      <var-divider description="题库管理"/>-->
  <!--      <var-tab class="tab" @click="this.$router.replace('/admin/question-edit')">-->
  <!--        <var-icon class="tab-icon" size="30px" name="notebook"/>-->
  <!--        题库信息-->
  <!--      </var-tab>-->
  <!--      <var-tab class="tab" @click="this.$router.replace('/admin/upload-question')">-->
  <!--        <var-icon class="tab-icon" size="30px" name="upload"/>-->
  <!--        上传题目-->
  <!--      </var-tab>-->
  <!--      <var-divider description="竞赛管理"/>-->
  <!--      <var-tab class="tab" @click="this.$router.replace('/admin/competition')">-->
  <!--        <var-icon class="tab-icon" size="30px" name="format-list-checkbox"/>-->
  <!--        竞赛列表-->
  <!--      </var-tab>-->
  <!--      <var-tab class="tab" @click="this.$router.replace('/admin/create-competition')">-->
  <!--        <var-icon class="tab-icon" size="30px" name="plus"/>-->
  <!--        新建竞赛-->
  <!--      </var-tab>-->
  <!--      <var-divider description="其它"/>-->
  <!--      <var-tab class="tab" @click="this.$router.replace('/admin/notice')">-->
  <!--        <var-icon class="tab-icon" size="30px" name="content-copy"/>-->
  <!--        公告管理-->
  <!--      </var-tab>-->
  <!--      <var-tab class="tab" @click="this.$router.replace('/admin/link')">-->
  <!--        <var-icon class="tab-icon" size="30px" name="plus"/>-->
  <!--        链接设置-->
  <!--      </var-tab>-->
  <!-- -->
  <!--    </var-tabs>-->

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
        value: "1",
        re_pattens: [],
        data: [
          {
            re: /^\/admin\/user$/,
            title: "用户管理 > 用户信息",
            active: 0
          },
          {
            re: /^\/admin\/upload-user$/,
            title: "用户管理 > 导入用户",
            active: 1
          },
          {
            re: /^\/admin\/score$/,
            title: "用户管理 > 成绩管理",
            active: 2
          },
          {
            re: /^\/admin\/question-edit$/,
            title: "题库管理 > 题库信息",
            active: 3
          },
          {
            re: /^\/admin\/upload-question$/,
            title: "题库管理 > 上传题目",
            active: 4
          },
          {
            re: /^\/admin\/competition\/[0-9]*$/,
            title: "竞赛管理 > 竞赛详情",
            active: 5
          },
          {
            re: /^\/admin\/competition$/,
            title: "竞赛管理 > 竞赛列表",
            active: 5
          },
          {
            re: /^\/admin\/create-competition$/,
            title: "竞赛管理 > 新建竞赛",
            active: 6
          },
          {
            re: /^\/admin\/notice$/,
            title: "其它 > 公告管理",
            active: 7
          },
          {
            re: /^\/admin\/link$/,
            title: "其它 > 链接管理",
            active: 8
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
    height: 50px;
    font-size: 15px;
    line-height: 50px;
    font-weight: bolder;
    justify-content: left;
    cursor: pointer;
    color: #f6f6f6;
  }

  .tab:hover {
    background-color: #2a2e3b;
    color: #4ebaee;
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
    margin: 10px;
  }


  #bottom {
    position: absolute;
    bottom: 0;
    background-color: rgb(48, 63, 86);
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
