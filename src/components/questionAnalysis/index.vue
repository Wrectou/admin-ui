<template>
  <!-- 答案解析组件 -->
  <div class="analysis-box">{{questionAnalysisObj.analysis}}</div>
</template>

<script setup name="QuestionAnalysis">
  
  const props = defineProps({
    questionAnalysisObj: {
      type: Object,
      default: {
        analysis: '',
      }
    }
  })

</script>

<style lang="scss" scoped>
.analysis-box{
  padding: 10px;
  background: #f3f3f3;
}
</style>
