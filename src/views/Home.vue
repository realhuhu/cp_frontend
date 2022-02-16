<template>
  <div id="background"></div>
</template>

<script>
  export default {
    name: "Home"
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
  }

  @media screen and (max-width: 840px) {
  }
</style>