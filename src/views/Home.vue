<template>
  <div id="background"/>
  <var-app-bar
    id="app-bar"
    class="var-elevation--1"
    title="校史校情竞赛"
    title-position="center"
    color="#f6f6f6"
    style="font-weight: bolder;"
    text-color="#333"
  >
    <template #left>
      <img id="logo" src="~assets/img/logo.png" alt="" style="color: green;">
    </template>

    <template #right>
      <var-icon name="message-processing-outline" :size="24"/>
      <div style="width: 1vw;"></div>
    </template>
  </var-app-bar>


  <div id="wrap" class="clear-fix">
    <div id="left">
      <var-swipe class="var-elevation--1" id="swipe" :autoplay="2000">
        <var-swipe-item>
          <img class="swipe-item" src="https://varlet.gitee.io/varlet-ui/cat.jpg">
        </var-swipe-item>
        <var-swipe-item>
          <img class="swipe-item" src="https://varlet.gitee.io/varlet-ui/cat2.jpg">
        </var-swipe-item>
        <var-swipe-item>
          <img class="swipe-item" src="https://varlet.gitee.io/varlet-ui/cat3.jpg">
        </var-swipe-item>
      </var-swipe>
      <div class="space"/>
      <div class="clear-fix" id="pe-card">
        <div class="pe-btn-wrap">
          <var-icon class="icon" size="40" name="format-list-checkbox"/>
          <div>参赛记录</div>
        </div>
        <div class="pe-btn-wrap">
          <var-icon class="icon" size="40" name="checkbox-marked-outline"/>
          <div>答题练习</div>
        </div>
      </div>

      <div id="left-content">
        <var-tabs
          class="var-elevation--1"
          color="white"
          active-color="#4ebaee"
          inactive-color="#333"
          v-model:active="active"
        >
          <var-tab>竞赛列表</var-tab>
          <var-tab>公告</var-tab>
          <span style="width: 500px"></span>
        </var-tabs>

        <var-tabs-items v-model:active="active">
          <var-tab-item>
            <div class="clear-fix">
              <div id="search">
                <var-input
                  :hint="false"
                  :line="false"
                  text-color="#333"
                  placeholder="搜索竞赛"
                  v-model="value"
                  @keydown.enter="search"
                  @clear="search"
                  clearable>
                  <template #prepend-icon>
                    <var-icon id="search-btn" name="magnify" @click="search"/>
                  </template>
                </var-input>
              </div>
            </div>
            <var-list
              :finished="finished"
              v-model:loading="loading"
              @load="load"
            >
              <var-cell :key="competition" v-for="competition in competitions">
                <div class="competition-card">
                  <div class="competition-title">{{competition.title}}</div>
                  <div class="competition-time">
                    <span style="margin-right: 30px">开始时间：{{competition.start_time.replace("T"," ")}}</span>
                    <span>结束时间：{{competition.end_time.replace("T"," ")}}</span>
                  </div>
                  <div class="competition-time-pe">
                    <div>开始时间：{{competition.start_time.replace("T"," ")}}</div>
                    <div>结束时间：{{competition.end_time.replace("T"," ")}}</div>
                  </div>
                </div>
              </var-cell>
            </var-list>
          </var-tab-item>

          <var-tab-item>
            很多人不长眼睛，嚣张都靠武器。
            赤手空拳就缩成蚂蚁。
            不用麻烦了，不用麻烦了。
            不用麻烦，不用麻烦了，不用麻烦了。
          </var-tab-item>
        </var-tabs-items>
      </div>
    </div>

    <div id="center"/>

    <div id="right">

      <div id="card" class="var-elevation--12">
        <div id="card-title">我的</div>
        <var-divider dashed/>
        <div id="card-btn-wrap">
          <div style="height: 10px;"></div>
          <div class="card-btn">
            <var-icon class="icon" size="20" name="format-list-checkbox"/>
            <span>参赛记录</span>
            <var-icon class="icon" style="float: right" size="20" name="chevron-right"/>
          </div>
          <br>
          <div class="card-btn">
            <var-icon class="icon" size="20" name="checkbox-marked-outline"/>
            <span>答题练习</span>
            <var-icon class="icon" style="float: right" size="20" name="chevron-right"/>
          </div>
        </div>
      </div>

      <div class="space"></div>

    </div>

  </div>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        competitions: [],
        loading: false,
        finished: false,
        next: false,
        active: 0,
        value: ""
      }
    },
    methods: {
      search() {
        this.competitions = []
        this.$ajax.api.get(
          `competition/?search=${this.value}` ,
        ).then(res => {
          if (res.data.msg !== "错误") {
            for (let i of res.data.result.results) {
              this.competitions.push(i)
            }
            this.next = res.data.result.next
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
          this.loading = false
          this.finished = !Boolean(this.next)
        }).catch(err => {
          this.$store.commit("initialize")
          this.$tip({
            content: err,
            type: "warning",
            duration: 1000,
          })
        })
      },
      load() {
        this.$ajax.api.get(
          this.next || "competition/",
        ).then(res => {
          if (res.data.msg !== "错误") {
            for (let i of res.data.result.results) {
              this.competitions.push(i)
            }
            this.next = res.data.result.next
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
          this.loading = false
          this.finished = !Boolean(this.next)
        }).catch(err => {
          this.$store.commit("initialize")
          this.$tip({
            content: err,
            type: "warning",
            duration: 1000,
          })
        })
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

    #wrap {
      width: 1000px;
      max-width: 95vw;
      margin: 80px auto;
    }

    #left {
      float: left;
      width: 74%;
    }

    #center {
      width: 2%;
    }

    #right {
      float: left;
      margin-left: 2%;
      width: 24%;
    }

    #swipe {
      height: 200px;
      border-radius: 5px;
    }

    .swipe-item {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    #card-title {
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      font-weight: bolder;
    }

    #card {
      width: 100%;
      height: 200px;
      border-radius: 5px;
      background-color: white;
    }

    #card-btn-wrap {
      width: 150px;
      margin: 0 auto;
    }

    .card-btn {
      width: 100%;
      line-height: 40px;
      font-size: 15px;
      font-weight: bolder;
      border-radius: 5px;
      background-color: #ffe14c;
      cursor: pointer;
    }

    .icon {
      margin: 10px;
      cursor: pointer;
    }

    .space {
      height: 50px;
    }

    #left-content {
      width: 100%;
      background-color: white;
      border-radius: 10px;
      margin-bottom: 300px;
    }

    .competition-card {
      padding: 20px;
      border-radius: 5px;
      background-color: #f6f6f6;
      cursor: pointer;
    }

    .competition-title {
      font-size: 20px;
      font-weight: bolder;
      line-height: 40px;
      color: #333333;
    }


    #app-bar, #pe-card, .competition-time-pe {
      display: none;
    }
  }

  @media screen and (max-width: 840px) {
    #center, #right, .competition-time {
      display: none;
    }

    #background {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100vw;
      z-index: -1;
      background-color: #f6f6f6;
    }

    #app-bar {
      height: 54px;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
    }

    #logo {
      line-height: 64px;
      height: 30px;
    }

    #wrap {
      width: 100%;
    }

    #swipe {
      margin-top: 54px;
      height: 150px;
    }

    .swipe-item {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    #pe-card {
      padding: 5px;
      background-color: white;
      margin-bottom: 10px;
      border-radius: 0 0 5px 5px;
    }

    .pe-btn-wrap {
      width: 60px;
      float: left;
      margin: 10px;
      font-size: 10px;
      text-align: center;
      color: #333;
    }

    .icon {
      margin: 0 10px;
    }

    #left-content {
      width: 100%;
      padding-bottom: 100px;
      background-color: #fafafa;
    }

    .competition-card {
      padding: 10px;
      border-radius: 5px;
      background-color: #f6f6f6;
      cursor: pointer;
    }

    .competition-title {
      font-size: 20px;
      font-weight: bolder;
      line-height: 30px;
      color: #333333;
    }

  }

  #search {
    float: right;
    height: 30px;
    margin: 10px 12px 0;
    padding: 2px 10px;
    width: 200px;
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
</style>