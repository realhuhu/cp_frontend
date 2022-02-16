<template>
  <div style="height: 75px">
    <var-row>
      <var-col :span="8">
        <var-input
          clearable
          :placeholder="placeholder || '验证码'"
          :rules="this.$settings.validators.code"
          v-model="code"
          @change="$emit('update:code',code)"
        />
      </var-col>
      <var-col :span="14" :offset="2">
        <div style="margin: 10px 0 0;">
          <var-button v-show="is_send" block disabled type="info">获取验证码({{t}}s)</var-button>
          <var-button v-show="!is_send" block type="info" @click="getCode">获取验证码</var-button>
        </div>
      </var-col>
    </var-row>
  </div>
</template>

<script>
  export default {
    name: "msgCode",
    props: {
      placeholder: null,
      code: {},
      phone: {},
      method: String,
    },
    emits: ["update:code"],
    data() {
      return {
        t: 60,
        is_send: false
      }
    },
    methods: {
      getCode() {
        if (!this.$settings.re_pattens.phone.test(this.phone.toString())) return

        this.$ajax.api.get(
          "common/code/",
          {
            params: {
              phone: this.phone,
              method: this.method,
            }
          },
        ).then(res => {
          if (res.data.code !== 101) {
            this.$tip({
              content: res.data.result.errmsg ? res.data.result.errmsg : res.data.msg,
              type: "error",
              duration: 1000,
            })
          } else {
            this.$tip({
              content: "验证码已发送",
              type: "success",
              duration: 1000,
            })
          }
        }).catch(err => {
          this.$tip({
            content: err,
            type: "error",
            duration: 2000,
          })
        })

        this.is_send = true
        let inter = setInterval(() => {
          if (this.t <= 0) {
            clearInterval(inter)
            this.is_send = false
            this.t = 60
          } else {
            this.t--
          }
        }, 1000)
      }
    }
  }
</script>

<style scoped>

</style>