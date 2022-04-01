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
        
        <div class="answer-box"
            v-loading="isLoading"
            element-loading-text="Loading..."
            element-loading-background="rgba(255, 255, 255, 0.3)"
          >
          <!-- 单选选项组 type类型为1 -->
          <div class="el-radio-group" v-if="questionArr[questionIndex].type === 1">

            <!-- 未选中项目 -->
            <label class="el-radio" v-for="(item, index) in questionArr[questionIndex].answerList" :key="item.value" @click="checkAnswerFunc(item)">
              <!-- 答题模式单选 -->
              <span v-if="answerQuestion" :class="['el-radio__input', item.isChecked ? 'is-checked' : '', item.isChecked && questionArr[questionIndex].isShowQuestionAnalysis ? 'danger' : '']">
                <!-- 正确 -->
                <span v-if="item.isChecked" class="el-radio__inner">
                  <el-icon v-if="!questionArr[questionIndex].isShowQuestionAnalysis"><check /></el-icon>
                  <el-icon v-else><close /></el-icon>
                </span>
                <!-- 没选中 -->
                <span v-else class="el-radio__inner">{{IndexTolLetter[index+1]}}</span>
              </span>
              <!-- 背题模式单选 -->
              <span v-else :class="['el-radio__input', questionArr[questionIndex].okAnswer === index+1 ? 'is-checked' : '']">
                <span v-if="questionArr[questionIndex].okAnswer === index+1" class="el-radio__inner">
                  <el-icon><check /></el-icon>
                </span>
                <span v-else class="el-radio__inner">{{IndexTolLetter[index+1]}}</span>
              </span>
              <!-- 选项名字 -->
              <span class="el-radio__label">{{item.label}}</span>
            </label>

          </div>

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

import { ElMessage } from 'element-plus'
import QuestionModel from '@/components/questionModel/index'
import QuestionToolBar from '@/components/questionToolBar/index'
import QuestionTitle from '@/components/questionTitle/index'
import QuestionChangeIndex from '@/components/questionChangeIndex/index'
import QuestionAnswerBar from '@/components/questionAnswerBar/index'
import QuestionStatistics from '@/components/questionStatistics/index'
import QuestionAnalysis from '@/components/questionAnalysis/index'
import QuestionAnswerSheet from '@/components/questionAnswerSheet/index'

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
const questionArr = reactive([
  {
    type: 1,
    fraction: 1,
    title: '1（）是社会主义法制核心内容。',
    isCollect: false,
    answerList: [
      {value: 1, label: '依法治国', isChecked: false},
      {value: 2, label: '执法为民', isChecked: false},
      {value: 3, label: '党的领导', isChecked: false},
      {value: 4, label: '公平正义', isChecked: false},
    ],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 1,
    allAnswerNum: 256,
    allAnswerCorrectRate: 86,
    fallibility: 2,
    analysis: '1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒',
    isShowQuestionAnalysis: false,
  },
  {
    type: 1,
    fraction: 1,
    title: '2（）是社会主义法制核心内容。',
    isCollect: false,
    answerList: [
      {value: 1, label: '依法治国', isChecked: false},
      {value: 2, label: '执法为民', isChecked: false},
      {value: 3, label: '党的领导', isChecked: false},
      {value: 4, label: '公平正义', isChecked: false},
    ],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 2,
    allAnswerNum: 256,
    allAnswerCorrectRate: 86,
    fallibility: 3,
    analysis: '1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒',
    isShowQuestionAnalysis: false,
  },
  {
    type: 1,
    fraction: 2,
    title: '3（）是社会主义法制核心内容。',
    isCollect: false,
    answerList: [
      {value: 1, label: '依法s治国', isChecked: false},
      {value: 2, label: '执法为民', isChecked: false},
      {value: 3, label: '党的领s导', isChecked: false},
      {value: 4, label: '公平正义', isChecked: false},
    ],
    yourAnswer: '',
    answerTime: '',
    okAnswer: 3,
    allAnswerNum: 123,
    allAnswerCorrectRate: 90,
    fallibility: 4,
    analysis: '1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒1就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒',
    isShowQuestionAnalysis: false,
  },
])

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
const checkAnswerFunc = item => {
  // 背题模式禁止操作
  if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
  // 是单选切已经选过答案后点击没操作
  if (questionArr[questionIndex.value].type === 1 && questionArr[questionIndex.value].yourAnswer) return
  // 此处调接口
  isLoading.value = true
  // 答题时间
  let time = Number(((new Date() - answerTime.value)/1000).toFixed())
  questionArr[questionIndex.value].answerTime = time>0 ? time : 1
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

// 单选样式
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