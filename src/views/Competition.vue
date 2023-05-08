<template>
  <div id="background"></div>

  <var-app-bar
    v-if="ready"
    id="app-bar"
    class="var-elevation--1"
    :title="info.title"
    title-position="center"
    color="#f6f6f6"
    style="font-weight: bolder;"
    text-color="#333"
  >
    <template #left>
      <var-icon name="chevron-left" :size="24" @click="this.$router.return('/home')"/>
    </template>
  </var-app-bar>

  <div v-if="ready" class="var-elevation--5" id="wrap">
    <div id="pc-title">
      {{info.title}}
    </div>
    <div v-if="info.time_limit" id="timer">
      <var-countdown :time="time_limit" format="HH 时 mm 分 ss 秒" @end="end"/>
      <var-divider margin="0"/>
    </div>

    <div id="progress">{{cursor+1}}/{{info.total_num}}</div>
    <div id="content">
      {{questions[cursor].content}}
    </div>

    <div id="options" @click="upload(false)">
      <div
        class="option"
        :class="{active:questions[cursor].answer==='A'}" v-if="questions[cursor].choice_a"
        @click="questions[cursor].answer='A'">
        {{choice_num(questions[cursor])>2? "A.":""}}{{questions[cursor].choice_a}}
      </div>


      <div
        class="option"
        :class="{active:questions[cursor].answer==='B'}" v-if="questions[cursor].choice_b"
        @click="questions[cursor].answer='B'">
        {{choice_num(questions[cursor])>2? "B.":""}}{{questions[cursor].choice_b}}
      </div>


      <div
        class="option"
        :class="{active:questions[cursor].answer==='C'}" v-if="questions[cursor].choice_c"
        @click="questions[cursor].answer='C'">
        C.{{questions[cursor].choice_c}}
      </div>


      <div
        class="option"
        :class="{active:questions[cursor].answer==='D'}" v-if="questions[cursor].choice_d"
        @click="questions[cursor].answer='D'">
        D.{{questions[cursor].choice_d}}
      </div>


    </div>

    <div id="crease" class="clear-fix">
      <div class="left" @click="cursor_decrease">
        <var-icon name="chevron-left"/>
        上一题
      </div>
      <div class="right" @click="cursor_increase">
        下一题
        <var-icon name="chevron-right"/>
      </div>
    </div>

    <div id="submit">
      <var-button block type="success" @click="submit">提交</var-button>
    </div>

    <div id="tip">
      按左右键或AD键可快速翻页
    </div>
  </div>

  <div id="foot" v-if="ready" class="var-elevation--5">
    <div id="foot-text" @click="show=true">答题卡</div>
  </div>

  <div id="mask" v-if="show" @click="show=false"/>

  <div id="popup" v-if="show">
    <div id="popup-title">
      <div>答题卡</div>
    </div>
    <div v-for="(v,k) in questions" class="round" :class="{answered:v.answer}" @click="change_cursor(k)">
      <span class="round-text">{{k+1}}</span>
    </div>
  </div>

  <div id="pc-answer" v-if="ready" class="var-elevation--5">
    <div id="answer-title">答题卡</div>
    <var-divider/>
    <div style="min-height: 300px">
      <div v-for="(v,k) in questions" class="round" :class="{answered:v.answer}" @click="change_cursor(k)">
        <span class="round-text">{{k+1}}</span>
      </div>
    </div>
    <div id="pc-submit">
      <var-button block type="success" @click="submit">提交</var-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Competition",
    data() {
      return {
        ready: false,
        info: null,
        questions: null,
        cursor: 0,
        show: false,
        time_limit: null,
        page: 0,
      }
    },
    methods: {
      choice_num(question) {
        let num = 0
        if (question.choice_a) num++
        if (question.choice_b) num++
        if (question.choice_c) num++
        if (question.choice_d) num++
        return num
      },
      cursor_decrease() {
        if (this.cursor !== 0) this.cursor--
      },
      cursor_increase() {
        if (this.cursor !== this.info.total_num - 1) this.cursor++
      },
      change_cursor(k) {
        this.show = false
        this.cursor = k
      },
      submit() {
        if (this.questions.filter(x => !x.answer).length) {
          this.$dialog({
            message: "还有题目未做，确认提交？",
          }).then(res => {
            if (res === "confirm") {
              this.upload(true)
            }
          })
        } else {
          this.upload(true)
        }
      },
      end() {
        if (window.location.pathname.indexOf("competition") !== -1) this.upload(true)
      },
      upload(finish) {
        this.$ajax.api.post(
          `competition/${this.$route.params.id}/upload/`,
          {
            answer: this.questions,
          }
        ).then(res => {
          if (res.data.code === 122) {
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 1000,
            })
          }
        })
        if (finish) {
          this.$router.replace(`/score/${this.$route.params.id}/`)
        }
      },
      map(raw) {
        let data = []
        for (let i of raw) {
          if (i["right_answer"] === "√") {
            i["right_answer"] = "A"
          } else if (i["right_answer"] === "X") {
            i["right_answer"] = "B"
          }
          data.push(i)
        }
        return data
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        `competition/${this.$route.params.id}/questions/`,
      ).then(res => {
        if (res.data.code === 800) {
          this.$tip({
            content: "比赛还未开始",
            type: "warning",
            duration: 3000,
          })
          this.$router.replace(`/home/`)
        } else if (res.data.code === 801) {
          this.$tip({
            content: "比赛已结束",
            type: "warning",
            duration: 3000,
          })
          this.$router.replace(`/home/`)
        } else if (res.data.code === 802) {
          this.$tip({
            content: "您已超时",
            type: "warning",
            duration: 3000,
          })
          this.$router.replace(`/record/${res.data.result.id}/`)
        } else if (res.data.code === 803) {
          this.$tip({
            content: "查看答题详情",
            type: "success",
            duration: 1000,
          })
          this.questions = this.map(res.data.result.questions)
          this.info = res.data.result.info
          this.ready = true
        } else if (res.data.code === 2004) {
          this.$tip({
            content: "答题次数已用完",
            type: "warning",
            duration: 3000,
          })
          this.$router.replace(`/home`)
        } else if (res.data.code === 121) {
          this.questions = res.data.result.questions
          this.info = res.data.result.info
          this.time_limit = this.info.time_limit * 60 * 1000
          if (this.info.start) {
            let start = new Date(this.info.start)
            let now = new Date()
            this.time_limit -= now - start
          }
          this.ready = true
          this.$tip({
            content: `第${this.info.times}次答题，共${this.info.answer_times}次机会`,
            type: "success",
            duration: 3000,
          })
        } else {
          this.$tip({
            content: res.data.msg,
            type: "warning",
            duration: 3000,
          })
        }
      }).catch(err => {
        this.$tip({
          content: err,
          type: "error",
          duration: 3000,
        })
      })
    },
    mounted() {
      let _this = this;
      document.onkeydown = function (e) {
        let key = window.event.keyCode;
        if (key === 65 || key === 37) {
          _this.cursor_decrease()
        }
        if (key === 68 || key === 39) {
          _this.cursor_increase()
        }
      };
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #app-bar, #popup, #mask, #foot, #submit {
      display: none;
    }

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
      background-color: white;
      position: relative;
      left: 2%;
      top: 2vh;
      width: calc(95% - 400px);
      border-radius: 20px;
    }

    #pc-title {
      margin-top: 20px;
      line-height: 60px;
      text-indent: 30px;
      font-size: 30px;
      font-weight: bolder;
    }

    #timer {
      line-height: 40px;
      font-size: 20px;
      text-indent: 30px;
      color: #888;
    }

    #progress {
      margin: 30px;
      font-size: 20px;
    }

    #content {
      margin: 30px;
      min-height: 200px;
    }

    .option {
      margin: 10px 30px;
      border-radius: 5px;
      border: 1px solid #ddd;
      line-height: 25px;
      padding: 20px;
    }

    #crease {
      margin: 30px;
    }

    #tip {
      margin: 0 30px 30px;
      color: #aaa;
    }

    #pc-answer {
      background-color: white;
      position: fixed;
      right: 2%;
      top: 80px;
      width: 400px;
      border-radius: 20px;
    }

    #answer-title {
      line-height: 70px;
      font-size: 30px;
      text-align: center;
    }

    .round {
      margin: 2%;
      width: 6%;
      background-color: #f6f6f6;
      border-radius: 50%;
      display: inline-block;
      text-align: center;
      font-weight: bolder;
    }

    .round::before {
      content: '';
      display: inline-block;
      padding-top: 100%;
      height: 100%;
      vertical-align: middle;
    }

    .round-text {
      display: inline-block;
      vertical-align: middle;
    }

    #pc-submit {
      margin: 30px;
    }

    #crease div, .option, .round {
      cursor: pointer;
    }

    #crease div:hover {
      color: #4ebaee;
    }

    .option:hover {
      background-color: #cfedff;
      border: 1px solid #cfedff;
    }

    .round:hover {
      background-color: #cfedff;
    }
  }

  @media screen and (max-width: 840px) {
    #pc-title, #pc-answer, #tip {
      display: none;
    }

    #background {
      position: fixed;
      left: 0;
      top: 0;
      background-color: #f6f6f6;
      width: 100%;
      height: 100%;
      z-index: -1;
    }

    #app-bar {
      height: 54px;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
    }

    #wrap {
      width: 100vw;
      background-color: white;
      border-radius: 0 0 5px 5px;
      margin: 54px 0 20vh;
    }

    #timer {
      line-height: 50px;
      font-size: 20px;
      color: #888;
      text-align: center;
    }

    #content {
      padding: 20px;
      min-height: 100px;
    }

    #options {
      padding: 20px;
    }

    .option {
      margin: 10px 0;
      padding: 10px;
      border-radius: 5px;
      border: 1px solid #ddd;
    }


    #progress {
      padding: 10px 0;
      margin: 0 20px;
      color: #888;
    }


    #crease div {
      margin: 20px;
    }

    #submit {
      padding: 20px;
    }

    #foot {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 46px;
      background-color: white;
    }

    #foot-text {
      line-height: 46px;
      text-align: center;
      font-size: 20px;
      font-weight: bolder;
      color: #41a0c9;
    }

    #mask {
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(200, 200, 200, .8);
    }

    #popup {
      position: fixed;
      left: 0;
      bottom: 0;
      height: 50vh;
      border-radius: 20px 20px 0 0;
      background-color: white;
      padding: 0 1vw 5vh;
      overflow: scroll;
    }

    #popup-title {
      margin: 0 auto;
      left: 0;
      top: 50%;
      line-height: 40px;
      font-size: 20px;
      text-align: center;
      font-weight: bolder;
    }

    .round {
      margin: 2vw;
      width: 12vw;
      height: 12vw;
      background-color: #f6f6f6;
      border-radius: 50%;
      display: inline-block;
      text-align: center;
      font-weight: bolder;
    }

    .round::before {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }

    .round-text {
      display: inline-block;
      vertical-align: middle;
    }


  }

  .active {
    border: 1px solid #4ebaee;
    color: #4ebaee;
  }

  .answered {
    background-color: #4ebaee;
    color: white;
  }

  .correct_answered {
    background-color: #00c48f;
    color: white;
  }

  .error_answered {
    background-color: #f44336;
    color: white;
  }

  .correct {
    border: 1px solid #00c48f;
    color: #00c48f;
  }

  .error {
    border: 1px solid #f44336;
    color: #f44336;
  }

</style>