<template>
  <!-- 题目切换组件 -->
  <div class="change-question">
    <el-button type="text" @click="reduceIndex">上一题</el-button>
    <el-button type="text" @click="plusIndex">下一题</el-button>
  </div>
</template>

<script setup>

  const props = defineProps({
    questionIndex: {
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
  justify-content: space-between;
}
</style>