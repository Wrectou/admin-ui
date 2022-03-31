<template>
  <!-- 回答错误工具组件 -->
  <div class="answer-bar">
    <div class="default-answer">答案：{{IndexTolLetter[questionAnswerBarObj.okAnswer]}}</div>
    <div class="user-answer">你的选择：{{IndexTolLetter[questionAnswerBarObj.yourAnswer]}}，用时： {{questionAnswerBarObj.answerTime}}秒</div>
  </div>
</template>

<script setup name="QuestionAnswerBar">

  import { IndexTolLetter } from '@/utils'

  const props = defineProps({
    questionAnswerBarObj: {
      type: Object,
      default: {
        okAnswer: '',
        yourAnswer: '',
        answerTime: '',
      }
    }
  })

</script>

<style lang="scss" scoped>
.answer-bar{
  display: flex;
  align-items: end;
  margin: 20px 0 0;
  background: #f3f3f3;
  padding: 14px 10px;
  font-size: 14px;
  .default-answer{
    margin: 0 20px 0 0;
    color: #409eff;
    font-size: 16px;
  }
}
</style>