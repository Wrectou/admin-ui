<template>
  <!-- 题目工具条 -->
  <div class="question-toolbar">
    <div class="type-box">
      <div class="type">{{toolbarObj.type}}</div>
      <div class="chapter" v-if="toolbarObj.chapter">当前章节：{{toolbarObj.chapter}}</div>
    </div>
    <div class="number" @click="changeSheet">
      <div><span>{{toolbarObj.number.max < 1 ? 0 : toolbarObj.number.min+1}}</span>/{{toolbarObj.number.max}}</div>
      <el-button type="text">答题卡</el-button>
    </div>
  </div>
</template>

<script setup name="QuestionToolBar">

  const props = defineProps({
    toolbarObj: {
      type: Object,
      default: {
        type: '',
        chapter: '',
        number: {
          min: '',
          max: ''
        },
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
      color: #f56c6c;
    }
  }
}
</style>
