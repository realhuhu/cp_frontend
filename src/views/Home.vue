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
        <var-swipe-item v-for="i in swipe">
          <img class="swipe-item" :src="i.url">
        </var-swipe-item>
      </var-swipe>
      <div class="space"/>

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
              <div class="search">
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
                    <var-icon class="search-btn" name="magnify" @click="search"/>
                  </template>
                </var-input>
              </div>
            </div>
            <var-list
              :finished="finished"
              v-model:loading="loading"
              @load="load">
              <var-cell :key="competition" v-for="competition in competitions">
                <div class="competition-card" @click="pop(competition)">
                  <div class="competition-title">{{competition.title}}</div>
                  <div class="competition-time">
                    <span
                      style="margin-right: 30px">开始时间：{{competition.start_time.substring(0,16).replace("T"," ")}}</span>
                    <span>结束时间：{{competition.end_time.substring(0,16).replace("T"," ")}}</span>
                  </div>
                  <div class="competition-time-pe">
                    <div>开始时间：{{competition.start_time.substring(0,16).replace("T"," ")}}</div>
                    <div>结束时间：{{competition.end_time.substring(0,16).replace("T"," ")}}</div>
                  </div>
                </div>
              </var-cell>
            </var-list>
          </var-tab-item>

          <var-tab-item>
            <div class="clear-fix">
              <div class="search">
                <var-input
                  :hint="false"
                  :line="false"
                  text-color="#333"
                  placeholder="搜索公告"
                  v-model="article_value"
                  @keydown.enter="article_search"
                  @clear="article_search"
                  clearable>
                  <template #prepend-icon>
                    <var-icon class="search-btn" name="magnify" @click="article_search"/>
                  </template>
                </var-input>
              </div>
            </div>
            <var-list
              :finished="article_finished"
              v-model:loading="article_loading"
              @load="article_load">
              <var-cell :key="article" v-for="article in articles">
                <div class="article-card" @click="this.$router.push( `/article/${article.id}`)">
                  <div class="article-title">{{article.title}}</div>
                  <div class=" clear-fix">
                    <div class="article-time right ">
                      {{article.create_time.substring(0,16).replace("T"," ")}}
                    </div>
                  </div>
                  <div class="article-content"> {{article.description}}</div>
                </div>
              </var-cell>
            </var-list>
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
          <div class="card-btn" @click="this.$router.push('/entries')">
            <var-icon class="icon" size="20" name="format-list-checkbox"/>
            <span>参赛记录</span>
            <var-icon class="icon" style="float: right" size="20" name="chevron-right"/>
          </div>
          <br>
          <div class="card-btn" @click="this.$router.push('/exercise')">
            <var-icon class="icon" size="20" name="checkbox-marked-outline"/>
            <span>答题练习</span>
            <var-icon class="icon" style="float: right" size="20" name="chevron-right"/>
          </div>
        </div>
      </div>

      <div class="space"></div>

      <div id="top">
        <div style="padding: 10px;text-align: center">置顶</div>
        <var-divider margin="0"></var-divider>
        <div class="link" v-for="i in top" @click="open(i.url)">
          {{i.title}}
        </div>
      </div>

    </div>

    <var-popup style="border-radius: 10px" v-model:show="is_popup">
      <div id="popup-wrap">
        <div id="title">{{info.title}}
          <var-chip size="small" style="margin: 8px 0" :type="chip_style.type">{{chip_style.text}}</var-chip>
        </div>
        <div class="time">开始时间：{{info.start_time.substring(0,16).replace("T"," ")}}</div>
        <div class="time">结束时间：{{info.end_time.substring(0,16).replace("T"," ")}}</div>
        <div id="tip">题数：{{info.questions}}（{{info.time_limit?`限时${info.time_limit}分钟`:"不限时"}}）</div>
        <div id="answer-num">已有{{info.answer_num}}人作答</div>
        <div id="btn">
          <var-button block type="success" v-if="chip_style.type==='warning'" disabled>
            还未开始
          </var-button>
          <var-button
            block
            type="success"
            v-if="chip_style.type==='success'"
            @click="this.$router.push(`/competition/${this.info.id}`)">
            开始答题
          </var-button>
          <var-button block type="info" disabled v-if="chip_style.type==='danger'">
            已结束
          </var-button>
        </div>
      </div>
    </var-popup>
  </div>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        competitions: [],
        articles: [],
        loading: false,
        article_loading: false,
        finished: false,
        article_finished: false,
        next: false,
        article_next: false,
        active: 0,
        value: "",
        article_value: "",
        is_popup: false,
        info: null,
        chip_style: null,
        swipe: [],
        top: []
      }
    },
    methods: {
      search() {
        this.competitions = []
        this.$ajax.api.get(
          `competition/?search=${this.value}`,
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
      article_search() {
        this.articles = []
        this.$ajax.api.get(
          `common/articles/?search=${this.article_value}`,
        ).then(res => {
          if (res.data.msg !== "错误") {
            for (let i of res.data.result.results) {
              this.articles.push(i)
            }
            this.article_next = res.data.result.next
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
          this.article_loading = false
          this.article_finished = !Boolean(this.article_next)
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
      },
      article_load() {
        this.$ajax.api.get(
          this.article_next || "common/articles/",
        ).then(res => {
          if (res.data.msg !== "错误") {
            for (let i of res.data.result.results) {
              this.articles.push(i)
            }
            this.article_next = res.data.result.next
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
          this.article_loading = false
          this.article_finished = !Boolean(this.article_next)
        }).catch(err => {
          this.$store.commit("initialize")
          this.$tip({
            content: err,
            type: "warning",
            duration: 1000,
          })
        })
      },
      pop(competition) {
        this.is_popup = true
        this.info = competition

        let start = new Date(competition.start_time)
        let end = new Date(competition.end_time)
        let now = new Date()
        if (now < start) {
          this.chip_style = {
            type: "warning",
            text: "还未开始"
          }
        } else if (start < now && now < end) {
          this.chip_style = {
            type: "success",
            text: "开放中"
          }
        } else if (now > end) {
          this.chip_style = {
            type: "danger",
            text: "已结束"
          }
        }

      },
      open(url){
        window.location.replace(url)
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        "common/swipe/"
      ).then(res => {
        this.swipe = res.data.result
      })

      this.$ajax.api.get(
        "common/top/"
      ).then(res => {
        this.top = res.data.result
      })
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

    #top {
      width: 100%;
      padding:0 0 10px;
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

    .competition-card, .article-card {
      padding: 20px;
      border-radius: 5px;
      background-color: #f6f6f6;
      cursor: pointer;
    }

    .competition-title, .article-title {
      font-size: 20px;
      font-weight: bolder;
      line-height: 40px;
      color: #333333;
    }

    .link {
      margin: 10px;
      line-height: 20px;
      text-indent: 10px;
      cursor: pointer;
      color: #555;
    }

    .link:hover {
      color: #4ebaee;
    }

    #popup-wrap {
      width: 500px;
      border-radius: 20px;
      padding: 20px;
      line-height: 30px;
    }

    #app-bar, .competition-time-pe {
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
      height: 100%;
      z-index: -1;
      background-color: #fafafa;
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

    .icon {
      margin: 0 10px;
    }

    #left-content {
      width: 100%;
      margin-bottom: 100px;
      background-color: #fafafa;
    }

    .competition-card, .article-card {
      padding: 10px;
      border-radius: 5px;
      background-color: #f6f6f6;
      cursor: pointer;
    }

    .competition-title, .article-title {
      font-size: 20px;
      font-weight: bolder;
      line-height: 30px;
      color: #333333;
    }


    #popup-wrap {
      width: 90vw;
      border-radius: 10px;
      padding: 20px;
    }
  }

  .search {
    float: right;
    height: 30px;
    margin: 10px 12px 0;
    padding: 2px 10px;
    width: 200px;
    border: 1px solid #f6f6f6;
    border-radius: 10px;
  }

  .search-btn {
    padding: 3px;
    margin: 2px;
    border-radius: 5px;
    background-color: #fff;
    border: 1px dashed rgba(200, 200, 200, 0.8);
  }

  #title {
    line-height: 40px;
    font-size: 20px;
    font-weight: bolder;
  }

  .time {
    line-height: 30px;
  }

  #answer-num {
    padding-bottom: 20px;
    line-height: 30px;
  }
</style>