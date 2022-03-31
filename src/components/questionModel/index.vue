<template>
  <!-- 模式切换组件 -->
  <div class="question-model">
    <el-button-group @click="changeModel">
      <el-button :type="props.answerQuestion ? 'primary' : ''">答题模式</el-button>
      <el-button :type="!props.answerQuestion ? 'primary' : ''">背题模式</el-button>
    </el-button-group>
  </div>
</template>

<script setup>

  const props = defineProps({
    answerQuestion: {
      type: Boolean,
      default: true
    }
  })

  const emit = defineEmits(['changeQuestionModel'])

  const changeModel = () => emit('changeQuestionModel', !props.answerQuestion)

</script>

<style lang="scss" scoped>
.question-model{
  margin: 0 0 20px;
  text-align: center;
}
</style>