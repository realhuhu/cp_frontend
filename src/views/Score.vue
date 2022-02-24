<template>
  <div id="banner"/>


  <var-app-bar
    id="app-bar"
    class="var-elevation--1"
    title-position="center"
    color="#f6f6f6"
    text-color="#333"
  >
    <template #left>
      <var-icon name="chevron-left" :size="24" @click="this.$router.return('/user-info')"/>
      <div :size="24" @click="this.$router.return('/user-info')">返回</div>
    </template>
  </var-app-bar>

  <div v-if="ready" id="wrap">
    <div id="icon">
      <var-icon size="80px" color="#00c48f" name="checkbox-marked-outline"/>
    </div>
    <div id="score">
      得分：{{data.score}}/{{data.total}}
    </div>
    <div id="time">
      用时：{{data.time_used}}秒
    </div>
    <div id="btn">
      <var-button type="success" block @click="this.$router.replace('/home')">返回主页</var-button>
    </div>
  </div>

  <div id="calc" v-else>
    加载成绩中...
  </div>
</template>

<script>
  export default {
    name: "Score",
    data() {
      return {
        data: {},
        ready: false,
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        `competition/${this.$route.params.id}/score/`,
      ).then(res => {
        if (res.data.code === 123) {
          this.data = res.data.result
        } else if (res.data.code === 804) {
          this.$tip({
            content: "未参加比赛或未提交",
            type: "warning",
            duration: 3000,
          })
          this.$router.push("/home")
        }
        this.ready = true
      })
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
      margin: 80px;
    }

    #icon {
      text-align: center;
    }

    #btn {
      width: 100px;
      margin: 20px auto;
    }

    #calc {
      line-height: 40px;
      text-align: center;
      margin: 80px 0;
      font-size: 20px;
      font-weight: bolder;
    }

    #score, #time {
      line-height: 50px;
      font-size: 30px;
      text-align: center;
    }
  }

  @media screen and (max-width: 840px) {
    #wrap {
      margin: 80px;
    }

    #calc {
      line-height: 40px;
      text-align: center;
      margin: 80px 0;
      font-size: 20px;
      font-weight: bolder;
    }

    #icon {
      text-align: center;
    }

    #score, #time {
      line-height: 40px;
      font-size: 20px;
      text-align: center;
    }

    #btn {
      display: none;
    }
  }

</style>