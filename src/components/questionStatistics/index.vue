<template>
  <!-- 答案统计组件 -->
  <div class="statistics-box">
    <div class="item">
      <span>全站作答</span>
      <div class="num">{{questionStatisticsObj.allAnswerNum}}次</div>
    </div>
    <div class="item">
      <span>全站正确率</span>
      <div class="num">{{questionStatisticsObj.allAnswerCorrectRate}}%</div>
    </div>
    <div class="item">
      <span>易错项</span>
      <div class="num">{{IndexTolLetter[questionStatisticsObj.fallibility]}}</div>
    </div>
  </div>
</template>

<script setup name="QuestionStatistics">
  
  import { IndexTolLetter } from '@/utils'

  const props = defineProps({
    questionStatisticsObj: {
      type: Object,
      default: {
        allAnswerNum: '',
        allAnswerCorrectRate: '',
        fallibility: ''
      }
    }
  })

</script>

<style lang="scss" scoped>
.statistics-box{
  display: flex;
  align-items: center;
  background: #f3f3f3;
  padding: 8px 10px;
  font-size: 14px;
  .item{
    flex: 0 0 200px;
    text-align: center;
    >span{
      color: #666;
    }
  }
  .item:nth-child(1) {
    .num{
      color: #333;
    }
  }
  .item:nth-child(2) {
    border-left: solid 1px #e3e3e3;
    .num{
      color: #67c23a;
    }
  }
  .item:nth-child(3) {
    border-left: solid 1px #e3e3e3;
    .num{
      color: #f56c6c;
    }
  }
}
</style>
