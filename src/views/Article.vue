<template>
  <div id="background"/>


  <var-app-bar
    id="app-bar"
    class="var-elevation--1"
    title="公告"
    title-position="center"
    color="#f6f6f6"
    style="font-weight: bolder;"
    text-color="#333"
  >
    <template #left>
      <var-icon name="chevron-left" :size="24" @click="this.$router.return('/home')"/>
      <div :size="24" @click="this.$router.return('/home')">返回</div>
    </template>
  </var-app-bar>

  <div id="wrap">
    <var-card
      v-if="ready"
      :title="article.title"
      :description="article.create_time.substring(0,16).replace('T',' ')"
    >
      <template #extra>
        <var-divider margin="0"/>
        <div id="content" v-html="article.content"/>
        <div id="btn" class="right">
          <var-button type="primary" @click="this.$router.return('/home')">返回</var-button>
        </div>
      </template>
    </var-card>
  </div>

</template>

<script>
  export default {
    name: "Article",
    data() {
      return {
        ready: false,
        article: null
      }
    },
    beforeCreate() {
      this.$ajax.api.get(
        `common/${this.$route.params.id}/article/`,
      ).then(res => {
        if (res.data.code === 112) {
          this.article = res.data.result.data
        } else if (res.data.code === 704) {
          this.$tip({
            content: "公告不存在",
            type: "warning",
            duration: 3000,
          })
        }
        this.ready = true
      }).catch(err => {
        this.$tip({
          content: err,
          type: "error",
          duration: 3000,
        })
      })
    }
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
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

    #app-bar {
      display: none;
    }

    #wrap {
      width: 50vw;
      margin: 100px auto;
    }

    #btn {
      margin: 50px;
    }

    #content {
      margin: 50px;
    }
  }

  @media screen and (max-width: 840px) {
    #app-bar {
      position: fixed;
      width: 100%;
      left: 0;
      top: 0;
      height: 54px;
    }

    #wrap {
      margin: 54px 10px;
    }

    #btn {
      display: none;
    }

    #content {
      margin: 10px 10px 60px;
    }
  }


</style>