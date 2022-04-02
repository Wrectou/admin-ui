<template>
  <!-- 答题卡组件 -->
  <div>
    <el-drawer
      v-model="isShowAnswerSheet"
      title="答题卡"
      :direction="'rtl'"
    >
      <div>
        <el-button v-for="(item, index) in questionArr" :key="item.title" @click="changeQuestionIndex(index)" :type="!item.answerTime ? '' : item.type === 4 || String(item.yourAnswer) === String(item.okAnswer) ? 'success' : 'danger' ">
          {{index+1}}
        </el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup name="QuestionAnswerSheet">
  
  const props = defineProps({
    isShowAnswerSheet: {
      type: Boolean,
      default: false
    },
    questionArr: {
      type: Array,
      default: []
    }
  })

  const emit = defineEmits(['changeQuestion'])

  const changeQuestionIndex = index => emit('changeQuestion', index)

</script>

<style lang="scss" scoped>

::v-deep(.el-drawer__body) {
  padding: 6px;
  .el-button{
    margin: 6px 8px;
    min-width: 66px;
  }
  +.el-button{
    margin: 6px 8px;
  }
}
</style>
