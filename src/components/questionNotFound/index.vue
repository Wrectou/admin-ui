<template>
  <!-- 404 没有题目 -->
  <div class="container">
    <div class="pic-404">
      <img src="@/assets/images/no-data.png" alt="">
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
  margin: 2px auto 20px;
  width: 600px;
  text-align: center;
}
.tip{
  text-align: center;
  color: #666;
}
</style>