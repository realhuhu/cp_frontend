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
    <template #left>
      <var-icon name="chevron-left" :size="24" @click="this.$router.return('/home')"/>
      <div :size="24" @click="this.$router.return('/home')">返回</div>
    </template>
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
      <div class="tip">点击可查看详情</div>
      <var-collapse class="panel" accordion v-model="value" :offset="false">
        <var-collapse-item style="cursor: pointer" :key="k" v-for="(item,k) in data" :name="k+''">
          <template #title>
            <div class="title">{{item.title}}</div>
          </template>
          <template #icon>
            <div class="end_score">最终得分:{{score(item)}}</div>
          </template>
          <div class="card">
            <div :key="record.id" v-for="record in item.record">
              <var-divider margin="0">第{{record.answer_times}}次作答</var-divider>
              <div class="item clear-fix" @click="to_record(record,item)">
                <div class="left" style="padding: 10px 0">
                  <div class="time">{{record.start_time.substring(0,16).replace("T"," ")}}</div>
                  <div v-if="record.time_used" class="time">用时:{{record.time_used}}秒</div>
                </div>
                <div class="right">
                  <div class="score" v-if="record.score!==null">{{ record.score }}/{{item.total_num}}</div>
                  <div class="score" v-else>未提交</div>
                </div>
                <div class="right tag" v-if="record.score!==null">得分</div>
              </div>
            </div>
          </div>
        </var-collapse-item>
      </var-collapse>
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
        data: [],
        value: "0"
      }
    },
    methods: {
      score(item) {
        return Math.max(...item.record.map(x => x.score))
      },
      load() {
        this.$ajax.api.get(
          this.next || "competition/entry/",
        ).then(res => {
          console.log(res.data);
          if (res.data.code === 100) {
            for (let i of res.data.result.results) {
              this.data.push(i)
            }
            this.next = res.data.result.next
          }
          this.loading = false
          this.finished = !Boolean(this.next)
        })
      },
      to_record(record, item) {
        if (record.score !== null) {
          this.$router.push(`/record/${record.id}`)
        } else {
          this.$router.push(`/competition/${item.id}`)
        }
      }
    },
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
      height: 60px;
      cursor: pointer;
    }
  }

  @media screen and (max-width: 840px) {
    #banner, #pc-title, #tip-wrap {
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
      height: 60px;
      background-color: #f6f6f6;
      cursor: pointer;
    }
  }


  .title {
    line-height: 40px;
    padding: 5px;
    font-size: 17px;
    font-weight: bolder;
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

  .panel {
    --collapse-header-padding: 0 10px;
    --collapse-content-padding: 0
  }

  .card {
    margin: 5px;
    background-color: #f6f6f6;
    padding: 5px;
    border-radius: 5px;
  }

  .end_score {
    float: right;
    margin: 10px;
    font-size: 14px;
    font-weight: bold;
    color: #4ebaee;
  }

  .time {
    line-height: 20px;
  }

  .tip {
    text-align: center;
    color: #999999;
    font-size: 12px;
    line-height: 30px;
    background-color: #f6f6f6;
  }
</style>