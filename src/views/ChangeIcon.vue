<template>
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

  <div id="banner"/>

  <div id="wrap">
    <span id="to-user-info"
          @click="this.$router.push({path: '/login', query: {next: this.$route.query.next}})">用户信息</span>
    <span>&nbsp;&gt;&nbsp;修改头像</span>
  </div>

  <div class="mask">
    <div class="frame">
      <img id="img" v-if="!is_change" :src="icon" alt="修改头像">
      <VuePictureCropper
        v-else
        :boxStyle="{
        width: '100%',
        backgroundColor: '#f8f8f8',
        position:'absolute'
      }"
        :img="pic"
        :options="{
        viewMode: 1,
        dragMode: 'move',
        aspectRatio: 1
      }"
      />
    </div>

    <var-row>
      <var-col :span="18" :offset="3" style="margin-top: 30px;">
        <var-button block type="info" @click="select">选择图片</var-button>
        <input type="file" id="upload" style="display: none;" name="icon" accept="image/bmp,image/jpeg,image/png">
      </var-col>
      <var-col :span="18" :offset="3" style="margin-top: 10px;">
        <var-button block type="success" @click="submit">确定</var-button>
      </var-col>
    </var-row>
  </div>


</template>

<script>
  import VuePictureCropper, {cropper} from 'vue-picture-cropper'

  export default {
    name: "ChangeIcon",
    components: {
      VuePictureCropper
    },
    data() {
      return {
        is_change: false,
        icon: this.$settings.cos_url + this.$store.state.user.icon,
        pic: null,
      }
    },
    methods: {
      select() {
        let btn = document.getElementById("upload")
        btn.click()
      },
      submit() {
        if (this.is_change) {
          cropper.getFile().then(file => {
            let form = new FormData
            form.append("icon", file)
            this.$ajax.api({
                method: "post",
                url: "user/icon/",
                data: form,
                headers: {
                  "Content-Type": "multipart/form-data",
                }
              }
            ).then(res => {
              if (res.data.code === 109) {
                this.$tip({
                  content: "修改成功，新头像需要一段时间后生效",
                  type: "success",
                  duration: 2000,
                })
                setTimeout(() => {
                  this.$router.back()
                }, 2000)
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
          })

        } else {
          this.$router.back()
        }
      }
    },
    mounted() {
      let btn = document.getElementById("upload")
      btn.addEventListener("change", ev => {
        let files = ev.target.files
        if (files.size !== 0) {
          let file = files[0]
          if (file.size / (1024 * 1024) > 5) {
            this.$tip({
              content: "图片大小不超过5M",
              type: "warning",
              duration: 1000,
            })
          } else if (!["image/bmp", "image/jpeg", "image/png"].includes(file.type)) {
            this.$tip({
              content: "只能上传jpg,png,bmp",
              type: "warning",
              duration: 1000,
            })
          } else {
            let Reader = new FileReader()
            Reader.readAsDataURL(file)
            Reader.onload = () => {
              this.pic = Reader.result
              this.is_change = true
            }
          }
        }
      })
    }
  }
</script>

<style scoped>

  @media screen and (min-width: 840px) {
    #banner {
      width: 100vw;
      height: 8vw;
      background-image: linear-gradient(to top, rgba(255, 255, 255, .8), rgba(255, 255, 255, 0)), url(https://cp-1304907527.cos.ap-nanjing.myqcloud.com/static/banner.jpg);
      background-size: cover;
      z-index: -1;
    }

    #wrap {
      margin: 20px 25vw 0;
    }

    #to-user-info {
      cursor: pointer;
      color: #3a7afe;
    }

    .mask {
      width: 400px;
      height: 400px;
      z-index: 1;
      margin: 30px calc(50vw - 200px);
      background-color: rgba(0, 0, 0, .9);
    }

    .frame {
      position: relative;
      overflow: hidden;
      padding-bottom: 100%;
      background-color: gray;
      z-index: 2;
    }

    #img {
      width: 400px;
      position: absolute
    }

    #app-bar {
      display: none;
    }
  }

  @media screen and (max-width: 840px) {
    .mask {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
      background-color: rgba(0, 0, 0, .9);
    }

    .frame {
      position: relative;
      overflow: hidden;
      padding-bottom: 100%;
      margin-top: 15vh;
      background-color: gray;
      z-index: 2;
    }

    #img {
      width: 100%;
      position: absolute
    }

    #wrap {
      display: none;
    }
  }
</style>