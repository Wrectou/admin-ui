<template>
  <div class="container answer">

    <el-row>

      <el-col :span="18">
    
        <!-- 倒计时 -->
        <!-- <div class="count-down">
          <div :class="['time', dangerCountDown]">倒计时：{{countTime}}</div>
          <div class="button"><el-button type="warning" @click="haveTimeCompleteTest">交卷</el-button></div>
        </div> -->

        <!-- 试卷名 -->
        <div class="test-name" v-if="!isLoadingData && questionArr.length > 0">{{route.query.name}}</div>

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
              :isShowCollect="false"
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

      </el-col>

      <el-col :span="6">

        <!-- 答题卡组件 -->
        <QuestionAnswerSheet 
          :isShowAnswerSheet="isShowAnswerSheet"
          :questionArr="questionArr"
          :answerSheetModel="'test'"
          :countTime="countTime"
          :dangerCountDown="dangerCountDown"
          :completeTestLoading="completeTestLoading"
          @changeQuestion="changeQuestionIndex"
          @changeAnswerSheet="changeAnswerSheet"
          @haveTimeCompleteTest="haveTimeCompleteTest"
        />

      </el-col>

    </el-row>

    <el-dialog
      v-model="showTestResultVisible"
      title="考试结果"
      width="40%"
      :close-on-click-modal="false"
      :before-close="testResulthandleClose"
    >
      <div class="result-content">
        <el-row>
          <el-col :sm="24" :lg="24" v-if="testResult.totalScore >= qualifiedScore">
            <el-result icon="success" title="合格" />
          </el-col>
          <el-col :sm="24" :lg="24" v-else>
            <el-result icon="error" title="不合格" />
          </el-col>
        </el-row>
        <div class="content">
          <div class="item">
            <div class="num">{{testResult.totalScore}}</div>
            <div>得分</div>
          </div>
          <div class="item">
            <div class="num" v-if="testResult.times">{{secondToMinth(testResult.times)}}</div>
            <div class="num" v-else>0</div>
            <div>用时</div>
          </div>
          <div class="item">
            <div class="num">{{testResult.questionNum - testResult.correntNum}}</div>
            <div>错题</div>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script setup name="myTestAnswer">

import { getTestEpaperQuestionList, getQuestionItem, getQuestionStatis, addPracticeQuestionAnswer, addFavorite, deleteFavorite, epaperCommit } from '@/api'

import { IndexTolLetter, LetterToIndex, questionTypeToText } from '@/utils'

import { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

import { ElMessage, ElMessageBox } from 'element-plus'

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
const router = useRouter()

const { proxy } = getCurrentInstance()

// 模式切换组件 属性/方法
let answerQuestion = ref(true)

// 正在显示的题目下标
let questionIndex = ref(0)
// 修改题目下标
const reduceQuestionIndex = () => { if (questionIndex.value > 0) questionIndex.value -- }
const plusQuestionIndex = () => { if (questionIndex.value < questionArr.length-1) questionIndex.value ++ }

// 倒计时
let countTime = ref('')
let timer = null
let dangerCountDown = ref('')
let isShowElMessageBox = false
const countDown = () => {
  clearInterval(timer)
  timer = setInterval(() => {
    var nowtimeGetTime = new Date().getTime(),
        endtimeGetTime = proxy.$cache.session.getJSON('endRealQuestionTime');
    var lefttime = endtimeGetTime - nowtimeGetTime,
        lefth = '0' + Math.floor(lefttime/(1000*60*60)%24),
        leftm = Math.floor(lefttime/(1000*60)%60) < 10 ? '0'+Math.floor(lefttime/(1000*60)%60) : Math.floor(lefttime/(1000*60)%60),
        lefts = Math.floor(lefttime/1000%60) < 10 ? '0'+Math.floor(lefttime/1000%60) : Math.floor(lefttime/1000%60);
    if ((lefttime/1000).toFixed() < 900) dangerCountDown.value = 'danger-count-down'
    if ((lefttime/1000).toFixed() >= 1) {
      countTime.value = lefth + ":" + leftm + ":" + lefts
    } else {
      countTime.value = "00:00:00"
      if (!isShowElMessageBox) {
        isShowElMessageBox = true
        ElMessageBox.alert('考试时间结束，请交卷！', '提示', {
          confirmButtonText: '确定',
          callback: async action => {
            console.log('action: ',action);
            try { 
              let res = await epaperCommitFunc()
              clearInterval(timer)
              testResult.value = res.data
              showTestResultVisible.value = true
              isShowElMessageBox = false
              isCompleteTest.value = true
            } catch (err) { }
          }
        })
      }
    }
  }, 1000)
}
countDown()

// 题目数组
const questionArr = reactive([])

// 加载题目数据
let isLoadingData = ref(false)

// 获取本章节所有题目
function getTestEpaperQuestionListFunc() {
  isLoadingData.value = true
  getTestEpaperQuestionList({epaperId: route.query.id})
    .then(async res => {
      console.log('getTestEpaperQuestionList: ',res);
      res.data.forEach(item => {
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
      if (route.query.isContinue) await arrangeLastRealQuestionData()
      else getQuestionItemFunc(0, res.data[0].id)
      isLoadingData.value = false
    }, err => isLoadingData.value = false )
}
getTestEpaperQuestionListFunc()

// 整理中断的答题数据
async function arrangeLastRealQuestionData() {
  let lastData = proxy.$cache.session.getJSON('lastRealQuestionData')

  for (let item of lastData.lastQuestionList) {
    for (let [index, qi] of questionArr.entries()) {
      if (item.questionId === qi.id) {
        let res = await getQuestionItemIsCheckedFunc(index, qi.id)
        qi.answerTime = item.times
        if (item.type === 1) {
          qi.type = 3
          qi.yourAnswer = LetterToIndex[item.reply]
          qi.answerList.length = 0
          res.forEach(i => {
            let obj = { value: LetterToIndex[i.identifier], label: i.title, isChecked: false }
            if (item.reply === i.identifier) obj.isChecked = true
            qi.answerList.push(obj)
          })
        } else if (item.type === 2) {
          qi.type = 1
          qi.yourAnswer = LetterToIndex[item.reply]
          qi.answerList.length = 0
          res.forEach(i => {
            let obj = { value: LetterToIndex[i.identifier], label: i.title, isChecked: false }
            if (item.reply === i.identifier) obj.isChecked = true
            qi.answerList.push(obj)
          })
        } else if (item.type === 3 || item.type === 4) {
          qi.type = 2
          let replyArr = item.reply.split('')
          replyArr = replyArr.map(item => item = LetterToIndex[item])
          qi.yourAnswer = replyArr
          qi.answerList.length = 0
          res.forEach(i => {
            let obj = { value: LetterToIndex[i.identifier], label: i.title, isChecked: false }
            if (item.reply.includes(i.identifier)) obj.isChecked = true
            qi.answerList.push(obj)
          })
        } else if (item.type === 5) {
          qi.type = 4
          qi.yourAnswer = item.reply
        }
        questionIndex.value = index
      }
    }
  }
}

// 获取题目选项  同步 用于继续考试
async function getQuestionItemIsCheckedFunc(i, id) {
  return new Promise((resolve, reject) => {
    getQuestionItem(id)
      .then(res => {
        if (res.code === 200) resolve(res.data)
      }, err => reject(err) )
  })
}

// 获取题目选项
function getQuestionItemFunc(i, id) {
  getQuestionItem(id)
    .then(res => {
      console.log('getQuestionItem: ',res);
      if (res.code === 200) {
        res.data.forEach(item => {
          let obj = {
            value: LetterToIndex[item.identifier], label: item.title, isChecked: false
          }
          questionArr[i].answerList.push(obj)
        })
      }
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
    qtype: 1,
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
      qtype: 1,
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
      quesionId: questionArr[questionIndex.value].id,
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
  let params = {
    correctAnswers: questionArr[i].okAnswer,
    epaperScoreId: route.query.epaperScore,
    isCorrect,
    practiceId: route.query.id,
    qtype: 1,
    questionId: id,
    reply: questionArr[i].yourAnswer,
    score: questionArr[i].fraction,
    times: questionArr[i].answerTime
  }
  // 1 3 单选 判断  4 论述
  // 2 多选 不定项
  if (questionArr[i].type === 1 || questionArr[i].type === 3) {
    params.reply = IndexTolLetter[questionArr[i].yourAnswer]
    params.correctAnswers = IndexTolLetter[questionArr[i].okAnswer]
    if (params.reply !== params.correctAnswers) params.score = 0
  } else if (questionArr[i].type === 2) {
    let correctAnswersArr = params.correctAnswers.map(item => item = IndexTolLetter[item])
    let correctAnswersStr = ''
    correctAnswersArr.forEach(item => correctAnswersStr+=item)
    let replyArr = params.reply.map(item => item = IndexTolLetter[item])
    let replyStr = ''
    replyArr.forEach(item => replyStr+=item)
    params.correctAnswers = correctAnswersStr
    params.reply = replyStr
    if (params.reply !== params.correctAnswers) params.score = 0
  } else if (questionArr[i].type === 4) {
    params.reply = ''
    params.correctAnswers = questionArr[i].okAnswer
    params.score = questionArr[i].yourAnswer
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
  // if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
  // 是单选切已经选过答案后点击没操作
  // if (questionArr[questionIndex.value].type === 1 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
  // 此处调接口
  isLoading.value = true
  // 答题时间
  let time = Number(((new Date() - answerTime.value)/1000).toFixed())
  questionArr[questionIndex.value].answerTime = time > 0 ? time : 1
  // 模拟接口延迟
  // setTimeout(() => {
    questionArr[questionIndex.value].answerList.forEach( item => item.isChecked = false )
    // 用户选择回答项
    questionArr[questionIndex.value].yourAnswer = item.value
    // 此选项已选择
    item.isChecked = true
    if (questionArr[questionIndex.value].yourAnswer === questionArr[questionIndex.value].okAnswer) {
      addPracticeQuestionAnswerFunc(1, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答正确去下一题
    } else {
      addPracticeQuestionAnswerFunc(0, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答错误显示答题解析
      // getQuestionStatisFunc(questionIndex.value, questionArr[questionIndex.value].id)
      // questionArr[questionIndex.value].isShowQuestionAnalysis = true
    }
    plusQuestionIndex()
    // 取消loading
    isLoading.value = false
  // }, 700)
}

// 多选点击选项
const checkAnswerSeveralItemFunc = item => {
  // 背题模式禁止操作
  // if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
  // 是单选切已经选过答案后点击没操作
  // if (questionArr[questionIndex.value].type === 2 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
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
  // if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
  // 是单选切已经选过答案后点击没操作
  // if (questionArr[questionIndex.value].type === 2 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
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
      // plusQuestionIndex()
    } else {
      addPracticeQuestionAnswerFunc(0, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答错误显示答题解析
      // questionArr[questionIndex.value].isShowQuestionAnalysis = true
      // 回答错误显示答题解析
      // getQuestionStatisFunc(questionIndex.value, questionArr[questionIndex.value].id)
    }
    plusQuestionIndex()
    // 取消loading
    isLoading.value = false
  // }, 700)
}

// 判断题选择点击/确定选择
const checkAnswerJudgeFunc = item => {
  // 背题模式禁止操作
  // if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
  // 是单选切已经选过答案后点击没操作
  // if (questionArr[questionIndex.value].type === 3 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
  // 此处调接口
  isLoading.value = true
  // 答题时间
  let time = Number(((new Date() - answerTime.value)/1000).toFixed())
  questionArr[questionIndex.value].answerTime = time > 0 ? time : 1
  // 模拟接口延迟
  // setTimeout(() => {
    questionArr[questionIndex.value].answerList.forEach( item => item.isChecked = false )
    // 用户选择回答项
    questionArr[questionIndex.value].yourAnswer = item.value
    // 此选项已选择
    item.isChecked = true
    if (questionArr[questionIndex.value].yourAnswer === questionArr[questionIndex.value].okAnswer) {
      addPracticeQuestionAnswerFunc(1, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答正确去下一题
      // plusQuestionIndex()
    } else {
      addPracticeQuestionAnswerFunc(0, questionIndex.value, questionArr[questionIndex.value].id)
      // 回答错误显示答题解析
      // getQuestionStatisFunc(questionIndex.value, questionArr[questionIndex.value].id)
      // questionArr[questionIndex.value].isShowQuestionAnalysis = true
    }
      plusQuestionIndex()
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
      // if (!answerQuestion.value) return ElMessage.error('当前为背题模式，不可答题！')
      // 是单选切已经选过答案后点击没操作
      // if (questionArr[questionIndex.value].type === 4 && questionArr[questionIndex.value].answerTime) return ElMessage.error('已作答题目不可再次答题！')
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

// 是否交卷
let isCompleteTest = ref(false)
// 交卷接口loading
let completeTestLoading = ref(false)
// 交卷按钮
const haveTimeCompleteTest = async () => {
  let nodo = 0
  questionArr.forEach(item => {
    if (item.answerTime == '') nodo ++
  })
  if (nodo === 0) {
    try { 
      let res = await epaperCommitFunc()
      console.log(res);
      isCompleteTest.value = true
      testResult.value = res.data
      showTestResultVisible.value = true
    } catch (err) { }
  } else {
    ElMessageBox.confirm(`还有${nodo}题未完成，确定交卷吗？`, '交卷', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning', 
      })
        .then(async () => {
          try { 
            let res = await epaperCommitFunc()
            console.log(res);
            isCompleteTest.value = true
            testResult.value = res.data
            showTestResultVisible.value = true
          } catch (err) { }
        })
        .catch(() => {
          console.log('取消交卷');
        })
  }
}

// 合格分数
let qualifiedScore = ref(route.query.qualifiedScore)
// 交卷接口
function epaperCommitFunc() {
  return new Promise((resolve, reject) => {
    console.log(((new Date().getTime() - proxy.$cache.session.getJSON('seartRealQuestionTime')) / 1000).toFixed());
    let times = ((new Date().getTime() - proxy.$cache.session.getJSON('seartRealQuestionTime')) / 1000).toFixed()
    completeTestLoading.value = true
    epaperCommit({epaperScoreId: route.query.epaperScore, times})
      .then(res => {
        console.log('epaperCommit: ', res);
        completeTestLoading.value = false
        resolve(res)
      }, err => {
        completeTestLoading.value = false
        reject(err)
      })
  })
}

// 是否显示考试结果
let showTestResultVisible = ref(false)
// 考试结果数据
let testResult = ref({
  totalScore: 0,
  times: 0,
  questionNum: 0,
  correntNum: 0,
})
// 关闭考试结果
const testResulthandleClose = done => {
  done()
  router.go(-1)
}

// 秒转分
let secondToMinth = second => {
  let lefth = Math.floor(second*1000/(1000*60*60)%24) < 10 ? '0' + Math.floor(second*1000/(1000*60*60)%24) : Math.floor(second*1000/(1000*60*60)%24),
      leftm = Math.floor(second*1000/(1000*60)%60) < 10 ? '0'+Math.floor(second*1000/(1000*60)%60) : Math.floor(second*1000/(1000*60)%60),
      lefts = Math.floor(second*1000/1000%60) < 10 ? '0'+Math.floor(second*1000/1000%60) : Math.floor(second*1000/1000%60);
  if (lefth > 0) return `${lefth}时${leftm}分`
  else if (leftm > 0) return `${leftm}分${lefts}秒`
  else return `${lefts}秒`
}

// 离开导航守卫
onBeforeRouteLeave(() => {
  if (!isCompleteTest.value) {
    const answer = window.confirm('必须交卷才可离开本页面!')
    return false
  }
  clearInterval(timer)
})


</script>

<style scoped lang="scss">

.container{
  padding: 40px;
}

.content-box{
  padding: 0 40px;
  overflow: hidden;
}

// 考试名称
.test-name{
  margin: 0 0 40px;
  text-align: center;
  font-size: 24px;
  color: #333;
  letter-spacing: 2px;
}

// 倒计时
// .count-down{
//   display: flex;
//   align-items: center;
//   justify-content: space-evenly;
//   margin: 0 0 40px;
//   .time{
//     font-size: 18px;
//     color: #333;
//   }
//   .danger-count-down{
//     color: #f56c6c;
//     animation: Flash 1s infinite;
//   }
// }
// @keyframes Flash {
//   0%{
//     transform: scale(1);
//   }
//   50%{
//     transform: scale(1.07);
//   }
//   100%{
//     transform: scale(1);
//   }
// }

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

.result-content{
  text-align: center;
  .content{
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .item{
      >div{
        font-size: 16px;
      }
      .num{
        color: var(--el-color-primary);
        margin: 0 0 10px;
        font-size: 24px;
      }
    }
  }
}
</style>