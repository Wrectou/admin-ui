<template>
  <div class="container chapter">

    <el-radio-group v-model="typeRadio" @change="typeRadioChange" style="margin: 0 0 20px">
      <el-radio-button label="练习错题" />
      <el-radio-button label="试卷错题" />
    </el-radio-group>

    <el-row v-if="typeRadio === '练习错题'">

      <!--  左边 -->
      <el-col :span="5" style="margin: 27px 0 0;">
        <!-- 骨架屏 -->
        <el-skeleton v-if="isLoading" :rows="5" animated />
        <div 
          :class="['item', practiceId === item.id ? 'active' : '']" 
          v-if="favoritesSectionList.length > 1"
          v-for="item in favoritesSectionList" 
          :key="item.id" 
          @click="changePracticeId(item)"
        >
          <p class="title">
            <p>{{item.title}}</p>
            <el-icon><arrow-right /></el-icon>
          </p>
          <span class="can-do" v-if="item.num">{{item.num}}题</span>
        </div>
      </el-col>
      <!-- 右边 -->
      <el-col :span="19">
        <!-- 骨架屏 -->
        <el-skeleton v-if="tableLoading && tableFirstLoading" :rows="5" animated style="margin: 27px 10px 0;" />
        <!-- 列表搜索项 -->
        <el-form :model="favoritesQuestionListParams" ref="queryRef" :inline="true" v-if="!tableFirstLoading && favoritesSectionList.length > 1">
          <el-row class="control-bar">
            <el-col :span="4" class="control-left">
            </el-col>
            <el-col :span="20" class="control-right">
              <el-col :span="24">
                <el-form-item label="" prop="title" class="search-input">
                  <el-input v-model="favoritesQuestionListParams.title" placeholder="输入标题名称" />
                </el-form-item>
                <el-button icon="Search" type="primary" @click="getFavoritesQuestionListFunc">搜索</el-button>
                <el-button icon="Refresh" @click="resetListParams">重置</el-button>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
        <div class="table-box" v-if="!tableFirstLoading && favoritesSectionList.length > 1">
          <!-- 表格 -->
          <el-table v-loading="tableLoading" :data="favoritesQuestionList.list">
            <el-table-column label="标题" align="left" prop="title" min-width="220" />
            <el-table-column label="章节" align="center" prop="sectionName" width="210" />
            <!-- <el-table-column label="熟悉程度" align="center" prop="score" width="170">
              <template #default="scope"><el-rate v-model="scope.row.score" disabled text-color="#ff9900" /></template>
            </el-table-column> -->
            <el-table-column label="时间" align="center" prop="updateTime" width="170" />
            <el-table-column label="操作" align="center" width="200">
              <template #default="scope">
                <el-button plain type="primary" @click="toAnswer(scope.row)">详情</el-button>
                <el-button plain type="danger" @click="deleteFavoriteFunc(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <pagination @pagination="getFavoritesQuestionListFunc" v-show="favoritesQuestionList.total > 0" :total="favoritesQuestionList.total" v-model:page="favoritesQuestionListParams.pageNum" v-model:limit="favoritesQuestionListParams.pageSize" />
        </div>
      </el-col>

    </el-row>

    <el-row v-else>

      <!--  左边 -->
      <el-col :span="5" style="margin: 27px 0 0;">
        <!-- 骨架屏 -->
        <el-skeleton v-if="isLoading1" :rows="5" animated />
        <div 
          :class="['item', practiceId1 === item.id ? 'active' : '']" 
          v-if="favoritesSectionList1.length > 1"
          v-for="item in favoritesSectionList1" 
          :key="item.id" 
          @click="changePracticeId1(item)"
        >
          <p class="title">
            <p>{{item.name}}</p>
            <el-icon><arrow-right /></el-icon>
          </p>
          <span class="can-do" v-if="item.num">{{item.num}}题</span>
        </div>
      </el-col>
      <!-- 右边 -->
      <el-col :span="19">
        <!-- 骨架屏 -->
        <el-skeleton v-if="tableLoading1 && tableFirstLoading1" :rows="5" animated style="margin: 27px 10px 0;" />
        <!-- 列表搜索项 -->
        <el-form :model="favoritesQuestionListParams1" ref="queryRef1" :inline="true" v-if="!tableFirstLoading1 && favoritesSectionList1.length > 1">
          <el-row class="control-bar">
            <el-col :span="4" class="control-left">
            </el-col>
            <el-col :span="20" class="control-right">
              <el-col :span="24">
                <el-form-item label="" prop="title" class="search-input">
                  <el-input v-model="favoritesQuestionListParams1.title" placeholder="输入标题名称" />
                </el-form-item>
                <el-button icon="Search" type="primary" @click="getFavoritesQuestionListFunc1">搜索</el-button>
                <el-button icon="Refresh" @click="resetListParams1">重置</el-button>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
        <div class="table-box" v-if="!tableFirstLoading1 && favoritesSectionList1.length > 1">

          <!-- 表格 -->
          <el-table v-loading="tableLoading1" :data="favoritesQuestionList1.list">
            <el-table-column label="标题" align="left" prop="title" min-width="220" />
            <el-table-column label="章节" align="center" prop="sectionName" width="210" />
            <!-- <el-table-column label="熟悉程度" align="center" prop="score" width="170">
              <template #default="scope"><el-rate v-model="scope.row.score" disabled text-color="#ff9900" /></template>
            </el-table-column> -->
            <el-table-column label="时间" align="center" prop="updateTime" width="170" />
            <el-table-column label="操作" align="center" width="200">
              <template #default="scope">
                <el-button plain type="primary" @click="toAnswer1(scope.row)">详情</el-button>
                <el-button plain type="danger" @click="deleteFavoriteFunc1(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <pagination @pagination="getFavoritesQuestionListFunc1" v-show="favoritesQuestionList1.total > 0" :total="favoritesQuestionList1.total" v-model:page="favoritesQuestionListParams1.pageNum" v-model:limit="favoritesQuestionListParams1.pageSize" />
        </div>
      </el-col>

    </el-row>

    <!-- 没有数据 -->
    <QuestionNotFound v-if="typeRadio === '练习错题' && !isLoading && favoritesSectionList.length < 2" />
    <QuestionNotFound v-if="typeRadio === '试卷错题' && !isLoading1 && favoritesSectionList1.length < 2" />

    <!-- 答题弹框 -->
    <el-dialog
      v-model="dialogVisible"
      title="我的收藏"
      width="60%"
    >
      <div class="answer-box">

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
              :isShowCollect=false
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

      </div>
    </el-dialog>

  </div>
</template>

<script setup name="errorQuestion">

import { getFavoritesQuestionSectionList, getFavoritesQuestionList, getQuestionItem, getQuestionStatis, addPracticeQuestionAnswer, addFavorite, deleteFavorite, getPracticeFavoritesEpaperList, getPracticeFavoritesEpaperQuestionList } from '@/api'

import QuestionNotFound from '@/components/questionNotFound/index'

import { ElMessage } from 'element-plus'
import QuestionModel from '@/components/questionModel/index'
import QuestionToolBar from '@/components/questionToolBar/index'
import QuestionTitle from '@/components/questionTitle/index'
import QuestionChangeIndex from '@/components/questionChangeIndex/index'
import QuestionAnswerBar from '@/components/questionAnswerBar/index'
import QuestionStatistics from '@/components/questionStatistics/index'
import QuestionAnalysis from '@/components/questionAnalysis/index'
import QuestionAnswerSingle from '@/components/questionAnswerSingle/index'
import QuestionAnswerSeveral from '@/components/questionAnswerSeveral/index'
import QuestionAnswerJudge from '@/components/questionAnswerJudge/index'
import QuestionAnswerDiscuss from '@/components/questionAnswerDiscuss/index'

import { IndexTolLetter, LetterToIndex, questionTypeToText } from '@/utils'


const { proxy } = getCurrentInstance()

const route = useRoute()
const router = useRouter()

// 错题类型
let typeRadio = ref('练习错题')
const typeRadioChange = e => {
  console.log(e);
  if (e === '试卷错题') {
    getPracticeFavoritesEpaperListFunc()
    getFavoritesQuestionListFunc1()
  } else {
    getFavoritesQuestionSectionListFunc()
    getFavoritesQuestionListFunc()
  }
}


let isLoading1 = ref(false)

// 获取收藏题目的id 默认空取所有
let practiceId1 = ref('')

// 收藏目录数据
let favoritesSectionList1 = ref([
  { id: "", name: '全部',  }
])
// 获取收藏-试卷列表（自己）
function getPracticeFavoritesEpaperListFunc() {
  isLoading1.value = true
  getPracticeFavoritesEpaperList({level: proxy.$cache.session.getJSON('level')})
    .then(res => {
      console.log('获取收藏-试卷列表（自己）getPracticeFavoritesEpaperList: ', res);
      isLoading1.value = false
      if (res.code === 200) {
        favoritesSectionList1.value.length = 1
        res.data.forEach(item => favoritesSectionList1.value.push(item))
      }
    }, err => isLoading1.value = false )
}


let tableLoading1 = ref(false)
let tableFirstLoading1 = ref(true)
// 收藏目录数据
let favoritesQuestionList1 = reactive({
  total: 0,
  list: []
})
// 获取收藏题目
let favoritesQuestionListParams1 = reactive({
  pageNum: 1,
  pageSize: 10,
  level: proxy.$cache.session.getJSON('level'),
  epaperId: practiceId1.value,
  title: '',
})
function getFavoritesQuestionListFunc1() {
  tableLoading1.value = true
  getPracticeFavoritesEpaperQuestionList(favoritesQuestionListParams1)
    .then(res => {
      console.log('dasdasda: ', res);
      tableLoading1.value = false
      tableFirstLoading1.value = false
      if (res.code === 200) {
        favoritesQuestionList1.total = res.total
        favoritesQuestionList1.list = res.rows
      }
    }, err => tableLoading1.value = false )
}

// 更改章节id
const changePracticeId1 = item => {
  practiceId1.value = item.id
  favoritesQuestionListParams1.epaperId = item.id
  getFavoritesQuestionListFunc1()
}

 // 重置搜索项
const resetListParams1 = () => {
  proxy.resetForm("queryRef1")
  getFavoritesQuestionListFunc1()
}


let questionArrPracticeId1 = ref('')

// 详情
const toAnswer1 = item => {

  questionArrPracticeId1.value = item.practiceId

  let thisId = item.id

  let params = {
    pageNum: 1,
    pageSize: 1000,
    level: proxy.$cache.session.getJSON('level'),
    epaperId: practiceId1.value,
    title: '',
  }
  isLoadingData.value = true
  questionArr.length = 0
  getPracticeFavoritesEpaperQuestionList(params)
    .then( async res => {
      console.log('toAnswer1: ', res);
      if (res.code === 200) {
        dialogVisible.value = true
        res.rows.forEach((item, i) => {
          if (thisId === item.id) questionIndex.value = i
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
        isLoadingData.value = false
      }
      // getSelfLastQuestionIdFunc()
      getQuestionItemFunc(0, res.rows[0].id)
    }, err => isLoadingData.value = false )
}

// 删除  /  取消收藏
function deleteFavoriteFunc1(item) {
  console.log(item);
  let params = {
    quesionId: item.id,
    type: 2,
  }
  deleteFavorite(params)
    .then(res => {
      console.log('deleteFavorite: ', res);
      if (res.code === 200) {
        ElMessage.success('取消收藏成功！') 
        getFavoritesQuestionListFunc1()
      } else ElMessage.error('取消收藏出错，请稍后再试！')
    })
}







let isLoading = ref(false)

// 获取收藏题目的id 默认空取所有
let practiceId = ref('')

// 收藏目录数据
let favoritesSectionList = ref([
  { id: "", title: '全部',  }
])
// 获取收藏目录
function getFavoritesQuestionSectionListFunc() {
  let params = {
    level: proxy.$cache.session.getJSON('level'),
    type: 0,
  }
  isLoading.value = true
  getFavoritesQuestionSectionList(params)
    .then(res => {
      console.log('getFavoritesQuestionSectionList: ', res);
      isLoading.value = false
      if (res.code === 200) {
        favoritesSectionList.value.length = 1
        res.data.forEach(item => favoritesSectionList.value.push(item))
      }
    }, err => isLoading.value = false )
}
getFavoritesQuestionSectionListFunc()


let tableLoading = ref(false)
let tableFirstLoading = ref(true)
// 收藏目录数据
let favoritesQuestionList = reactive({
  total: 0,
  list: []
})
// 获取收藏题目
let favoritesQuestionListParams = reactive({
  pageNum: 1,
  pageSize: 10,
  level: proxy.$cache.session.getJSON('level'),
  type: 0,
  practiceId: '',
  title: '',
})
function getFavoritesQuestionListFunc() {
  tableLoading.value = true
  getFavoritesQuestionList(favoritesQuestionListParams)
    .then(res => {
      console.log('getFavoritesQuestionList: ', res);
      tableLoading.value = false
      tableFirstLoading.value = false
      if (res.code === 200) {
        favoritesQuestionList.total = res.total
        favoritesQuestionList.list = res.rows
      }
    }, err => tableLoading.value = false )
}
getFavoritesQuestionListFunc()

// 更改章节id
const changePracticeId = item => {
  practiceId.value = item.id
  favoritesQuestionListParams.practiceId = item.id
  getFavoritesQuestionListFunc()
}

 // 重置搜索项
const resetListParams = () => {
  proxy.resetForm("queryRef")
  getFavoritesQuestionListFunc()
}

let questionArrPracticeId = ref('')

// 详情
const toAnswer = item => {

  questionArrPracticeId.value = item.practiceId

  let thisId = item.id

  let params = {
    pageNum: 1,
    pageSize: 1000,
    level: proxy.$cache.session.getJSON('level'),
    type: 0,
    practiceId: questionArrPracticeId.value,
    title: '',
  }
  isLoadingData.value = true
  questionArr.length = 0
  getFavoritesQuestionList(params)
    .then( async res => {
      console.log('toAnswer: ', res);
      if (res.code === 200) {
        dialogVisible.value = true
        res.rows.forEach((item, i) => {
          if (thisId === item.id) questionIndex.value = i
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
        isLoadingData.value = false
      }
      // getSelfLastQuestionIdFunc()
      getQuestionItemFunc(0, res.rows[0].id)
    }, err => isLoadingData.value = false )
}

// 删除  /  取消收藏
function deleteFavoriteFunc(item) {
  console.log(item);
  let params = {
    quesionId: item.id,
    type: 0,
  }
  deleteFavorite(params)
    .then(res => {
      console.log('deleteFavorite: ', res);
      if (res.code === 200) {
        ElMessage.success('取消收藏成功！') 
        getFavoritesQuestionListFunc()
      } else ElMessage.error('取消收藏出错，请稍后再试！')
    })
}


// 弹窗内容 -------------------------------------------------------------------------------

// 弹窗显示
const dialogVisible = ref(false)

// 模式切换组件 属性/方法
let answerQuestion = ref(true)
const changeQuestionModel = () => answerQuestion.value = !answerQuestion.value

// 正在显示的题目下标
let questionIndex = ref(0)
// 修改题目下标
const reduceQuestionIndex = () => { if (questionIndex.value > 0) questionIndex.value -- }
const plusQuestionIndex = () => { if (questionIndex.value < questionArr.length-1) questionIndex.value ++ }

// 题目数组
const questionArr = reactive([])

// 加载题目数据
let isLoadingData = ref(false)

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
    practiceId: questionArrPracticeId.value,
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
      practiceId: questionArrPracticeId.value,
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
    isCorrect,
    practiceId: questionArrPracticeId.value,
    qtype: 2,
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
  if (typeRadio.value === '练习错题') {
    addPracticeQuestionAnswer(params)
      .then(res => {
        console.log('addPracticeQuestionAnswer: ', res);
      })
  }
}

// // 是否显示问题解析界面
// let isLoading = ref(false)

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
  padding: 40px 20px;
  min-height: 100vh;
  background: #fff;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 14px 0;
  padding: 10px 8px 10px 14px;
  min-height: 69px;
  color: #333;
  border: solid 1px #e1e1e1;
  border-radius: 8px;
  transition: all 0.3s;
  p{
    margin: 0;
    flex: 1;
  }
  .title{
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 15px;
    >p{
      flex: 1;
      text-align: left;
    }
  }
  .can-do{
    margin: 6px 0 0;
    color: #999;
    font-size: 13px;
  }
}
.item:hover{
  transition: all 0.3s;
  box-shadow: 0 3px 4px 2px #e1e1e1;
  cursor: pointer;
}
.active{
  color: var(--el-color-primary);
  box-shadow: 0 3px 4px 2px #e1e1e1;
  .can-do{
    color: var(--el-color-primary);
  }
}

.control-bar{
  .search-input{
    margin: 0;
  }
  .control-right{
    display: flex;
    text-align: right;
  }
}

.table-box{
  margin: 10px 0 0 10px;
  padding: 0 0 10px;
  border: solid 1px #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
  ::v-deep(.el-table) {
    background: transparent;
    tr{
      background: transparent;
    }
  }
  ::v-deep(.pagination-container){
    background: transparent;
  }
}




.answer-box{
  padding: 0 30px;
  overflow: hidden;
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