<template>
  <div id="background"></div>

  <var-app-bar
    v-if="ready"
    id="app-bar"
    class="var-elevation--1"
    title="答题详情"
    title-position="center"
    color="#f6f6f6"
    style="font-weight: bolder;"
    text-color="#333"
  >
    <template #left>
      <var-icon name="chevron-left" :size="24" @click="this.$router.return('/home')"/>
    </template>
  </var-app-bar>

  <div class="container">
    <div class="question" v-for="(question,k) in questions">
      <div class="order">第{{k+1}}题
        <var-icon v-if="question.right_answer===question.answer" color="#00c48f" name="check-circle-outline"/>
        <var-icon v-else color="red" name="close-circle-outline"/>
      </div>
      <div class="content">{{question.content}}</div>
      <div v-if="choice_num(question)===2">
        <div class="choice">{{question.choice_a}}</div>
        <div class="choice">{{question.choice_b}}</div>
        <div style="display: flex;line-height: 40px;justify-content: left">
          <div class="answer">正确答案：{{answer_map[question.right_answer]}}</div>
          <div class="answer" :class="{wrong:question.right_answer!==question.answer}">
            我的答案：{{answer_map[question.answer]||"未作答"}}
          </div>
        </div>
      </div>
      <div v-else>
        <div class="choice">A、{{question.choice_a}}</div>
        <div class="choice">B、{{question.choice_b}}</div>
        <div class="choice">C、{{question.choice_c}}</div>
        <div class="choice">D、{{question.choice_d}}</div>
        <div style="display: flex;line-height: 40px;justify-content: left">
          <div class="answer">正确答案：{{question.right_answer}}</div>
          <div class="answer" :class="{wrong:question.right_answer!==question.answer}">
            我的答案：{{question.answer||"未作答"}}
          </div>
        </div>
      </div>

    </div>
  </div>

</template>


<script>
  export default {
    name: "Record",
    data() {
      return {
        ready: false,
        info: null,
        questions: null,
        cursor: 0,
        show: false,
        time_limit: null,
        page: 0,
        answer_map: {
          "A": "√",
          "B": "X"
        }
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
    },
    beforeCreate() {
      this.$ajax.api.get(
        `competition/${this.$route.params.id}/record/`,
      ).then(res => {
          if (res.data.code === 121) {
            this.$tip({
              content: "查看答题详情",
              type: "success",
              duration: 1000,
            })
            this.questions = res.data.result.questions
            for (let i of this.questions) {
              if (i.right_answer === "√") {
                i.right_answer = "A"
              }
              if (i.right_answer === "X") {
                i.right_answer = "B"
              }
            }
            this.info = res.data.result.info
            this.ready = true
          } else if (res.data.code === 2000) {
            this.$tip({
              content: "记录不存在",
              type: "warning",
              duration: 1000,
            })
            this.$router.replace("/entries")
          } else {
            this.$tip({
              content: res.data.msg,
              type: "warning",
              duration: 2000,
            })
          }
        }
      )
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
    #app-bar {
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


    #crease div {
      cursor: pointer;
    }

    #crease div:hover {
      color: #4ebaee;
    }

    .container {
      width: 800px;
      margin: 0 auto;
    }

    .question {
      padding: 10px 20px;
      margin-bottom: 7px;
      background-color: rgba(255, 255, 255, .9);
      border-radius: 5px;
    }

    .order {
      font-size: 14px;
      color: #999999;
      display: flex;
      justify-content: space-between;
      line-height: 40px;
    }

    .content {
      line-height: 20px;
      margin: 10px 0;
      min-height: 40px;
    }

    .choice {
      line-height: 25px;
    }

    .answer {
      line-height: 40px;
      margin-right: 10px;
      color: #00c48f
    }

    .wrong {
      color: red;
    }
  }

  @media screen and (max-width: 840px) {
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

    #crease div {
      margin: 20px;
    }

    .container {
      padding-top: 54px;
    }

    .question {
      padding: 10px 20px;
      margin-bottom: 7px;
      background-color: white;
      border-radius: 5px;
    }

    .order {
      font-size: 14px;
      color: #999999;
      display: flex;
      justify-content: space-between;
      line-height: 40px;
    }

    .content {
      line-height: 20px;
      margin: 10px 0;
      min-height: 40px;
    }

    .choice {
      line-height: 25px;
    }

    .answer {
      line-height: 40px;
      margin-right: 10px;
      color: #00c48f
    }

    .wrong {
      color: red;
    }
  }

</style>