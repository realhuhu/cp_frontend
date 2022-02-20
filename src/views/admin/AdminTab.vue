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
    <var-divider description="题库管理"/>
    <var-tab class="tab" @click="this.$router.replace('/admin/question-edit')">
      <var-icon class="tab-icon" size="30px" name="notebook"/>
      题库信息
    </var-tab>
    <var-tab class="tab" @click="this.$router.replace(('/admin/upload-question'))">
      <var-icon class="tab-icon" size="30px" name="upload"/>
      上传题目
    </var-tab>
    <var-divider description="竞赛管理"/>
    <var-tab class="tab">
      <var-icon class="tab-icon" size="30px" name="format-list-checkbox"/>
      竞赛列表
    </var-tab>
    <var-tab class="tab">
      <var-icon class="tab-icon" size="30px" name="file-document-outline"/>
      竞赛详情
    </var-tab>
    <var-tab class="tab">
      <var-icon class="tab-icon" size="30px" name="plus"/>
      新建竞赛
    </var-tab>
    <div id="foot"></div>
  </var-tabs>
  <div id="banner">
    <span>
      <var-icon style="margin: 25px 10px 25px 50px" size="30px" name="menu-open"/>
    </span>
    <span>当前：{{route}}</span>

    <span id="username">{{user.username}}</span>
  </div>

  <router-view/>

  <div style="height: 30vh"></div>
</template>

<script>
  export default {
    name: "AdminTag",
    watch: {
      "$route"() {
        let path = window.location.pathname
        this.route = this.raw[path]
        this.active = Object.keys(this.raw).indexOf(path)
      }
    },
    data() {
      return {
        active: 0,
        raw: {
          "/admin/user": "用户管理 > 用户信息",
          "/admin/question-edit": "题库管理 > 题库信息",
          "/admin/upload-question": "题库管理 > 上传题目",

        },
        route: ""
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
    created() {
      let path = window.location.pathname

      this.route = this.raw[path]
      this.active = Object.keys(this.raw).indexOf(path)
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
    height: 50vh;
  }

  #banner {
    position: fixed;
    left: 250px;
    top: 0;
    width: calc(100vw - 250px);
    line-height: 80px;
    background-color: #f6f6f6;
  }

  #username {
    font-size: 20px;
    font-weight: bolder;
    float: right;
    color: #444;
    margin-right: 70px;
  }
</style>
