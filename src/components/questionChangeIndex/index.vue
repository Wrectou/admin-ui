<template>
  <!-- 题目切换组件 -->
  <div class="change-question">
    <el-button type="text" @click="reduceIndex" :disabled="questionIndex === 0">上一题</el-button>
    <el-button class="next" type="text" @click="plusIndex" :disabled="questionIndex+1 >= questionArrLength">下一题</el-button>
  </div>
</template>

<script setup name="QuestionChangeIndex">

  const props = defineProps({
    questionIndex: {
      type: Number,
      default: 0
    },
    questionArrLength: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits(['plusQuestionIndex', 'reduceQuestionIndex'])

  const reduceIndex = () => emit('reduceQuestionIndex')

  const plusIndex = () => emit('plusQuestionIndex')

</script>

<style lang="scss" scoped>
.change-question{
  margin: 20px 0 30px;
  display: flex;
  justify-content: start;
  .next{
    margin: 0 0 0 100px;
  }
}
</style>