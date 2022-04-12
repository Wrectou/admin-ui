<template>
  <!-- 答题卡组件 -->
  <div class="answer-sheet">
    <div class="title">答题卡</div>
    <div :class="['time', dangerCountDown]" v-if="answerSheetModel === 'test'">倒计时：{{countTime}}</div>
    <div class="sheets">
      <!-- 学习模式 -->
      <div v-if="answerSheetModel === 'learn'">
        <el-button v-for="(item, index) in questionArr" :key="item.title" @click="changeQuestionIndex(index)" :type="!item.answerTime ? '' : item.type === 4 || String(item.yourAnswer) === String(item.okAnswer) ? 'success' : 'danger' ">
          {{index+1}}
        </el-button>
      </div>
      <!-- 考试模式 -->
      <div v-if="answerSheetModel === 'test'">
        <el-button v-for="(item, index) in questionArr" :key="item.title" @click="changeQuestionIndex(index)" :type="!item.answerTime ? '' : 'primary'">
          {{index+1}}
        </el-button>
      </div>
    </div>
    <div class="button-box">
      <div class="example">
        <div class="item">
          <div class="white"></div>未答
        </div>
        <div class="item" v-if="answerSheetModel === 'test'">
          <div class="blue"></div>已答
        </div>
        <div class="item" v-if="answerSheetModel === 'learn'">
          <div class="blue"></div>正确
        </div>
        <div class="item" v-if="answerSheetModel === 'learn'">
          <div class="red"></div>错误
        </div>
      </div>
      <el-button v-if="answerSheetModel === 'test'" type="primary" round @click="haveTimeCompleteTest">交卷</el-button>
    </div>
  </div>
</template>

<script setup name="QuestionAnswerSheet">
  
  const props = defineProps({
    isShowAnswerSheet: {
      type: Boolean,
      default: false
    },
    // 答题卡模式：learn 学习  /  test 考试
    answerSheetModel: {
      type: String,
      default: 'learn'
    },
    // 考试倒计时
    countTime: {
      type: String,
      default: ''
    },
    // 考试时间少于15分钟
    dangerCountDown: {
      type: String,
      default: ''
    },
    questionArr: {
      type: Array,
      default: []
    }
  })

  const emit = defineEmits(['changeQuestion', 'changeAnswerSheet', 'haveTimeCompleteTest'])

  const handleClose = () => emit('changeAnswerSheet')

  const haveTimeCompleteTest = () => emit('haveTimeCompleteTest')

  const changeQuestionIndex = index => emit('changeQuestion', index)

</script>

<style lang="scss" scoped>
.answer-sheet{
  position: relative;
  margin: 0 0 0 26px;
  min-height: 480px;
  border: solid 1px #e9e9e9;
  .title{
    padding: 8px 0;
    background: #f3f3f3;
    text-align: center;    
  }
  .time{
    padding: 6px 0;
    text-align: center;
  }
  .danger-count-down{
    color: #f56c6c;
    animation: Flash 1s infinite;
  }
  @keyframes Flash {
    0%{
      transform: scale(1);
    }
    50%{
      transform: scale(1.07);
    }
    100%{
      transform: scale(1);
    }
  }
  .sheets {
    margin: 10px 6px;
    padding: 0 0 120px;
    .el-button{
      padding: 8px 10px;
      margin: 4px;
      min-width: 50px;
    }
    +.el-button{
      margin: 4px;
    }
  }
  .button-box{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 20px 0 0;
    .example{
      display: flex;
      justify-content: center;
      margin: 10px;
      .item{
        display: flex;
        align-items: center;
        margin: 0 8px 0 0;
        font-size: 13px;
        >div{
          margin: 0 4px 0 0;
          width: 16px;
          height: 16px;
        }
        .white{
          background: #fff;
        }
        .blue{
          background: #409eff;
        }
        .red{
          background: #f56c6c;
        }
      }
    }
    >.el-button{
      margin: 0 20px 20px;
      width: 87%;
      height: 34px;
    }
  }
}
</style>
