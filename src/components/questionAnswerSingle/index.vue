<template>
  <!-- 单选选项组 type类型为1 -->
  <div class="el-radio-group">

    <!-- 未选中项目 -->
    <label class="el-radio" v-for="(item, index) in questionObj.answerList" :key="item.value" @click="checkAnswer(item)">
      <!-- 答题模式单选 -->
      <span v-if="answerQuestion" :class="['el-radio__input', item.isChecked ? 'is-checked' : '', item.isChecked && questionObj.isShowQuestionAnalysis ? 'danger' : '']">
        <!-- 正确 -->
        <span v-if="item.isChecked" class="el-radio__inner">
          <el-icon v-if="!questionObj.isShowQuestionAnalysis"><check /></el-icon>
          <el-icon v-else><close /></el-icon>
        </span>
        <!-- 没选中 -->
        <span v-else class="el-radio__inner">{{IndexTolLetter[index+1]}}</span>
      </span>
      <!-- 背题模式单选 -->
      <span v-else :class="['el-radio__input', questionObj.okAnswer === index+1 ? 'is-checked' : '']">
        <span v-if="questionObj.okAnswer === index+1" class="el-radio__inner">
          <el-icon><check /></el-icon>
        </span>
        <span v-else class="el-radio__inner">{{IndexTolLetter[index+1]}}</span>
      </span>
      <!-- 选项名字 -->
      <span class="el-radio__label">{{item.label}}</span>
    </label>

  </div>
</template>

<script setup name="QuestionAnswerSingle">

  import { ElMessage } from 'element-plus'

  import { IndexTolLetter } from '@/utils'

  const props = defineProps({
    answerQuestion: {
      type: Boolean,
      default: true
    },
    // isLoading: {
    //   type: Boolean,
    //   default: false
    // },
    // answerTime: {
    //   type: String,
    //   default: ''
    // },
    questionObj: {
      type: Object,
      default: {
        answerList: [],
        isShowQuestionAnalysis: false,
        okAnswer: '',
      }
    }
  })

  const emit = defineEmits(['plusQuestionIndex', 'checkAnswerSingleFunc'])

  const checkAnswer = item => emit('checkAnswerSingleFunc', item)

  // // 单选选择点击/确定选择
  // const checkAnswerSingleFunc = item => {
  //   // 背题模式禁止操作
  //   if (!props.answerQuestion) return ElMessage.error('当前为背题模式，不可答题！')
  //   // 是单选切已经选过答案后点击没操作
  //   if (props.questionObj.type === 1 && props.questionObj.yourAnswer) return
  //   // 此处调接口
  //   props.isLoading = true
  //   // 答题时间
  //   let time = Number(((new Date() - props.answerTime)/1000).toFixed())
  //   props.questionObj.answerTime = time>0 ? time : 1
  //   // 模拟接口延迟
  //   setTimeout(() => {
  //     // 用户选择回答项
  //     props.questionObj.yourAnswer = item.value
  //     // 此选项已选择
  //     item.isChecked = true
  //     if (props.questionObj.yourAnswer === props.questionObj.okAnswer) {
  //       // 回答正确去下一题
  //       emit('plusQuestionIndex')
  //     } else {
  //       // 回答错误显示答题解析
  //       props.questionObj.isShowQuestionAnalysis = true
  //     }
  //     // 取消loading
  //     props.isLoading = false
  //   }, 700)
  // }

</script>

<style lang="scss" scoped>
</style>
