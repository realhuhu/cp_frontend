<template>
  <div id="banner"/>

  <var-app-bar
    id="app-bar"
    class="var-elevation--1"
    title="参赛记录"
    title-position="center"
    color="#f6f6f6"
    text-color="#333"
  >
  </var-app-bar>

  <div id="tip-wrap">
    <span id="to-login" @click="this.$router.push('/home')">主页</span>
    <span>&nbsp;&gt;&nbsp;参赛记录</span>
  </div>

  <div id="wrap">
    <div id="pc-title">
      参赛记录
      <var-divider margin="0"/>
    </div>
    <var-list
      :finished="finished"
      v-model:loading="loading"
      @load="load"

    >
      <var-cell :key="item" v-for="item in data" style="padding:0">
        <div class="item">
          <div class="left-wrap">
            <div class="title"> {{ item.competition_name }}</div>
            <div class="time"> 参赛时间:{{ item.start_time.substring(0,16).replace("T"," ") }}</div>
          </div>
          <div class="right">
            <div class="score" v-if="item.score!==null">{{ item.score }}/{{item.total}}</div>
            <div class="score" v-else>未提交</div>
          </div>
          <div class="right tag" v-if="item.score!==null">得分</div>
        </div>
        <var-divider class="pc-divider" margin="0"/>

      </var-cell>
    </var-list>
  </div>
</template>

<script>
  export default {
    name: "Entries",
    data() {
      return {
        finished: false,
        loading: false,
        next: null,
        data: []
      }
    },
    methods: {
      load() {
        this.$ajax.api.get(
          this.next || "competition/entry/",
        ).then(res => {
          if (res.data.code === 100) {
            for (let i of res.data.result.results) {
              this.data.push(i)
            }
            this.next = res.data.result.next
          }
          this.loading = false
          this.finished = !Boolean(this.next)
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

    #tip-wrap {
      margin: 20px 25vw 0;
    }

    #to-login {
      cursor: pointer;
      color: #3a7afe;
    }

    #wrap {
      width: 400px;
      margin: 40px auto;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
      border-radius: 10px;
    }

    #pc-title {
      line-height: 60px;
      font-size: 25px;
      font-weight: bolder;
      text-align: center;
    }

    .item {
      margin: 20px;
    }
  }

  @media screen and (max-width: 840px) {
    #banner, #pc-title, .pc-divider, #tip-wrap {
      display: none;
    }

    #app-bar {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 54px;
    }

    #wrap {
      margin: 54px 0;

    }

    .item {
      margin: 2px;
      padding: 3px;
      border-radius: 2px;
      background-color: #f6f6f6;
    }
  }


  .title {
    line-height: 40px;
    font-size: 20px;
    font-weight: bolder;
  }

  .time {
    line-height: 20px;
  }

  .score {
    margin: 5px;
    line-height: 50px;
    text-align: center;
    font-weight: bolder;
    color: #4ebaee;
  }

  .tag {
    line-height: 60px;
    font-weight: bolder;
    color: #4ebaee;
  }

  .left-wrap {
    display: inline-block;
  }
</style>