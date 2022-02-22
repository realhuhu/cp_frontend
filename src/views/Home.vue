<template>
  <div id="background"/>
  <div id="wrap">
    <div id="left">
      <var-swipe class="var-elevation--12" id="swipe">
        <var-swipe-item>
          <img class="swipe-item" src="https://varlet.gitee.io/varlet-ui/cat.jpg">
        </var-swipe-item>
        <var-swipe-item>
          <img class="swipe-item" src="https://varlet.gitee.io/varlet-ui/cat2.jpg">
        </var-swipe-item>
        <var-swipe-item>
          <img class="swipe-item" src="https://varlet.gitee.io/varlet-ui/cat3.jpg">
        </var-swipe-item>
      </var-swipe>

      <div class="space"></div>
    </div>

    <div id="right">
      <div id="card" class="var-elevation--12">
        <div id="card-title">我的</div>
        <var-divider dashed/>
        <div id="card-btn-wrap">
          <div style="height: 10px;"></div>
          <div class="card-btn">
            <var-icon class="icon" size="20" name="format-list-checkbox"/>
            <span>参赛记录</span>
            <var-icon class="icon" style="float: right" size="20" name="chevron-right"/>
          </div>
          <br>
          <div class="card-btn">
            <var-icon class="icon" size="20" name="format-list-checkbox"/>
            <span>答题练习</span>
            <var-icon class="icon" style="float: right" size="20" name="chevron-right"/>
          </div>
        </div>
      </div>

      <div class="space"></div>

    </div>
  </div>
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

    #wrap {
      width: 1000px;
      margin: 80px calc(50vw - 500px);
      height: 100px;
    }

    #left {
      float: left;
      width: 730px;
      margin: 10px;
    }

    #right {
      float: left;
      width: 230px;
      margin: 10px;
    }

    #swipe {
      height: 200px;
      border-radius: 5px;
    }

    .swipe-item {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    #card-title {
      line-height: 40px;
      text-align: center;
      font-size: 20px;
      font-weight: bolder;
    }

    #card {
      width: 100%;
      height: 180px;
      border-radius: 5px;
      padding: 10px 20px;
      background-color: white;
    }

    #card-btn-wrap {
      width: 150px;
      margin: 0 auto;
    }

    .card-btn {
      width: 100%;
      line-height: 40px;
      font-size: 15px;
      font-weight: bolder;
      border-radius: 5px;
      background-color: #ffe14c;
      cursor: pointer;
    }

    .icon {
      margin: 10px;
      cursor: pointer;
    }

    .space{
      height: 50px;
    }
  }

  @media screen and (max-width: 840px) {
  }
</style>