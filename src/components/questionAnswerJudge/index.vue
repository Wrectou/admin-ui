<template>
  <!-- 判断题 type类型为3 -->
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

<script setup name="QuestionAnswerJudge">

  import { ElMessage } from 'element-plus'

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

  const emit = defineEmits(['plusQuestionIndex', 'checkAnswerJudgeFunc'])

  const checkAnswer = item => emit('checkAnswerJudgeFunc', item)

</script>

<style lang="scss" scoped>
</style>
