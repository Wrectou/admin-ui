<template>
  <!-- 多选选项组 type类型为2 -->
  <div class="el-radio-group">
    <!-- 未选中项目 -->
    <label class="el-radio" v-for="(item, index) in questionObj.answerList" :key="item.value" @click="checkAnswerItem(item)">
      
      <!-- 答题模式多选 -->
      <span v-if="answerQuestion" :class="answerSeveraClass(item)">
        <!-- 选中 -->
        <span v-if="item.isChecked && questionObj.answerTime" class="el-radio__inner">
          <el-icon v-if="item.isChecked && !answerSeveraClass(item).includes('danger')"><check /></el-icon>
          <el-icon v-else><close /></el-icon>
        </span>
        <!-- 没选中 -->
        <span v-else class="el-radio__inner">{{IndexTolLetter[index+1]}}</span>
      </span>

      <!-- 背题模式多选 -->
      <span v-else :class="['el-radio__input', questionObj.okAnswer.includes(item.value) ? 'is-checked' : '']">
        <span v-if="questionObj.okAnswer.includes(item.value)" class="el-radio__inner">
          <el-icon><check /></el-icon>
        </span>
        <span v-else class="el-radio__inner">{{IndexTolLetter[index+1]}}</span>
      </span>

      <!-- 选项名字 -->
      <span class="el-radio__label">{{item.label}}</span>

    </label>
  </div>
  <div class="determine-answer" v-if="answerQuestion">
    <el-button type="primary" @click="checkAnswer">确认答案</el-button>
  </div>
</template>

<script setup name="QuestionAnswerSeveral">

  import { IndexTolLetter } from '@/utils'

  const props = defineProps({
    answerQuestion: {
      type: Boolean,
      default: true
    },
    questionObj: {
      type: Object,
      default: {
        answerList: [],
        isShowQuestionAnalysis: false,
        okAnswer: '',
      }
    }
  })

  // 答题模式下多选样式的计算属性
  let answerSeveraClass = computed(item => {
    return item => {
      let str = 'el-radio__input'

      if (props.questionObj.isShowQuestionAnalysis) {

        // 交集 正确数据
        let successArr = [...new Set(props.questionObj.okAnswer)].filter(item => new Set(props.questionObj.yourAnswer).has(item))
        successArr.forEach(i => {
          if (item.value === i) str = 'el-radio__input is-checked'
        })

        // 差集 错误数据
        let errorArr = [...new Set(props.questionObj.yourAnswer)].filter(item => !new Set(props.questionObj.okAnswer).has(item))
        errorArr.forEach(i => {
          if (item.value === i) str = 'el-radio__input is-checked danger'
        })

        // 差集 没有选数据
        let primaryArr = [...new Set(props.questionObj.okAnswer)].filter(item => !new Set(successArr).has(item))
        primaryArr.forEach(i => {
          if (item.value === i) str = 'el-radio__input is-checked primary'
        })

      } else {
        if (item.isChecked) str = 'el-radio__input is-checked'
      }

      return str
    }
  })

  const emit = defineEmits(['plusQuestionIndex', 'checkAnswerSeveralItemFunc', 'checkAnswerSeveralFunc'])

  const checkAnswerItem = item => emit('checkAnswerSeveralItemFunc', item)

  const checkAnswer = item => emit('checkAnswerSeveralFunc', item)

</script>

<style lang="scss" scoped>
.determine-answer{
  margin: 20px 0 30px;
}
</style>
