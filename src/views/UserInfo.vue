<template>
  <div id="banner"/>

  <div id="wrap">
    <var-card class="card" id="card">
      <template #extra>
        <div id="pc">
          <div id="title">用户信息</div>
          <var-divider id="divider"/>
          <div id="items-wrap">

            <div class="items">
              <var-row>
                <var-col span="11">
                  <div class="item-left">用户ID</div>
                </var-col>
                <var-col span="11">
                  <div class="item-center">{{user.id}}</div>
                </var-col>
              </var-row>
            </div>

            <div class="items edit" @click="edit_username">
              <var-row>
                <var-col span="11">
                  <div class="item-left">用户名</div>
                </var-col>
                <var-col span="11">
                  <div class="item-center">{{user.username}}</div>
                </var-col>
                <var-col span="2">
                  <div class="item-right">
                    <var-icon size="30" style="margin: 10px 0" name="chevron-right"/>
                  </div>
                </var-col>
              </var-row>
            </div>

            <div class="items edit" @click="this.$router.push('/change-icon')">
              <var-row>
                <var-col span="11">
                  <div class="item-left">头像</div>
                </var-col>
                <var-col span="11">
                  <div class="item-center">
                    <var-image
                      id="avatar"
                      width="40px"
                      height="40px"
                      fit="cover"
                      radius="50%"
                      style="border: 2px solid rgba(200,200,200,0.9);margin: 5px"
                      :src="icon"
                    />
                  </div>
                </var-col>
                <var-col span="2">
                  <div class="item-right">
                    <var-icon size="30" style="margin: 10px 0" name="chevron-right"/>
                  </div>
                </var-col>
              </var-row>
            </div>

            <div class="items edit" @click="edit_phone">
              <var-row>
                <var-col span="11">
                  <div class="item-left">电话号码</div>
                </var-col>
                <var-col span="11">
                  <div class="item-center">{{user.phone}}</div>
                </var-col>
                <var-col span="2">
                  <div class="item-right">
                    <var-icon size="30" style="margin: 10px 0" name="chevron-right"/>
                  </div>
                </var-col>
              </var-row>
            </div>

            <div class="items">
              <var-row>
                <var-col span="11">
                  <div class="item-left">注册时间</div>
                </var-col>
                <var-col span="11">
                  <div class="item-center">{{user.date_joined.substring(0,10)}}</div>
                </var-col>
              </var-row>
            </div>
          </div>

          <div id="back">
            <var-button block type="success" @click="this.$router.replace(this.$route.query.next ||'/home')">确定
            </var-button>
          </div>
        </div>

        <div id="pe">
          <var-row>
            <var-col :span="4" @click="this.$router.push('/change-icon')">
              <var-image
                id="pe-avatar"
                width="50px"
                height="50px"
                fit="cover"
                radius="50%"
                style="border: 2px solid rgba(200,200,200,0.9);margin: 5px"
                :src="icon"
              />
            </var-col>
            <var-col :span="18">
              <div id="username" @click="edit_username">{{user.username}}</div>
              <div id="id" v-if="this.$store.state.is_login">
                <var-chip size="mini">ID:{{user.id}}</var-chip>
              </div>
            </var-col>
          </var-row>
        </div>
      </template>
    </var-card>

    <div id="pe-2">
      <var-card class="card" id="card-2">
        <template #extra>
          <div class="pe-item" @click="edit_phone">
            <span>电话号码</span>
            <span style="float: right">{{user.phone}}</span>
          </div>
          <var-divider/>
          <div class="pe-item" @click="this.$router.push('change-password')">
            <span>修改密码</span>
          </div>
          <var-divider/>
          <div class="pe-item">
            <span>参赛记录</span>
          </div>
        </template>
      </var-card>
    </div>

    <div id="pe-3">
      <var-button block type="warning" @click="logout">退出登录</var-button>
    </div>

    <var-popup style="border-radius: 20px" v-model:show="is_pou_up">
      <div id="pop-up">
        <div id="pop-title">
          {{["修改用户名","绑定手机","解除绑定"][type]}}
        </div>


        <div id="pop-content">
          <div v-if="type===0">
            <username :placeholder="'新用户名'" v-model:username="username"/>
          </div>

          <div v-if="type===1 ||type===2">
            <div v-if="is_phone">
              <phone v-model:phone="this.user.phone" :disabled="true"/>
              <msg-code v-model:code="code" :method="is_phone?'unbind_phone':'bind_phone'" :phone="this.user.phone"/>
            </div>
            <div v-else>
              <phone v-model:phone="phone"/>
              <msg-code v-model:code="code" :method="is_phone?'unbind_phone':'bind_phone'" :phone="phone"/>
            </div>
          </div>
        </div>

        <div id="confirm">
          <var-button block type="success" @click="confirm">确定</var-button>
        </div>
      </div>
    </var-popup>
  </div>
</template>

<script>
  import Username from "components/input/Username";
  import Phone from "components/input/Phone";
  import MsgCode from "components/input/MsgCode";

  export default {
    name: "UserInfo",
    components: {
      Username,
      Phone,
      MsgCode
    },
    data() {
      return {
        user: this.$store.state.user,
        "username": "",
        phone: "",
        code: "",
        is_pou_up: false,
        type: null,
        re_pattens: this.$settings.re_pattens
      }
    },
    computed: {
      icon() {
        return this.$settings.cos_url + (this.$store.state.user.icon || "icon/login.jpg")
      },
      is_phone() {
        return this.user.phone !== "未绑定"
      }
    },
    methods: {
      edit_username() {
        this.is_pou_up = true
        this.type = 0
      },
      edit_phone() {
        this.is_pou_up = true
        if (this.user.phone === "未绑定") {
          this.type = 1
        } else {
          this.type = 2
        }
      },
      confirm() {
        let url, data
        switch (this.type) {
          case 0:
            if (!this.re_pattens.username.test(this.username)) return

            url = "/user/user_info/"
            data = {
              username: this.username
            }
            break
          case 1:
            if (!this.re_pattens.phone.test(this.phone)) return
            if (!this.re_pattens.code.test(this.code)) return

            url = "/user/bind_phone/"
            data = {
              phone: this.phone,
              code: this.code
            }
            break
          case 2:
            if (!this.re_pattens.code.test(this.code)) return

            url = "/user/unbind_phone/"
            data = {
              phone: this.user.phone,
              code: this.code
            }
            break
        }

        let request = this.$ajax.api.post(
          url,
          data
        )

        switch (this.type) {
          case 0:
            request.then(res => {
              if (res.data.code === 108) {
                this.$tip({
                  content: "用户信息修改成功",
                  type: "success",
                  duration: 1000,
                })
                this.is_pou_up = false
                this.$cookies.set("token", res.data.result.token)
                this.$store.commit("login", res.data.result["user"])
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
            break
          case 1:
            request.then(res => {
              if (res.data.code === 105) {
                this.$tip({
                  content: "绑定成功",
                  type: "success",
                  duration: 1000,
                })
                this.is_pou_up = false
                this.user.phone = this.phone
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
            break
          case 2:
            request.then(res => {
              if (res.data.code === 106) {
                this.$tip({
                  content: "解除绑定成功",
                  type: "success",
                  duration: 1000,
                })
                this.is_pou_up = false
                this.user.phone = "未绑定"
              } else {
                this.$tip({
                  content: res.data.msg,
                  type: "warning",
                  duration: 1000,
                })
              }
            })
        }

        request.catch(err => {
          this.$tip({
            content: err,
            type: "warning",
            duration: 1000,
          })
        })
      },
      logout() {
        this.$router.replace("/login")
        this.$cookies.remove("token")
        this.$store.commit("logout")
      }
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
      width: 600px;
      margin: 20px calc(50vw - 300px);
    }

    #card {
      padding: 30px;
      border-radius: 30px;
    }

    #title {
      line-height: 40px;
      font-size: 30px;
      font-weight: bolder;
    }

    .items {
      padding: 0 20px;
      font-size: 20px;
      line-height: 50px;
      border-radius: 3px;
    }

    .item-left {
      color: #3263d2;
    }

    .item-center {
      float: right;
      font-weight: bold;
    }

    .item-right {
      float: right;
    }

    #back {
      margin: 20px 50px;
    }

    .items:hover {
      background-color: #f6f6f6;
    }

    .edit {
      cursor: pointer;
    }

    #pop-up {
      width: 500px;
      border-radius: 40px;
      padding: 50px;
    }

    #pop-title {
      text-align: center;
      font-size: 25px;
      font-weight: bold;
    }

    #confirm {
      margin-top: 20px;
    }

    #pe, #pe-2, #pe-3 {
      display: none;
    }
  }

  @media screen and (max-width: 840px) {
    #wrap {
      width: 90vw;
      margin: 20px 5vw;
    }


    #username {
      margin-top: 10px;
      line-height: 20px;
      font-size: 18px;
      font-weight: bold;
    }

    #id {
      line-height: 20px;
      margin-top: 4px;
    }

    #card-2 {
      margin: 20px 0;
    }

    #pop-up {
      width: 70vw;
      border-radius: 40px;
      padding: 20px;
    }

    #title, #banner, #divider, #pc {
      display: none;
    }

    .pe-item {
      margin: 0 10px;
      line-height: 25px;
    }
  }
</style>