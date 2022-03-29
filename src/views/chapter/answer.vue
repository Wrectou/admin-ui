<template>
  <div class="container answer">

    <div class="toolbar">
      <div class="type-box">
        <div class="type">单项选择题</div>
        <div class="chapter">当前章节：社会主义法制理念</div>
      </div>
      <div class="number"><span>1</span>/50</div>
    </div>

    <el-divider />

    <div class="content-box">

      <p class="question-title">
        <span class="fraction">({{questionObj.fraction}}分)</span>
        <div class="title">{{questionObj.question}}</div>
      </p>
      
      <div class="answer-box">
        <el-radio-group v-model="answerObj.answer">
          <el-radio v-for="item in questionObj.answerList" :key="item.value" :value="item.label" :label="item.value" size="large">{{item.label}}</el-radio>
        </el-radio-group>
      </div>

    </div>

  </div>
</template>

<script setup name="answer">

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


</script>

<style scoped lang="scss">

.container{
  padding: 40px;
}

.toolbar{
  display: flex;
  align-items: center;
  justify-content: space-between;
  .type-box{
    font-size: 16px;
    .chapter{
      font-size: 12px;
      color: #999;
    }
  }
  .number{
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
    font-size: 18px;
  }
}
::v-deep(.el-radio-group){
  display: flex;
  .el-radio{
    flex: 0 0 100vw;
  }
  .el-radio.el-radio--large .el-radio__label{
    font-size: 16px;
  }
  .el-radio.el-radio--large .el-radio__inner{
    width: 16px;
    height: 16px;
  }
  .el-radio__input{
    margin: 2px 0 0 0;
  }
}
</style>