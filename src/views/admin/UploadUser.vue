<template>
  <div id="wrap" class="var-elevation--5">
    <div style="height: 10px;"></div>
    <var-tabs v-model:active="active">
      <var-tab>导入一位</var-tab>
      <var-tab>批量导入</var-tab>
      <div style="width: 50%;"></div>
    </var-tabs>
    <div id="wrap1" v-if="active===0">
      <var-form ref="form">
        <var-input
          class="input"
          placeholder="学生姓名"
          :rules="[v => !!v || '内容不能为空']"
          v-model="user.username"
        />

        <var-input
          class="input"
          placeholder="一卡通号"
          :rules="rule.card"
          v-model="user.card"
        />

        <var-input
          class="input"
          type="password"
          placeholder="密码"
          :rules="rule.password"
          v-model="user.password"
        />
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
              placeholder="用户名"
              v-model="map.username"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="密码"
              v-model="map.password"
            >
              <var-option v-for="option in heads" :label="option"/>
            </var-select>
          </var-col>

          <var-col span="6">
            <var-select
              class="select"
              placeholder="一卡通号"
              v-model="map.card"
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
    name: "UploadUser",
    data() {
      return {
        user: {
          username: "",
          card: "",
          password: "",
        },
        active: 0,

        rule: this.$settings.validators,
        files: [],
        heads: [],
        raw_data: [],
        select: false,

        map: {
          username: "",
          card: "",
          password: ""
        },
      }
    },
    methods: {
      upload() {
        if (Object.values(this.user).filter(x => x === "").length) return
        let url = "admin/user/"
        this.$ajax.api.post(
          url,
          this.user
        ).then(res => {
          if (res.data.code === 100) {
            this.$tip({
              content: "上传成功",
              type: "success",
              duration: 1000,
            })
            this.user = {
              username: "",
              card: "",
              password: "",
            }
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
      batchUpload() {
        if (Object.values(this.map).filter(x => x === "").length) return

        let questions = []
        for (let i of this.raw_data) {
          questions.push({
            username: i[this.map["username"]],
            password: i[this.map["password"]],
            card: i[this.map["card"]]
          })
        }
        this.$ajax.api({
          method: 'POST',
          url: 'admin/user/',
          headers: {'content-type': 'application/json'},
          data: questions
        }).then(res => {
          if (res.data.code === 100) {
            this.$tip({
              content: "上传成功",
              type: "success",
              duration: 1000,
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
          username: "",
          card: "",
          password: ""
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
    padding: 20px 30px;
  }

  #wrap2 {
    padding: 30px;
  }

  #btn {
    padding: 40px 20px;
  }

  .input {
    padding: 20px;
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