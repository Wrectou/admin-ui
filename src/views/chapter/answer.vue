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
          v-if="questionArr.length > 0"
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

        </div>

        <!-- 加载题目骨架屏 -->
        <el-skeleton :rows="5" animated :loading="isLoadingData" />

        <!-- 没有题目数据 -->
        <QuestionNotFound v-if="!isLoadingData && questionArr.length < 1" />

      </div>


      <!-- 题目切换组件 -->
      <QuestionChangeIndex 
        :questionIndex="questionIndex"
        :questionArrLength="questionArr.length"
        @plusQuestionIndex="plusQuestionIndex"
        @reduceQuestionIndex="reduceQuestionIndex"
      />

      <!-- 回答错误的错题解析 -->
      <div :class="switchQuestionClass" v-if="(questionArr.length > 0 && !answerQuestion) || (questionArr.length > 0 && questionArr[questionIndex].isShowQuestionAnalysis)">

        <!-- 回答错误工具组件 -->
        <QuestionAnswerBar
          v-if="questionArr[questionIndex].type !== 4"
          :questionAnswerBarObj="questionArr[questionIndex]"
        />

        <div class="tit" v-if="answerQuestion">统计</div>
        <!-- 答案统计组件 -->
        <QuestionStatistics 
          v-if="answerQuestion"
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
      @changeAnswerSheet="changeAnswerSheet"
    />

  </div>
</template>

<script setup name="chapterAnswer">

import { getSelfLastQuestionId, getQuestionList, getQuestionItem, getQuestionStatis, addPracticeQuestionAnswer, addFavorite, deleteFavorite  } from '@/api'

import { IndexTolLetter, LetterToIndex, questionTypeToText } from '@/utils'

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
import QuestionNotFound from '@/components/questionNotFound/index'

const route = useRoute()

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
// const questionArr = reactive(allQuestionData)
const questionArr = reactive([])

// 加载题目数据
let isLoadingData = ref(false)

// 获取本章节所有题目
function getQuestionListFunc() {
  let params = {
    level: proxy.$cache.session.getJSON('level'),
    practiceId: route.query.id,
    qtype: 0,
  }
  isLoadingData.value = true
  getQuestionList(params)
    .then(async res => {
      console.log('getQuestionList: ',res);
      res.rows.forEach(item => {
        let obj = {
          id: item.id,
          type: item.type,
          showType: item.type,
          fraction: item.score,
          title: item.title,
          isCollect: item.favorite === 1 ? true : false,
          answerList: [],
          yourAnswer: '',
          answerTime: '',
          okAnswer: '',
          allAnswerNum: '',
          allAnswerCorrectRate: '',
          fallibility: '',
          analysis: item.explanation,
          isShowQuestionAnalysis: false,
        }
        if (item.type === 1) {
          obj.type = 3
          obj.okAnswer = LetterToIndex[item.correctAnswers]
        } else if (item.type === 2) {
          obj.type = 1
          obj.okAnswer = LetterToIndex[item.correctAnswers]
        } else if (item.type === 3 || item.type === 4) {
          obj.type = 2
          obj.okAnswer = []
          obj.yourAnswer = []
          let correctAnswersArr = item.correctAnswers.split('')
          correctAnswersArr = correctAnswersArr.map(item => item = LetterToIndex[item])
          obj.okAnswer = correctAnswersArr
        } else if (item.type === 5) {
          obj.type = 4
        }
        questionArr.push(obj)
      })
      getSelfLastQuestionIdFunc()
      getQuestionItemFunc(0, res.rows[0].id)
    }, err => isLoadingData.value = false )
}
getQuestionListFunc()

// 获取做到哪一题
function getSelfLastQuestionIdFunc() {
  getSelfLastQuestionId(route.query.id)
    .then(res => {
      console.log('getSelfLastQuestionId: ',res);
      isLoadingData.value = false
      if (res.data) {
        questionArr.forEach((item, i) => {
          if (item.id === res.data) questionIndex.value = i
        })
      }
    }, err => isLoadingData.value = false )
}

// 获取题目选项
function getQuestionItemFunc(i, id) {
  getQuestionItem(id)
    .then(res => {
      console.log('getQuestionItem: ',res);
      res.data.forEach(item => {
        let obj = {
          value: LetterToIndex[item.identifier], label: item.title, isChecked: false
        }
        questionArr[i].answerList.push(obj)
      })
    })
}

// 获取题目统计信息 错题用
function getQuestionStatisFunc(i, id) {
  console.log(i);
  getQuestionStatis(id)
    .then(res => {
      console.log('getQuestionStatis: ',res);
      questionArr[i].allAnswerNum = res.data.answerNum
      questionArr[i].allAnswerCorrectRate = res.data.correct
      if (questionArr[i].type === 2) {
        let fallibilityArr = res.data.easyWrong.split('')
        fallibilityArr = fallibilityArr.map(item => item = LetterToIndex[item])
        questionArr[i].fallibility = fallibilityArr
      } else {
        questionArr[i].fallibility = LetterToIndex[res.data.easyWrong]
      }
    })
  favoriteErrQuestionFunc()
}

// 错题自动收藏
function favoriteErrQuestionFunc() {
  let params = {
    level: proxy.$cache.session.getJSON('level'),
    practiceId: route.query.id,
    qtype: 0,
    questionId: questionArr[questionIndex.value].id,
    type: 0,
  }
  addFavorite(params)
    .then(res => {
      console.log('addFavorite: ', res);
    })
}

// 是否显示右侧答题卡侧边栏
let isShowAnswerSheet = ref(false)
// 题目工具条 属性/方法
let toolbarObj = reactive({
  chapter: route.query.title,
  questionIndex,
  questionArr,
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
  if (!questionArr[questionIndex.value].isCollect) {
    let params = {
      level: proxy.$cache.session.getJSON('level'),
      practiceId: route.query.id,
      qtype: 0,
      questionId: questionArr[questionIndex.value].id,
      type: 1,
    }
    addFavorite(params)
      .then(res => {
        console.log('addFavorite: ', res);
        if (res.code === 200) {
          ElMessage.success('收藏成功！')
          questionArr[questionIndex.value].isCollect = !questionArr[questionIndex.value].isCollect
        }
        else ElMessage.error('收藏出错，请稍后再试！')
      })
  } else {
    let params = {
      questionId: questionArr[questionIndex.value].id,
      type: 1,
    }
    deleteFavorite(params)
      .then(res => {
        console.log('deleteFavorite: ', res);
        if (res.code === 200) {
          ElMessage.success('取消收藏成功！')
          questionArr[questionIndex.value].isCollect = !questionArr[questionIndex.value].isCollect
        }
        else ElMessage.error('取消收藏出错，请稍后再试！')
      })
  }
}

// 控制题目切换动画 / 获取下标对应id的答案选项
let switchQuestionClass = ref('')
watch(questionIndex, (newValue, oldValue) => {
  if (newValue > oldValue) switchQuestionClass.value = 'tramsform-form'
  else switchQuestionClass.value = 'tramsform-to'
  if (questionArr[newValue].answerList.length < 1) getQuestionItemFunc(newValue, questionArr[newValue].id)
  setTimeout(() => {
    switchQuestionClass.value = ''
    answerTime.value = new Date()
  }, 500)
})

// 答题开始时间，每开始一题设置为开始时间
let answerTime = ref(new Date())

// 回答问题接口
function addPracticeQuestionAnswerFunc(isCorrect, i, id) {
  console.log(questionArr[i]);
  let params = {
    correctAnswers: questionArr[i].okAnswer,
    isCorrect,
    practiceId: route.query.id,
    qtype: 0,
    questionId: id,
    reply: questionArr[i].yourAnswer,
    score: questionArr[i].fraction
  }
  // 多选
  if (questionArr[i].type === 2) {
    let correctAnswersArr = params.correctAnswers.map(item => item = IndexTolLetter[item])
    let correctAnswersStr = ''
    correctAnswersArr.forEach(item => correctAnswersStr+=item)
    params.correctAnswers = correctAnswersStr
    let replyArr = params.reply.map(item => item = IndexTolLetter[item])
    let replyStr = ''
    replyArr.forEach(item => replyStr+=item)
    params.reply = replyStr
  } 
  addPracticeQuestionAnswer(params)
    .then(res => {
      console.log('addPracticeQuestionAnswer: ', res);
    })
}

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
  // setTimeout(() => {
    // 用户选择回答项
    questionArr[questionIndex.value].yourAnswer = item.value
    // 此选项已选择
    item.isChecked = true
    if (questionArr[questionIndex.value].yourAnswer === questionArr[questionIndex.value].okAnswer) {
      addPracticeQuestionAnswerFunc(1, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答正确去下一题
      plusQuestionIndex()
    } else {
      addPracticeQuestionAnswerFunc(0, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答错误显示答题解析
      getQuestionStatisFunc(questionIndex.value, questionArr[questionIndex.value].id)
      questionArr[questionIndex.value].isShowQuestionAnalysis = true
    }
    // 取消loading
    isLoading.value = false
  // }, 700)
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
  // setTimeout(() => {
    // 答题时间
    let time = Number(((new Date() - answerTime.value)/1000).toFixed())
    questionArr[questionIndex.value].answerTime = time > 0 ? time : 1
    if (String(questionArr[questionIndex.value].yourAnswer) === String(questionArr[questionIndex.value].okAnswer)) {
      addPracticeQuestionAnswerFunc(1, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答正确去下一题
      plusQuestionIndex()
    } else {
      addPracticeQuestionAnswerFunc(0, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答错误显示答题解析
      questionArr[questionIndex.value].isShowQuestionAnalysis = true
      // 回答错误显示答题解析
      getQuestionStatisFunc(questionIndex.value, questionArr[questionIndex.value].id)
    }
    // 取消loading
    isLoading.value = false
  // }, 700)
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
  // setTimeout(() => {
    // 用户选择回答项
    questionArr[questionIndex.value].yourAnswer = item.value
    // 此选项已选择
    item.isChecked = true
    if (questionArr[questionIndex.value].yourAnswer === questionArr[questionIndex.value].okAnswer) {
      addPracticeQuestionAnswerFunc(1, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答正确去下一题
      plusQuestionIndex()
    } else {
      addPracticeQuestionAnswerFunc(0, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答错误显示答题解析
      getQuestionStatisFunc(questionIndex.value, questionArr[questionIndex.value].id)
      questionArr[questionIndex.value].isShowQuestionAnalysis = true
    }
    // 取消loading
    isLoading.value = false
  // }, 700)
}

// 论述题确定分数
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
      // setTimeout(() => {
        addPracticeQuestionAnswerFunc(1, questionIndex.value, questionArr[questionIndex.value].id)
        plusQuestionIndex()
        // 取消loading
        isLoading.value = false
      // }, 700)
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