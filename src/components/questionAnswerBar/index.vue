<template>
  <!-- 回答错误工具组件 -->
  <div class="answer-bar">
    <!-- 答案 -->
    <div class="default-answer" v-if="questionAnswerBarObj.type === 1">答案：{{IndexTolLetter[questionAnswerBarObj.okAnswer]}}</div>
    <div class="default-answer" v-if="questionAnswerBarObj.type === 2">
      答案：
      <span v-for="(item, index) in questionAnswerBarObj.okAnswer" :key="index">{{IndexTolLetter[item]}}</span>
    </div>
    <div class="user-answer" v-if="questionAnswerBarObj.yourAnswer && questionAnswerBarObj.answerTime">
      <!-- 你的选择 -->
      <span v-if="questionAnswerBarObj.type === 1">你的选择：{{IndexTolLetter[questionAnswerBarObj.yourAnswer]}}，</span>
      <span v-if="questionAnswerBarObj.type === 2">
        你的选择：
        <span v-for="(item, index) in questionAnswerBarObj.yourAnswer" :key="index">{{IndexTolLetter[item]}}</span>
        ，
      </span>
      <!-- 用时 -->
      用时： {{questionAnswerBarObj.answerTime}}秒
    </div>
  </div>
</template>

<script setup name="QuestionAnswerBar">

  import { IndexTolLetter } from '@/utils'

  const props = defineProps({
    questionAnswerBarObj: {
      type: Object,
      default: {
        type: '',
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