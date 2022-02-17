<template>
  <div id="banner"/>

  <div id="wrap">
    <var-card class="card" id="card">
      <template #extra>
        <div id="title">用户信息</div>
        <var-divider/>
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

          <div class="items edit">
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

          <div class="items edit">
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

          <div class="items edit">
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
      </template>

    </var-card>
  </div>
</template>

<script>
  export default {
    name: "UserInfo",
    data() {
      return {
        user: this.$store.state.user
      }
    },
    computed: {
      icon() {
        return this.$settings.cos_url + this.$store.state.user.icon
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

    .edit{
      cursor: pointer;
    }
  }
</style>