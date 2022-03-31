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

        <!-- 选项组 -->
        <div class="el-radio-group">

          <!-- 未选中项目 -->
          <label class="el-radio" v-for="(item, index) in questionArr[questionIndex].answerList" :key="item.value" @change="checkAnswerFunc(item)">
            <span :class="['el-radio__input', item.isChecked?'is-checked':'', item.isChecked&&questionArr[questionIndex].isShowQuestionAnalysis?'danger':'' ]">
              <!-- 正确 -->
              <span v-if="item.isChecked" class="el-radio__inner">
                <el-icon v-if="!questionArr[questionIndex].isShowQuestionAnalysis"><check /></el-icon>
                <el-icon v-else><close /></el-icon>
              </span>
              <!-- 没选中 -->
              <span v-else class="el-radio__inner">{{IndexTolLetter[index+1]}}</span>
              <input class="el-radio__original" type="radio">
            </span>
            <span class="el-radio__label">{{item.label}}</span>
          </label>

          <!-- 正确 -->
          <!-- <label class="el-radio">
            <span class="el-radio__input is-checked">
              <span class="el-radio__inner">
                <el-icon><check /></el-icon>
              </span>
              <input class="el-radio__original" type="radio">
            </span>
            <span class="el-radio__label">依法治国</span>
          </label> -->

          <!-- 错误 -->
          <!-- <label class="el-radio">
            <span class="el-radio__input is-checked danger">
              <span class="el-radio__inner">
                <el-icon><close /></el-icon>
              </span>
              <input class="el-radio__original" type="radio">
            </span>
            <span class="el-radio__label">依法治国</span>
          </label> -->

        </div>

        <!-- 题目切换组件 -->
        <QuestionChangeIndex 
          :questionIndex="questionIndex"
          @plusQuestionIndex="plusQuestionIndex"
          @reduceQuestionIndex="reduceQuestionIndex"
        />


      </div>


      <div v-if="questionArr[questionIndex].isShowQuestionAnalysis">


        <div class="answer-bar">
          <div class="default-answer">答案：{{IndexTolLetter[questionArr[questionIndex].okAnswer]}}</div>
          <div class="user-answer">你的选择：{{IndexTolLetter[questionArr[questionIndex].yourAnswer]}}，用时： 5秒</div>
        </div>


        <div class="tit">统计</div>
        <div class="statistics-box">
          <div class="item">
            <span>全站作答</span>
            <div class="num">300次</div>
          </div>
          <div class="item">
            <span>全站正确率</span>
            <div class="num">90%</div>
          </div>
          <div class="item">
            <span>易错项</span>
            <div class="num">B</div>
          </div>
        </div>


        <div class="tit">解析</div>
        <div class="analysis-box">{{questionArr[questionIndex].analysis}}</div>

      </div>


    </div>

    <el-drawer
      v-model="isShowAnswerSheet"
      title="答题卡"
      :direction="'rtl'"
    >
      <div @click="isShowAnswerSheet=false">
        <el-button type="danger">1</el-button>
        <el-button type="primary">2</el-button>
        <el-button>3</el-button>
        <el-button>4</el-button>
        <el-button>5</el-button>
      </div>
    </el-drawer>

  </div>
</template>

<script setup name="answer">

import { getHomeData, getEnum } from '@/api'
import { IndexTolLetter } from '@/utils'
import QuestionModel from '@/components/questionModel/index'
import QuestionToolBar from '@/components/questionToolBar/index'
import QuestionTitle from '@/components/questionTitle/index'
import QuestionChangeIndex from '@/components/questionChangeIndex/index'

const { proxy } = getCurrentInstance()

// 模式切换组件 属性/方法
let answerQuestion = ref(false)
const changeQuestionModel = value => answerQuestion.value = value

// 题目工具条 属性/方法
let toolbarObj = reactive({
  type: '单项选择题',
  chapter: '社会主义法制理念',
  number: {
    min: '1',
    max: '50'
  },
  isShowAnswerSheet: false
})
let isShowAnswerSheet = ref(false)
const changeAnswerSheet = value => isShowAnswerSheet.value = value

// 标题组件 属性/方法
const changeCollectTitle = value => {
  // 此处需要调借口
  setTimeout(() => {
    questionArr[questionIndex.value].isCollect = value
  }, 300)
}

const answerObj = reactive({
  answer: ''
})

let questionIndex = ref(0)
const reduceQuestionIndex = () => questionIndex.value --
const plusQuestionIndex = () => questionIndex.value ++

const questionArr = reactive([
    {
      type: 1,
      fraction: 1,
      title: '（）是社会主义法制核心内容。',
      isCollect: false,
      answerList: [
        {value: 1, label: '依法治国', isChecked: false},
        {value: 2, label: '执法为民', isChecked: false},
        {value: 3, label: '党的领导', isChecked: false},
        {value: 4, label: '公平正义', isChecked: false},
      ],
      yourAnswer: '',
      okAnswer: 1,
      analysis: 'dasldk就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒',
      isShowQuestionAnalysis: false,
    },
    {
      type: 1,
      fraction: 1,
      title: '（）是社会dklsajdklsjal主义法制核心内容。',
      isCollect: false,
      answerList: [
        {value: 1, label: '依法治国', isChecked: false},
        {value: 2, label: '执法为民', isChecked: false},
        {value: 3, label: '党的领导', isChecked: false},
        {value: 4, label: '公平正义', isChecked: false},
      ],
      yourAnswer: '',
      okAnswer: 2,
      analysis: 'dasldkdksadlksjkdljsklkj就撒开到好久啊大叔的黑科技啊说的话就卡上的回家看撒',
      isShowQuestionAnalysis: false,
    },
])

// 是否显示问题解析界面
let isLoading = ref(false)
// 单选选择
const checkAnswerFunc = item => {
  // 是单选切已经选过答案后点击没操作
  if (questionArr[questionIndex.value].type === 1 && questionArr[questionIndex.value].yourAnswer) return
  isLoading.value = true
  setTimeout(() => {
    questionArr[questionIndex.value].yourAnswer = item.value
    item.isChecked = true
    if (questionArr[questionIndex.value].yourAnswer === questionArr[questionIndex.value].okAnswer) {
      plusQuestionIndex()
    } else {
      questionArr[questionIndex.value].isShowQuestionAnalysis = true
    }
    isLoading.value = false
  }, 1300)
}


</script>

<style scoped lang="scss">

.container{
  padding: 40px;
}

.content-box{
  padding: 0 40px;
}


.answer-box{

}

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

.determine-answer{
  margin: 20px 0 30px;
}


.answer-bar{
  display: flex;
  align-items: end;
  margin: 20px 0 0;
  background: #f3f3f3;
  padding: 14px 10px;
  font-size: 14px;
  .default-answer{
    margin: 0 20px 0 0;
    color: #409eff;
    font-size: 16px;
  }
}

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

.statistics-box{
  display: flex;
  align-items: center;
  background: #f3f3f3;
  padding: 8px 10px;
  font-size: 14px;
  .item{
    flex: 0 0 200px;
    text-align: center;
    >span{
      color: #666;
    }
  }
  .item:nth-child(1) {
    .num{
      color: #333;
    }
  }
  .item:nth-child(2) {
    border-left: solid 1px #e3e3e3;
    .num{
      color: #67c23a;
    }
  }
  .item:nth-child(3) {
    border-left: solid 1px #e3e3e3;
    .num{
      color: #f56c6c;
    }
  }
}

.analysis-box{
  padding: 10px;
  background: #f3f3f3;
}

.answer-sheet-box{
  // display: flex;
  // .answer-num{
  //   flex: 0 0 20px;
  // }
}
</style>