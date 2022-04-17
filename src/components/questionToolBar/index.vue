<template>
  <!-- 题目工具条 -->
  <div class="question-toolbar">
    <div class="type-box">
      <div class="type">{{questionTypeToText[toolbarObj.questionArr[toolbarObj.questionIndex]?.showType] || ''}}</div>
      <div class="chapter" v-if="toolbarObj.chapter">当前章节：{{toolbarObj.chapter}}</div>
    </div>
    <div class="number">
    <!-- <div class="number" @click="changeSheet"> -->
      <div><span>{{toolbarObj.questionArr.length < 1 ? 0 : toolbarObj.questionIndex + 1}}</span> / {{toolbarObj.questionArr.length}}</div>
      <!-- <el-button type="text">答题卡</el-button> -->
    </div>
  </div>
</template>

<script setup name="QuestionToolBar">
  import { questionTypeToText } from '@/utils'

  const props = defineProps({
    toolbarObj: {
      type: Object,
      default: {
        chapter: '',
        questionIndex: 0,
        questionArr: [],
        isShowAnswerSheet: false
      }
    }
  })

  const emit = defineEmits(['changeAnswerSheet'])

  const changeSheet = () => emit('changeAnswerSheet')

</script>

<style lang="scss" scoped>
.question-toolbar{
  display: flex;
  align-items: end;
  justify-content: space-between;
  .type-box{
    font-size: 16px;
    .chapter{
      font-size: 12px;
      color: #999;
    }
  }
  .number{
    display: flex;
    align-items: center;
    flex-direction: column;
    span{
      color: var(--el-color-primary);
    }
  }
}
</style>
