<template>
  <!-- 404 没有题目 -->
  <div class="container">
    <div class="pic-404">
      <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
      <img class="pic-404__child left" src="@/assets/404_images/404_cloud.png" alt="404">
      <img class="pic-404__child mid" src="@/assets/404_images/404_cloud.png" alt="404">
      <img class="pic-404__child right" src="@/assets/404_images/404_cloud.png" alt="404">
    </div>
    <div class="tip">本模块暂无数据，去别的模块看看吧！</div>
  </div>
</template>

<script setup name="questionNotFound">

</script>

<style lang="scss" scoped>
.container{
  padding: 20px;
  width: 100%;
}
.pic-404 {
  position: relative;
  margin: 2px auto 20px;
  width: 600px;
  overflow: hidden;
  &__parent {
    width: 100%;
  }
  &__child {
    position: absolute;
    &.left {
      width: 80px;
      top: 17px;
      left: 220px;
      opacity: 0;
      animation-name: cloudLeft;
      animation-duration: 2s;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      animation-delay: 1s;
    }
    &.mid {
      width: 46px;
      top: 10px;
      left: 420px;
      opacity: 0;
      animation-name: cloudMid;
      animation-duration: 2s;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      animation-delay: 1.2s;
    }
    &.right {
      width: 62px;
      top: 100px;
      left: 500px;
      opacity: 0;
      animation-name: cloudRight;
      animation-duration: 2s;
      animation-timing-function: linear;
      animation-fill-mode: forwards;
      animation-delay: 1s;
    }
    @keyframes cloudLeft {
      0% {
        top: 17px;
        left: 220px;
        opacity: 0;
      }
      20% {
        top: 33px;
        left: 188px;
        opacity: 1;
      }
      80% {
        top: 81px;
        left: 92px;
        opacity: 1;
      }
      100% {
        top: 97px;
        left: 60px;
        opacity: 0;
      }
    }
    @keyframes cloudMid {
      0% {
        top: 10px;
        left: 420px;
        opacity: 0;
      }
      20% {
        top: 40px;
        left: 360px;
        opacity: 1;
      }
      70% {
        top: 130px;
        left: 180px;
        opacity: 1;
      }
      100% {
        top: 160px;
        left: 120px;
        opacity: 0;
      }
    }
    @keyframes cloudRight {
      0% {
        top: 100px;
        left: 500px;
        opacity: 0;
      }
      20% {
        top: 120px;
        left: 460px;
        opacity: 1;
      }
      80% {
        top: 180px;
        left: 340px;
        opacity: 1;
      }
      100% {
        top: 200px;
        left: 300px;
        opacity: 0;
      }
    }
  }
}
.tip{
  text-align: center;
  color: #666;
}
</style>