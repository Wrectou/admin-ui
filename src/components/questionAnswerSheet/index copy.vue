<template>
  <!-- 答题卡组件 -->
  <div>
    <el-drawer
      v-model="isShowAnswerSheet"
      title="答题卡"
      :direction="'rtl'"
      :before-close="handleClose"
    >
      <div>
        <!-- 学习模式 -->
        <div v-if="answerSheetModel === 'learn'">
          <el-button v-for="(item, index) in questionArr" :key="item.title" @click="changeQuestionIndex(index)" :type="!item.answerTime ? '' : item.type === 4 || String(item.yourAnswer) === String(item.okAnswer) ? 'success' : 'danger' ">
            {{index+1}}
          </el-button>
        </div>
        <!-- 考试模式 -->
        <div v-if="answerSheetModel === 'test'">
          <el-button v-for="(item, index) in questionArr" :key="item.title" @click="changeQuestionIndex(index)" :type="!item.answerTime ? '' : 'primary'">
            {{index+1}}
          </el-button>
        </div>
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
    // 答题卡模式：learn 学习  /  test 考试
    answerSheetModel: {
      type: String,
      default: 'learn'
    },
    questionArr: {
      type: Array,
      default: []
    }
  })

  const emit = defineEmits(['changeQuestion', 'changeAnswerSheet'])

  const handleClose = () => emit('changeAnswerSheet')

  const changeQuestionIndex = index => emit('changeQuestion', index)

</script>

<style lang="scss" scoped>
::v-deep(.el-drawer__body) {
  padding: 6px;
  .el-button{
    margin: 6px;
    min-width: 66px;
  }
  +.el-button{
    margin: 6px;
  }
}
</style>
