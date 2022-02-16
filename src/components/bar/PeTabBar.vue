<template>
  <var-tabs
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
    <var-tab @click="itemClick('category')">
      <var-icon name="menu"/>
      <div class="text">话题</div>
    </var-tab>
    <var-tab @click="itemClick('community')">
      <var-icon name="message-processing-outline"/>
      <div>论坛</div>
    </var-tab>
    <var-tab @click="itemClick('profile')">
      <var-icon name="account-circle-outline"/>
      <div>我的</div>
    </var-tab>
  </var-tabs>
</template>

<script>
  export default {
    name: "TabBar",
    props: {
      active: Number
    },
    methods: {
      itemClick(path) {
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