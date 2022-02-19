<template>
  <var-card title="上传单题" class="uploadSingle" v-show="false">
    <template #extra>
      <var-form ref="form" :disabled="disabled" :readonly="readonly">
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
        <var-input
            placeholder="请输入题目答案"
            v-model="question.answer"
        />
        <var-select
            placeholder="请选择题目类别"
            v-model="question.category"
        >
          <var-option label="校史" value="校史"/>
        </var-select>
        <var-select
            placeholder="请选择题目难度"
            v-model="question.category"
        >
          <var-option label="难" value="难"></var-option>
        </var-select>
      </var-form>
      <var-button block type="success" @click="upload">
        确认
      </var-button>
    </template>
  </var-card>

  <var-card title="上传多题" class="uploadMultiple">
    <template #extra>
      <var-uploader v-model="files" @after-read="handleAfterRead"/>
      <var-divider dashed />
      使用说明:
    </template>
  </var-card>
</template>
<script>
import { reactive, ref } from 'vue'


export default {
  setup() {
    const formData = reactive({
      username: '',
      password: '',
      department: '',
      gender: undefined,
      license: false,
      range: 10,
      count: 0,
      group: [],
      score:0,
      like: [],
      files: []
    })

    const form = ref(null)
    const disabled = ref(false)
    const readonly = ref(false)

    return {
      form,
      formData,
      disabled,
      readonly
    }

    const files = ref([
      {
        url: 'https://varlet.gitee.io/varlet-ui/cat.jpg',
        cover: 'https://varlet.gitee.io/varlet-ui/cat.jpg',
        state: 'loading'
      },
      {
        url: 'https://varlet.gitee.io/varlet-ui/cat.jpg',
        cover: 'https://varlet.gitee.io/varlet-ui/cat.jpg',
        state: 'success'
      },
      {
        url: 'https://varlet.gitee.io/varlet-ui/cat.jpg',
        cover: 'https://varlet.gitee.io/varlet-ui/cat.jpg',
        state: 'error'
      }
    ])

  },
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
      }
    }
  },
  methods: {
    upload() {
      let url = "admin/question-bank"

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
    }
  }
}
</script>

<style scoped>
  .uploadSingle{
    width: 300px;
    margin-top: 15%;
    margin-left: 33%;

  }
  .uploadMultiple{
    width: 300px;
    margin-top: 15%;
    margin-left: 33%;
  }
</style>
