<template>
  <div id="background"></div>

  <var-app-bar
    id="app-bar"
    class="var-elevation--1"
    title="练习"
    title-position="center"
    color="#f6f6f6"
    style="font-weight: bolder;"
    text-color="#333"
  ></var-app-bar>

  <div id="wrap" v-if="ready">
    <div id="tip-wrap">
      <span id="to-login" @click="this.$router.push('/home')">主页</span>
      <span>&nbsp;&gt;&nbsp;答题练习</span>
    </div>
    <div id="content">{{ question.content }}</div>

    <div class="options" v-if="!answered">
      <div v-if="question.question_type===0">
        <div v-if="question.choice_a"
             @click="answer='A'"
             class="option"
             :class="{active:answer==='A'}">
          A.{{ question.choice_a }}
        </div>
        <div v-if="question.choice_b"
             @click="answer='B'"
             class="option"
             :class="{active:answer==='B'}">
          B.{{ question.choice_b }}
        </div>
        <div v-if="question.choice_c"
             @click="answer='C'"
             class="option"
             :class="{active:answer==='C'}">
          C.{{ question.choice_c }}
        </div>
        <div v-if="question.choice_d"
             @click="answer='D'"
             class="option"
             :class="{active:answer==='D'}">
          D.{{ question.choice_d }}
        </div>
      </div>

      <div v-else-if="question.question_type===1">
        <div v-if="question.choice_a"
             @click="answer=question.choice_a"
             class="option"
             :class="{active:answer===question.choice_a}">
          {{ question.choice_a }}
        </div>
        <div v-if="question.choice_b"
             @click="answer=question.choice_b"
             class="option"
             :class="{active:answer===question.choice_b}">
          {{ question.choice_b }}
        </div>
      </div>

      <div v-else-if="question.question_type===2">
        <div v-if="question.choice_a"
             @click="handle('A')"
             class="option"
             :class="{active:answer.includes('A')}">
          A.{{ question.choice_a }}
        </div>
        <div v-if="question.choice_b"
             @click="handle('B')"
             class="option"
             :class="{active:answer.includes('B')}">
          B.{{ question.choice_b }}
        </div>
        <div v-if="question.choice_c"
             @click="handle('C')"
             class="option"
             :class="{active:answer.includes('C')}">
          C.{{ question.choice_c }}
        </div>
        <div v-if="question.choice_d"
             @click="handle('D')"
             class="option"
             :class="{active:answer.includes('D')}">
          D.{{ question.choice_d }}
        </div>
      </div>
    </div>

    <div v-else class="options">
      <div v-if="question.question_type===0">
        <div v-if="question.choice_a"
             class="option"
             :class="{
        correct:right_answer==='A',
        wrong:answer==='A' && answer!==right_answer
      }">
          A.{{ question.choice_a }}
        </div>
        <div v-if="question.choice_b"
             class="option"
             :class="{
        correct:right_answer==='B',
        wrong:answer==='B' && answer!==right_answer
      }">
          B.{{ question.choice_b }}
        </div>
        <div v-if="question.choice_c"
             class="option"
             :class="{
        correct: right_answer==='C',
        wrong:answer==='C' && answer!==right_answer
      }">
          C.{{ question.choice_c }}
        </div>
        <div v-if="question.choice_d"
             class="option"
             :class="{
        correct:right_answer==='D',
        wrong:answer==='D' && answer!==right_answer
      }">
          D.{{ question.choice_d }}
        </div>
      </div>

      <div v-if="question.question_type===1">
        <div v-if="question.choice_a"
             class="option"
             :class="{
        correct:right_answer===question.choice_a,
        wrong:answer===question.choice_a && answer!==right_answer
      }">
          {{ question.choice_a }}
        </div>
        <div v-if="question.choice_b"
             class="option"
             :class="{
        correct:right_answer===question.choice_b,
        wrong:answer===question.choice_b && answer!==right_answer
      }">
          {{ question.choice_b }}
        </div>
      </div>

      <div v-if="question.question_type===2">
        <div v-if="question.choice_a"
             class="option"
             :class="{
        correct:right_answer.includes('A'),
        wrong:answer.includes('A') && !answer.includes('A')
      }">
          A.{{ question.choice_a }}
        </div>
        <div v-if="question.choice_b"
             class="option"
             :class="{
        correct:right_answer.includes('B'),
        wrong:answer.includes('B') && !right_answer.includes('B')
      }">
          B.{{ question.choice_b }}
        </div>
        <div v-if="question.choice_c"
             class="option"
             :class="{
        correct:right_answer.includes('C'),
        wrong:answer.includes('C') && !right_answer.includes('C')
      }">
          C.{{ question.choice_c }}
        </div>
        <div v-if="question.choice_d"
             class="option"
             :class="{
        correct:right_answer.includes('D'),
        wrong:answer.includes('D') && !right_answer.includes('D')
      }">
          D.{{ question.choice_d }}
        </div>
      </div>
    </div>

    <div id="next" class="right" @click="refresh">
      换一题
      <var-icon name="chevron-right"/>
    </div>
    <div id="submit">
      <var-button block type="success" @click="submit">确定</var-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "exercise",
  data() {
    return {
      question: null,
      ready: false,
      answer: "",

      answered: false,
      right: null,
      right_answer: null
    }
  },
  computed: {
    choice_num() {
      let num = 0
      if (this.question.choice_a) num++
      if (this.question.choice_b) num++
      if (this.question.choice_c) num++
      if (this.question.choice_d) num++
      return num
    }
  },
  methods: {
    handle(option) {
      let a = this.answer.split("")
      if (a.includes(option)) {
        a.splice(a.indexOf(option), 1)
      } else {
        a.push(option)
      }
      this.answer = a.join("")
    },
    submit() {
      if (!this.answer) return
      this.$ajax.api.post(
        `competition/exercise/random/`,
        {
          id: this.question.id,
          answer: this.answer
        }
      ).then(res => {
        this.answered = true
        this.right = res.data.result.right
        this.right_answer = res.data.result.answer
      })
    },
    refresh() {
      this.$ajax.api.get(
        `competition/exercise/random/`,
      ).then(res => {
        this.question = res.data.result
        this.answer = ""
        this.answered = false
        this.right = null
        this.right_answer = null
      })
    },
  },
  beforeCreate() {
    this.$ajax.api.get(
      `competition/exercise/random/`,
    ).then(res => {
      this.question = res.data.result
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


    #to-login {
        cursor: pointer;
        color: #3a7afe;
    }

    #wrap {
        width: 800px;
        margin: 100px auto;
        padding: 50px;
        background-color: white;
        border-radius: 30px;
    }

    #content {
        margin: 30px;
        min-height: 200px;
        font-size: 20px;
    }

    .option {
        margin: 10px 30px;
        border-radius: 5px;
        border: 1px solid #ddd;
        line-height: 40px;
        padding: 0 20px;
    }

    #next {
        padding: 30px;
    }

    #submit {
        margin: 0 30px;
    }

    .options, #next {
        cursor: pointer;
    }

    .option:hover {
        background-color: #cfedff;
        border: 1px solid #cfedff;
    }

    #next:hover {
        color: #4ebaee;
    }


}

@media screen and (max-width: 840px) {
    #background, #tip-wrap {
        display: none;
    }

    #app-bar {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        z-index: 1000;
    }

    #wrap {
        width: 100vw;
        border-radius: 0 0 5px 5px;
        margin: 54px 0 20vh;
        background-color: #fafafa;
        padding: 0 0 20px;
    }

    #content {
        padding: 20px;
        min-height: 100px;
    }

    .options {
        padding: 20px;
    }

    .option {
        margin: 10px 0;
        padding: 10px;
        border-radius: 5px;
        border: 1px solid #ddd;
    }

    #next {
        padding: 20px;
        color: #4ebaee;
    }

    #submit {
        margin: 20px;
    }


}

.active {
    border: 1px solid #4ebaee;
    color: #4ebaee;
}

.correct {
    border: 1px solid #00c48f;
    color: #00c48f;
}

.wrong {
    border: 1px solid #f44336;
    color: #f44336;
}
</style>
