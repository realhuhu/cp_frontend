<template>
  <div id="wrap" class="var-elevation--5">
    <div style="height: 10px;"></div>
    <var-tabs v-model:active="active">
      <var-tab>上传单题</var-tab>
      <var-tab>批量上传</var-tab>
      <div style="width: 50%;"></div>
    </var-tabs>
    <div id="wrap1" v-if="active===0">
      <var-form ref="form">
        <var-input
          class="input"
          placeholder="请输入题目内容"
          :rules="[v => !!v || '内容不能为空']"
          textarea
          v-model="question.content"
        />
        <var-input
          class="input"
          placeholder="请输入选项A内容"
          v-model="question.choice_a"
        >
          <template #prepend-icon>
            A
          </template>
        </var-input>
        <var-input
          class="input"
          placeholder="请输入选项B内容"
          v-model="question.choice_b"
        >
          <template #prepend-icon>
            B
          </template>
        </var-input>
        <var-input
          class="input"
          placeholder="请输入选项C内容"
          v-model="question.choice_c"
        >
          <template #prepend-icon>
            C
          </template>
        </var-input>
        <var-input
          class="input"
          placeholder="请输入选项D内容"
          v-model="question.choice_d"
        >
          <template #prepend-icon>
            D
          </template>
        </var-input>
        <var-row>
          <var-col span="8">
            <div class="input2">
              <var-select
                placeholder="请选择题目答案"
                v-model="question.answer"
              >
                <var-option v-for="option in answerOptions" :label="option"/>
              </var-select>
            </div>
          </var-col>
          <var-col span="8">
            <div class="input2">
              <var-select
                placeholder="请选择题目类别"
                v-model="question.category"
              >
                <var-option v-for="option in categoryOptions" :label="option"/>
              </var-select>
            </div>
          </var-col>
          <var-col span="8">
            <div class="input2">
              <var-select
                placeholder="请选择题目难度"
                v-model="question.difficulty"
              >
                <var-option v-for="option in difficultyOptions" :label="option"/>
              </var-select>
            </div>
          </var-col>
        </var-row>
      </var-form>
      <div id="btn">
        <var-button block type="success" @click="upload">
          确认
        </var-button>
      </div>
    </div>
    <div id="wrap2" v-if="active===1">
      <div id="tip">上传Excel文件</div>
      <var-uploader
        id="uploader"
        v-model="files"
        @after-read="handleAfterRead"
        @remove="clean"
        accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        :maxlength="1"
        ripple/>
      <div class="select" v-if="select">
        <var-divider description="选择映射关系"/>

        <var-row>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="题干"
              v-model="map.content"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="选项A"
              v-model="map.choice_a"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="选项B"
              v-model="map.choice_b"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="选项C"
              v-model="map.choice_c"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="选项D"
              v-model="map.choice_d"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="答案"
              v-model="map.answer"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="分类"
              v-model="map.category"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="难度"
              v-model="map.difficulty"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

        </var-row>

        <div id="batch-btn">
          <var-button block type="success" @click="batchUpload">
            确认
          </var-button>
        </div>

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        question: {
          content: "",
          choice_a: "",
          choice_b: "",
          choice_c: "",
          choice_d: "",
          answer: "",
          category: "",
          difficulty: "",
        },
        active: 0,
        categoryOptions: [
          "党史",
          "党史类",
          "改革开放史",
          "社会主义发展史",
          "新中国史",
        ],
        difficultyOptions: [
          "简单",
          "一般",
          "中等",
          "困难",
        ],
        answerOptions: [
          "A",
          "B",
          "C",
          "D",
        ],

        files: [],
        heads: [],
        raw_data: [],
        select: false,

        map: {
          content: "",
          choice_a: "",
          choice_b: "",
          choice_c: "",
          choice_d: "",
          answer: "",
          category: "",
          difficulty: "",
        },
      }
    },
    methods: {
      upload() {
        if (Object.values(this.question).filter(x => x === "").length) return
        let url = "admin/question-bank/"
        this.$ajax.api.post(
          url,
          this.question
        ).then(res => {
          if (res.data.msg !== "错误") {
            this.$tip({
              content: "上传成功",
              type: "success",
              duration: 1000,
            })
          } else {
            this.$tip({
              content: res.data.result,
              type: "warning",
              duration: 3000,
            })
          }
          this.question = {
            content: "",
            choice_a: "",
            choice_b: "",
            choice_c: "",
            choice_d: "",
            answer: "",
            category: "",
            difficulty: "",
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 3000,
          })
        })
      },
      batchUpload() {
        if (Object.values(this.map).filter(x => x === "").length) return

        let questions = []
        for (let i of this.raw_data) {
          questions.push({
            content: i[this.map["content"]],
            choice_a: i[this.map["choice_a"]],
            choice_b: i[this.map["choice_b"]],
            choice_c: i[this.map["choice_c"]],
            choice_d: i[this.map["choice_d"]],
            answer: i[this.map["answer"]],
            category: i[this.map["category"]],
            difficulty: i[this.map["difficulty"]],
          })
        }
        this.$ajax.api({
          method: 'POST',
          url: 'admin/question-bank/',
          headers: {'content-type': 'application/json'},
          data: questions
        }).then(res => {
          if (res.data.msg !== "错误") {
            this.$tip({
              content: "上传成功",
              type: "success",
              duration: 1000,
            })
          } else {
            this.$tip({
              content: res.data.result,
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
        this.$tip({
          content: "上传中，这可能需要数秒",
          type: "success",
          duration: 1000,
        })
        this.clean()
      },
      handleAfterRead(file) {
        file.state = 'loading'
        let fileTemp = file.file
        if (fileTemp.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
          fileTemp.type !== "application/vnd.ms-excel") {
          this.$tip({
            content: "上传文件格式有误，请重新上传!",
            type: "warning",
            duration: "2000"
          })
          file.state = 'error'
          return
        }

        file.state = 'success'
        let reader = new FileReader();
        let _this = this

        reader.onload = function (ev) {
          const excel = require("xlsx")
          let workbook = excel.read(ev.target.result, {type: 'binary'});
          _this.raw_data = excel.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
          _this.heads = Object.keys(_this.raw_data[0]);
          _this.select = true
        };
        reader.readAsBinaryString(fileTemp);
      },
      clean() {
        this.map = {
          content: "",
          choice_a: "",
          choice_b: "",
          choice_c: "",
          choice_d: "",
          answer: "",
          category: "",
          difficulty: "",
        }
        this.select = false
        this.files = []
        this.heads = []
        this.raw_data = []
      }
    }
  }
</script>

<style scoped>
  #wrap {
    margin: 0 auto;
    width: 600px;
    background-color: white;
    border-radius: 10px;
  }

  #wrap1 {
    width: 500px;
    margin: 0 auto;
    padding: 0 30px;
  }

  #wrap2 {
    padding: 30px;
  }

  #btn {
    padding: 20px;
  }

  .input {
    padding: 15px;
  }

  .input2 {
    padding: 15px;
  }

  #uploader {
    width: 90px;
    margin: 0 auto 30px;
  }

  #tip {
    line-height: 40px;
    color: #888;
    text-align: center;
  }

  .select {
    padding: 10px;
  }

  #batch-btn {
    padding: 30px;
  }

</style>
