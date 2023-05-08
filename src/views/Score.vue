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
      <var-icon v-if="valid" size="80px" color="#00c48f" name="checkbox-marked-outline"/>
      <var-icon v-else size="80px" color="red" name="information-outline"/>
    </div>
    <div v-if="valid">
      <div id="score">
        得分：{{data.score}}/{{data.total}}
      </div>
      <div id="time">
        用时：{{data.time_used}}秒
      </div>

    </div>
    <div v-else>
      <div id="invalid">成绩无效</div>
    </div>

    <div class="btn">
      <var-button type="success" block @click="this.$router.replace('/home')">返回主页</var-button>
    </div>
    <div class="btn2">
      <var-button type="info" block @click="this.$router.replace(`/record/${this.data.id}`)">查看详情
      </var-button>
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
        valid: true
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
        } else if (res.data.code === 805) {
          this.valid = false
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

    .btn,.btn2 {
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

    #score, #time, #invalid {
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

    #score, #time, #invalid {
      line-height: 40px;
      font-size: 20px;
      text-align: center;
    }

    .btn {
      display: none;
    }
  }

</style>