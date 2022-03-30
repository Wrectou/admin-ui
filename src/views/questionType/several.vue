<template>
  <div class="container answer">

    <div class="toolbar">
      <div class="type-box">
        <div class="type">多项选择题</div>
        <div class="chapter">当前章节：社会主义法制理念</div>
      </div>
      <div class="number" @click="isShowAnswerSheet=true">
        <div><span>1</span>/50</div>
        <el-button type="text">答题卡</el-button>
      </div>
    </div>

    <el-divider />

    <div class="content-box">

      <p class="question-title">
        <span class="fraction">({{questionObj.fraction}}分)</span>
        <div class="title">{{questionObj.question}}</div>
        <div class="collect check"><el-icon :size="24"><star-filled /></el-icon></div>
      </p>
      
      <div class="answer-box" @click="isAnswer=true">

        <!-- 选项组 -->
        <el-radio-group v-model="answerObj.answer">

          <!-- <el-radio v-for="item in questionObj.answerList" :key="item.value" :value="item.label" :label="item.value" size="large">{{item.label}}</el-radio> -->

          <!-- 未选中项目 -->
          <label class="el-radio">
            <span class="el-radio__input">
              <span class="el-radio__inner">A</span>
              <input class="el-radio__original" type="radio">
            </span>
            <span class="el-radio__label">依法治国</span>
          </label>

          <!-- 多选正确项但是没选 -->
          <label class="el-radio">
            <span class="el-radio__input is-checked primary">
              <span class="el-radio__inner">B</span>
              <input class="el-radio__original" type="radio">
            </span>
            <span class="el-radio__label">依法治国</span>
          </label>

          <!-- 正确 -->
          <label class="el-radio">
            <span class="el-radio__input is-checked">
              <span class="el-radio__inner">
                <el-icon><check /></el-icon>
              </span>
              <input class="el-radio__original" type="radio">
            </span>
            <span class="el-radio__label">依法治国</span>
          </label>

          <!-- 错误 -->
          <label class="el-radio">
            <span class="el-radio__input is-checked danger">
              <span class="el-radio__inner">
                <el-icon><close /></el-icon>
              </span>
              <input class="el-radio__original" type="radio">
            </span>
            <span class="el-radio__label">依法治国</span>
          </label>

        </el-radio-group>


        <div class="determine-answer">
          <el-button type="primary">确认答案</el-button>
        </div>


        <div class="change-question">
          <el-button type="text">上一题</el-button>
          <el-button type="text">下一题</el-button>
        </div>


      </div>


      <div v-if="isAnswer">
        <div class="answer-bar">
          <div class="default-answer">答案：A</div>
          <div class="user-answer">你的选择：B，用时： 5秒</div>
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
        <div class="analysis-box">
          略的卢卡申科大家顺利到家啊啥的就撒的空间啊啥的了；就撒了；到家啊时间到了撒
          略的卢卡申科大家顺利到家啊啥的就撒的空间啊啥的了；就撒了；到家啊时间到了撒
          略的卢卡申科大家顺利到家啊啥的就撒的空间啊啥的了；就撒了；到家啊时间到了撒
          略的卢卡申科大家顺利到家啊啥的就撒的空间啊啥的了；就撒了；到家啊时间到了撒
          略的卢卡申科大家顺利到家啊啥的就撒的空间啊啥的了；就撒了；到家啊时间到了撒
          略的卢卡申科大家顺利到家啊啥的就撒的空间啊啥的了；就撒了；到家啊时间到了撒
          略的卢卡申科大家顺利到家啊啥的就撒的空间啊啥的了；就撒了；到家啊时间到了撒
          略的卢卡申科大家顺利到家啊啥的就撒的空间啊啥的了；就撒了；到家啊时间到了撒
          略的卢卡申科大家顺利到家啊啥的就撒的空间啊啥的了；就撒了；到家啊时间到了撒
        </div>
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

<script setup name="several">

import { getHomeData, getEnum } from '@/api'

const { proxy } = getCurrentInstance()

const answerObj = reactive({
  answer: ''
})

const questionObj = reactive({
  fraction: 1,
  question: '（）是社会主义法制核心内容。',
  answerList: [
    {value: 1, label: '依法治国'},
    {value: 2, label: '执法为民'},
    {value: 3, label: '党的领导'},
    {value: 4, label: '公平正义'},
  ]
})

let isAnswer = ref(false)
let isShowAnswerSheet = ref(false)


</script>

<style scoped lang="scss">

.container{
  padding: 40px;
}

.toolbar{
  display: flex;
  align-items: end;
  justify-content: space-between;
  .type-box{
    font-size: 16px;
    .chapter{
      font-size: 12px;
      color: #999;
    }
  }
  .number{
    display: flex;
    align-items: center;
    flex-direction: column;
    span{
      color: #f56c6c;
    }
  }
}

.content-box{
  padding: 0 40px;
}

.question-title{
  display: flex;
  align-items: center;
  .fraction{
    margin: 0 10px 0 0;
    color: rgb(64, 158, 255);
  }
  .title{
    flex: 1;
    font-size: 20px;
  }
  .collect{
    color: #999;
    cursor: pointer;
  }
  .collect.check{
    color: rgba(250, 212, 0, 1);
  }
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

.change-question{
  margin: 20px 0 30px;
  display: flex;
  justify-content: space-between;
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