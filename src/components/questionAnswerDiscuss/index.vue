<template>
  <!-- 论述题 type类型为4 -->
  <div>
    <el-collapse>
      <el-collapse-item>
        <template #title>
          <el-button type="primary" round>查看解析</el-button>
        </template>
        <div class="content">
          <div class="tit">答案解析</div>
          {{questionObj.analysis}}
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-form
      :inline="true"
      ref="ruleFormRef"
      :model="questionObj"
      :rules="rules"
      label-width="80px"
      class="form"
    >
      <el-form-item label="自评分数" prop="yourAnswer">
        <el-input v-model.number="questionObj.yourAnswer" :disabled="String(questionObj.answerTime).length > 0" type="number" placeholder="请输入0~20之间的自评分数" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="checkAnswer(ruleFormRef)">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup name="QuestionAnswerDiscuss">

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
        yourAnswer: '',
        answerTime: '',
      }
    }
  })

  // 自评分数表单验证
  const ruleFormRef = ref()
  const rules = reactive({
    yourAnswer: [
      { required: true, message: '请输入0~20之间的自评分数', trigger: 'blur' },
      { type: 'number', min: 0, max: 20, message: '请输入0~20之间的自评分数', trigger: 'blur' },
    ],
  })

  const emit = defineEmits(['checkAnswerDiscussFunc'])

  const checkAnswer = ruleFormRef => emit('checkAnswerDiscussFunc', ruleFormRef)

</script>

<style lang="scss" scoped>
.form{
  margin: 20px 0;
  ::v-deep(.el-form-item__content){
    width: 12vw;
  }
}
::v-deep(.el-collapse){
  border: none;
  .el-collapse-item__header{
    border: none;
    background: #f9f9f9;
  }
  .el-collapse-item__wrap{
    border: none;
    background: #f9f9f9;
  }
  .content{
    font-size: 15px;
    color: #666;
    .tit{
      margin: 10px 0;
    }
    .tit:before{
      top: 7px;
    }
  }
}
</style>
