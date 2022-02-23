<template>
  <var-tabs
    v-if="show"
    id="pe-nav-bar"
    elevation
    v-model:active="active"
    item-direction="vertical"
    color="#f6f6f6"
    active-color="#3a7afe"
    inactive-color="#666"
    fixed-bottom>
    <var-tab @click="itemClick('home')">
      <var-icon name="home-outline"/>
      <div class="text">首页</div>
    </var-tab>
    <var-tab @click="itemClick('exercise')">
      <var-icon name="checkbox-marked-outline"/>
      <div class="text">练习</div>
    </var-tab>
    <var-tab @click="itemClick('entries')">
      <var-icon name="format-list-checkbox"/>
      <div class="text">参赛记录</div>
    </var-tab>
    <var-tab @click="itemClick('user-info')">
      <var-icon name="account-circle-outline"/>
      <div>我的</div>
    </var-tab>
  </var-tabs>
</template>

<script>
  export default {
    name: "TabBar",
    props: {
      active: 0
    },
    data() {
      return {
        show: true
      }
    },
    methods: {
      itemClick(path) {
        this.$router.replace(path)
      }
    },
  }
</script>

<style scoped>
  @media screen and (min-width: 840px) {
    #pe-nav-bar {
      display: none;
    }
  }

  @media screen and (max-width: 840px) {
    #pe-nav-bar {
      z-index: 996;
      --tabs-item-vertical-height: 49px;
      position: fixed
    }
  }

</style>