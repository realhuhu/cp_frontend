<template>
  <var-card title="上传单题" class="uploadSingle" v-if="isSingle">
    <template #extra>
      <var-form ref="form">
        <var-input
            placeholder="请输入题目内容"
            :rules="[v => !!v || '用户名不能为空']"
            v-model="question.content"
        />
        <var-input
            placeholder="请输入选项A内容"
            v-model="question.choice_a"
        >
          <template #prepend-icon>
            A
          </template>
        </var-input>
        <var-input
            placeholder="请输入选项B内容"
            v-model="question.choice_b"
        >
          <template #prepend-icon>
            B
          </template>
        </var-input>
        <var-input
            placeholder="请输入选项C内容"
            v-model="question.choice_c"
        >
          <template #prepend-icon>
            C
          </template>
        </var-input>
        <var-input
            placeholder="请输入选项D内容"
            v-model="question.choice_d"
        >
          <template #prepend-icon>
            D
          </template>
        </var-input>
        <var-select
            placeholder="请选择题目答案"
            v-model="question.answer"
        >
          <var-option v-for="option in answerOptions" :label="option"></var-option>
        </var-select>
        <var-select
            placeholder="请选择题目类别"
            v-model="question.category"
        >
          <var-option v-for="option in categoryOptions" :label="option"/>
        </var-select>
        <var-select
            placeholder="请选择题目难度"
            v-model="question.difficulty"
        >
          <var-option v-for="option in difficultyOptions" :label="option"></var-option>
        </var-select>
      </var-form>
      <var-button block type="success" @click="upload">
        确认
      </var-button>
      <var-button block text @click="isSingle = !isSingle">
        上传多题
      </var-button>
    </template>
  </var-card>
    <var-card title="上传多题" class="uploadMultiple" v-else>
      <template #extra>
        <var-uploader v-model="files" @after-read="handleAfterRead"
                      accept="application/vnd.ms-excel | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      :maxlength="1"
                      ripple />
        <var-button block type="success" @click="batchUpload">
          导入
        </var-button>
        <var-divider description="使用说明" />
        <div class="note">请按如下格式上传.xls/.xlsx文件</div>
        <var-button block text @click="isSingle = !isSingle">
          上传单题
        </var-button>
      </template>
    </var-card>

</template>
<script>
export default {
  data() {
    return{
      question:{
        content: "",
        choice_a: "",
        choice_b: "",
        choice_c: "",
        choice_d: "",
        answer: "",
        category: "",
        difficulty: "",
      },
      isSingle: true,
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
      question_list: [],
    }
  },
  methods: {
    upload() {
      console.log(this.question)
      let url = "admin/question-bank/"

      let question = {
        content: this.question.content,
        choice_a: this.question.choice_a,
        choice_b: this.question.choice_c,
        choice_c: this.question.choice_c,
        choice_d: this.question.choice_d,
        answer: this.question.answer,
        category: this.question.category,
        difficulty: this.question.difficulty,
      }

      this.$ajax.api.post(
          url,
          question
      ).then(res => {

      })
    },
    batchUpload() {
      let questions = []
      if(this.question_list.length !== 0){
        for (let i = 0; i < this.question_list.length; i++){  //转化为列表
          let question = {
            content: this.question_list[i].content,
            choice_a: this.question_list[i].choice_a,
            choice_b: this.question_list[i].choice_c,
            choice_c: this.question_list[i].choice_c,
            choice_d: this.question_list[i].choice_d,
            answer: this.question_list[i].answer,
            category: this.question_list[i].category,
            difficulty: this.question_list[i].difficulty,
          }
          questions.push(question)
        }
        this.$ajax.api({
          method: 'POST',
          url: 'admin/question-bank/',
          headers: {'content-type': 'application/json'},
          data: questions
        }).then(res => {

        })
      }else {
        this.$tip({
          content: "解析失败,请按规定格式上传",
          type: "error",
          duration: "3000"
        })
      }
    },
    handleAfterRead(file) {
      file.state = 'loading'
      let fileTemp
      fileTemp = file.file
      if(fileTemp.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      fileTemp.type === "application/vnd.ms-excel"){
        file.state = 'success'
        this.importExcel(fileTemp)
      }else {
        this.$tip({
          content: "上传文件格式有误，请重新上传!",
          type: "warning",
          duration: "2000"
        })
        file.state = 'error'
      }
    },
    importExcel(file){
      let _this = this;

      let rABS = false; //是否将文件读取为二进制字符串
      let f = file;

      let reader = new FileReader();
      //if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function(f) {
        let binary = "";
        let rABS = false; //是否将文件读取为二进制字符串
        let pt = this;
        let wb; //读取完成的数据
        let outdata;
        let reader = new FileReader();
        let questions = []  //读取后的题目列表
        reader.onload = e => {
          let bytes = new Uint8Array(reader.result);
          let length = bytes.byteLength;
          for (let i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          //此处引入，用于解析excel
          let XLSX = require("xlsx");
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              //手动转化
              type: "base64"
            });
          } else {
            wb = XLSX.read(binary, {
              type: "binary"
            });
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
          //outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
          //此处可对数据进行处理
          outdata.map(v => {
            let question = {}
            question.content = v['题目']
            question.choice_a = v['选项A']
            question.choice_b = v['选项B']
            question.choice_c = v['选项C']
            question.choice_d = v['选项D']
            question.answer = v['答案']
            question.category = v['分类']
            question.difficulty = v['难度']
            questions.push(question)
          });
          // _this.da=questionList;
          // _this.dalen=questionList.length;
          // console.log(questionList)

        };
        _this.question_list = questions
        reader.readAsArrayBuffer(f);
      };
      if (rABS) {
        reader.readAsArrayBuffer(f);
      } else {
        reader.readAsBinaryString(f);
      }
    }
  }
}
</script>

<style scoped>
  .uploadSingle{
    width: 300px;
    margin-left: 33%;
  }
  .uploadMultiple{
    width: 300px;
    margin-top: 15%;
    margin-left: 33%;
  }
</style>
