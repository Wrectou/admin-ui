<template>
  <div class="container answer">
    
    <!-- 模式切换组件 -->
    <QuestionModel 
      :answerQuestion="answerQuestion" 
      @changeQuestionModel="changeQuestionModel" 
    />

    <!-- 题目工具条 -->
    <QuestionToolBar 
      :toolbarObj="toolbarObj"
      @changeAnswerSheet="changeAnswerSheet"
    />

    <!-- 分割线 -->
    <el-divider />

    <!-- 问题内容区域 -->
    <div class="content-box">

      <!-- 切换题目动画类 -->
      <div :class="switchQuestionClass">
      
        <!-- 标题组件 -->
        <QuestionTitle 
          :questionTitleObj="questionArr[questionIndex]"
          @changeCollectTitle="changeCollectTitle"
        />
        
        <!-- 答题选项盒子 -->
        <div class="answer-box"
            v-loading="isLoading"
            element-loading-text="Loading..."
            element-loading-background="rgba(255, 255, 255, 0.3)"
          >

          <!-- 单选选项组 type类型为1 -->
          <QuestionAnswerSingle 
            v-if="questionArr[questionIndex].type === 1"
            :answerQuestion="answerQuestion"
            :questionObj="questionArr[questionIndex]"
            @checkAnswerSingleFunc="checkAnswerSingleFunc"
          />

          <!-- 多选选项组 type类型为2 -->
          <QuestionAnswerSeveral 
            v-if="questionArr[questionIndex].type === 2"
            :answerQuestion="answerQuestion"
            :questionObj="questionArr[questionIndex]"
            @checkAnswerSeveralItemFunc="checkAnswerSeveralItemFunc"
            @checkAnswerSeveralFunc="checkAnswerSeveralFunc"
          />
          
          <!-- 判断题 type类型为3 -->
          <QuestionAnswerJudge 
            v-if="questionArr[questionIndex].type === 3"
            :answerQuestion="answerQuestion"
            :questionObj="questionArr[questionIndex]"
            @checkAnswerJudgeFunc="checkAnswerJudgeFunc"
          />

          <!-- 论述题 type类型为4 -->
          <QuestionAnswerDiscuss 
            v-if="questionArr[questionIndex].type === 4"
            :answerQuestion="answerQuestion"
            :questionObj="questionArr[questionIndex]"
            @checkAnswerDiscussFunc="checkAnswerDiscussFunc"
          />

          <!-- 论述题 type类型为4 -->
          <!-- <el-collapse>
            <el-collapse-item>
              <template #title>
                <el-button type="primary" round>查看解析</el-button>
              </template>
              <div class="content">
                <div class="tit">答案解析</div>
                {{questionArr[questionIndex].analysis}}
              </div>
            </el-collapse-item>
          </el-collapse>

          <el-form
            :inline="true"
            ref="ruleFormRef"
            :model="questionArr[questionIndex]"
            :rules="rules"
            label-width="80px"
            class="form"
          >
            <el-form-item label="自评分数" prop="yourAnswer">
              <el-input v-model.number="questionArr[questionIndex].yourAnswer" :disabled="String(questionArr[questionIndex].answerTime).length > 0" type="number" placeholder="请输入0~20之间的自评分数" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="checkAnswerDiscussFunc(ruleFormRef)">确定</el-button>
            </el-form-item>
          </el-form> -->



        </div>

      </div>


      <!-- 题目切换组件 -->
      <QuestionChangeIndex 
        :questionIndex="questionIndex"
        :questionArrLength="questionArr.length"
        @plusQuestionIndex="plusQuestionIndex"
        @reduceQuestionIndex="reduceQuestionIndex"
      />

      <!-- 回答错误的错题解析 -->
      <div :class="switchQuestionClass" v-if="!answerQuestion || questionArr[questionIndex].isShowQuestionAnalysis">

        <!-- 回答错误工具组件 -->
        <QuestionAnswerBar
          :questionAnswerBarObj="questionArr[questionIndex]"
        />

        <div class="tit">统计</div>
        <!-- 答案统计组件 -->
        <QuestionStatistics 
          :questionStatisticsObj="questionArr[questionIndex]"
        />

        <div class="tit">解析</div>
        <!-- 答案解析组件 -->
        <QuestionAnalysis 
          :questionAnalysisObj="questionArr[questionIndex]"
        />

      </div>

    </div>

    <!-- 答题卡组件 -->
    <QuestionAnswerSheet 
      :isShowAnswerSheet="isShowAnswerSheet"
      :questionArr="questionArr"
      @changeQuestion="changeQuestionIndex"
    />

  </div>
</template>

<script setup name="answer">

import { getHomeData, getEnum } from '@/api'

import { IndexTolLetter } from '@/utils'

import { singleQuestionData, severalQuestionData, judgeQuestionData, discussQuestionData, allQuestionData } from '@/utils/question'

import { ElMessage } from 'element-plus'
import QuestionModel from '@/components/questionModel/index'
import QuestionToolBar from '@/components/questionToolBar/index'
import QuestionTitle from '@/components/questionTitle/index'
import QuestionChangeIndex from '@/components/questionChangeIndex/index'
import QuestionAnswerBar from '@/components/questionAnswerBar/index'
import QuestionStatistics from '@/components/questionStatistics/index'
import QuestionAnalysis from '@/components/questionAnalysis/index'
import QuestionAnswerSheet from '@/components/questionAnswerSheet/index'
import QuestionAnswerSingle from '@/components/questionAnswerSingle/index'
import QuestionAnswerSeveral from '@/components/questionAnswerSeveral/index'
import QuestionAnswerJudge from '@/components/questionAnswerJudge/index'
import QuestionAnswerDiscuss from '@/components/questionAnswerDiscuss/index'

const { proxy } = getCurrentInstance()

// 模式切换组件 属性/方法
let answerQuestion = ref(true)
const changeQuestionModel = () => answerQuestion.value = !answerQuestion.value

// 正在显示的题目下标
let questionIndex = ref(0)
// 修改题目下标
const reduceQuestionIndex = () => { if (questionIndex.value > 0) questionIndex.value -- }
const plusQuestionIndex = () => { if (questionIndex.value < questionArr.length-1) questionIndex.value ++ }

// 题目数组
const questionArr = reactive(allQuestionData)

// 是否显示右侧答题卡侧边栏
let isShowAnswerSheet = ref(false)
// 题目工具条 属性/方法
let toolbarObj = reactive({
  type: '单项选择题',
  chapter: '社会主义法制理念',
  number: {
    min: questionIndex,
    max: questionArr.length
  },
  isShowAnswerSheet
})
// 开启/关闭选项卡
const changeAnswerSheet = () => isShowAnswerSheet.value = !isShowAnswerSheet.value
// 更改题目
const changeQuestionIndex = index => {
  questionIndex.value = index
  isShowAnswerSheet.value = false
  ElMessage.success(`已切换到第${index+1}题！`)
}

// 标题组件 属性/方法
const changeCollectTitle = () => {
  // 此处需要调借口
  setTimeout(() => {
    questionArr[questionIndex.value].isCollect = !questionArr[questionIndex.value].isCollect
    if (questionArr[questionIndex.value].isCollect) ElMessage.success('收藏成功！')
    else ElMessage.success('取消收藏成功！')
  }, 300)
}

// 控制题目切换动画
let switchQuestionClass = ref('')
watch(questionIndex, (newValue, oldValue) => {
  if (newValue>oldValue) switchQuestionClass.value = 'tramsform-form'
  else switchQuestionClass.value = 'tramsform-to'
  setTimeout(() => {
    switchQuestionClass.value = ''
    answerTime.value = new Date()
  } , 500)
})

// 答题开始时间，每开始一题设置为开始时间
let answerTime = ref(new Date())
// 是否显示问题解析界面
let isLoading = ref(false)

// 单选选择点击/确定选择
const checkAnswerSingleFunc = item => {
  // 背题模式禁止操作
  if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
  // 是单选切已经选过答案后点击没操作
  if (questionArr[questionIndex.value].type === 1 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
  // 此处调接口
  isLoading.value = true
  // 答题时间
  let time = Number(((new Date() - answerTime.value)/1000).toFixed())
  questionArr[questionIndex.value].answerTime = time > 0 ? time : 1
  // 模拟接口延迟
  setTimeout(() => {
    // 用户选择回答项
    questionArr[questionIndex.value].yourAnswer = item.value
    // 此选项已选择
    item.isChecked = true
    if (questionArr[questionIndex.value].yourAnswer === questionArr[questionIndex.value].okAnswer) {
      // 回答正确去下一题
      plusQuestionIndex()
    } else {
      // 回答错误显示答题解析
      questionArr[questionIndex.value].isShowQuestionAnalysis = true
    }
    // 取消loading
    isLoading.value = false
  }, 700)
}

// 多选点击选项
const checkAnswerSeveralItemFunc = item => {
  // 背题模式禁止操作
  if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
  // 是单选切已经选过答案后点击没操作
  if (questionArr[questionIndex.value].type === 2 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
  // 选中/反选 增加删除选中项数组
  if (!item.isChecked) questionArr[questionIndex.value].yourAnswer.push(item.value)
  else {
    let index = questionArr[questionIndex.value].yourAnswer.indexOf(item.value)
    questionArr[questionIndex.value].yourAnswer.splice(index, 1)
  }
  // 选中/反选
  item.isChecked = !item.isChecked
  // 选中项目数组排序用户对比正确与否
  questionArr[questionIndex.value].yourAnswer.sort((a, b) => a - b)
}
// 多选确定选择
const checkAnswerSeveralFunc = () => {
  // 背题模式禁止操作
  if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
  // 是单选切已经选过答案后点击没操作
  if (questionArr[questionIndex.value].type === 2 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
  // 是单选切已经选过答案后点击没操作
  if (questionArr[questionIndex.value].type === 2 && questionArr[questionIndex.value].yourAnswer.length <= 0) return ElMessage.error('请先选择选项再确认答案！')
  // 此处调接口
  isLoading.value = true
  // 模拟接口延迟
  setTimeout(() => {
    // 答题时间
    let time = Number(((new Date() - answerTime.value)/1000).toFixed())
    questionArr[questionIndex.value].answerTime = time > 0 ? time : 1
    if (String(questionArr[questionIndex.value].yourAnswer) === String(questionArr[questionIndex.value].okAnswer)) {
      // 回答正确去下一题
      plusQuestionIndex()
    } else {
      // 回答错误显示答题解析
      questionArr[questionIndex.value].isShowQuestionAnalysis = true
    }
    // 取消loading
    isLoading.value = false
  }, 700)
}

// 判断题选择点击/确定选择
const checkAnswerJudgeFunc = item => {
  // 背题模式禁止操作
  if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
  // 是单选切已经选过答案后点击没操作
  if (questionArr[questionIndex.value].type === 3 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
  // 此处调接口
  isLoading.value = true
  // 答题时间
  let time = Number(((new Date() - answerTime.value)/1000).toFixed())
  questionArr[questionIndex.value].answerTime = time > 0 ? time : 1
  // 模拟接口延迟
  setTimeout(() => {
    // 用户选择回答项
    questionArr[questionIndex.value].yourAnswer = item.value
    // 此选项已选择
    item.isChecked = true
    if (questionArr[questionIndex.value].yourAnswer === questionArr[questionIndex.value].okAnswer) {
      // 回答正确去下一题
      plusQuestionIndex()
    } else {
      // 回答错误显示答题解析
      questionArr[questionIndex.value].isShowQuestionAnalysis = true
    }
    // 取消loading
    isLoading.value = false
  }, 700)
}


// 论述题
// const ruleFormRef = ref()
// const rules = reactive({
//   yourAnswer: [
//     { required: true, message: '请输入0~20之间的自评分数', trigger: 'blur' },
//     { type: 'number', min: 0, max: 20, message: '请输入0~20之间的自评分数', trigger: 'blur' },
//   ],
// })
const checkAnswerDiscussFunc = (formEl) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      // 背题模式禁止操作
      if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
      // 是单选切已经选过答案后点击没操作
      if (questionArr[questionIndex.value].type === 4 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
      // 此处调接口
      isLoading.value = true
      // 答题时间
      let time = Number(((new Date() - answerTime.value)/1000).toFixed())
      questionArr[questionIndex.value].answerTime = time > 0 ? time : 1
      // 模拟接口延迟
      setTimeout(() => {
        plusQuestionIndex()
        // 取消loading
        isLoading.value = false
  }, 700)
    } else {
      console.log('error submit!', fields)
    }
  })
}


</script>

<style scoped lang="scss">

.container{
  padding: 40px;
}

.content-box{
  padding: 0 40px;
}

// 题目切换样式
.tramsform-form{
  transform: translateX(-70vw);
  opacity: .5;
  transition: transform .5s ease-in-out;
}
.tramsform-to{
  transform: translateX(70vw);
  opacity: .5;
  transition: transform .5s ease-in-out;
}

// 单选/多选
::v-deep(.el-radio-group){
  display: flex;
  margin: 20px 0 0;
  .el-radio{
    flex: 0 0 100vw;
    margin: 6px 0;
    .el-radio__label{
      font-size: 18px;
      font-weight: 400;
    }
    .el-radio__inner{
      width: 24px;
      height: 24px;
      color: #999;
      text-align: center;
      line-height: 22px;
      font-weight: 400;
    }
    .el-radio__input{
      margin: 2px 0 0 0;
    }
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #67c23a;
    background: #67c23a;
    color: #fff;
  }
  .el-radio__input.is-checked+.el-radio__label{
    color: #67c23a;
  }
  .el-radio__input.primary .el-radio__inner {
    border-color: #409eff;
    background: #409eff;
    color: #fff;
  }
  .el-radio__input.primary+.el-radio__label{
    color: #409eff;
  }
  .el-radio__input.danger .el-radio__inner {
    border-color: #f56c6c;
    background: #f56c6c;
    color: #fff;
  }
  .el-radio__input.danger+.el-radio__label{
    color: #f56c6c;
  }
  .el-radio__input.is-checked .el-radio__inner::after{
    transform: scale(0);
  }
  .el-icon{
    margin: 4px 0 0;
    color: #fff;
  }
}

// 标题
.tit{
  position: relative;
  margin: 26px 0 10px;
  padding: 0 0 0 14px;
  font-size: 20px;
}
.tit:before{
  content: '';
  position: absolute;
  top: 4px;
  left: 0;
  width: 4px;
  height: 20px;
  background: rgb(64, 158, 255);
}
</style>