<template>
  <!-- 模式切换组件 -->
  <div class="question-model">
    <el-button-group @click="changeModel">
      <el-button :type="answerQuestion ? 'primary' : ''">答题模式</el-button>
      <el-button :type="!answerQuestion ? 'primary' : ''">背题模式</el-button>
    </el-button-group>
  </div>
</template>

<script setup name="questionModel">

  const props = defineProps({
    answerQuestion: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits(['changeQuestionModel'])

  const changeModel = () => emit('changeQuestionModel')

</script>

<style lang="scss" scoped>
.question-model{
  margin: 0 0 20px;
  text-align: center;
}
</style>