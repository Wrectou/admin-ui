<template>
  <div class="container answer">

    <div class="toolbar">
      <div class="type-box">
        <div class="type">判断题</div>
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
      
      <div class="answer-box">


        <el-collapse>
          <el-collapse-item name="1">
            <template #title>
              <el-button type="primary" round>查看解析</el-button>
            </template>
            <div class="content">
              <div class="tit">答案解析</div>
              根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》(法发〔2020]7号)规定,吴某已经确诊新冠肺炎。隔离期未满擅自脱离隔离治疗，并进入公共交通工具,危害公共安全的，未造成他人感染新冠肺炎。依照刑法第一百一十四条的规定,以以危险方法危害公共安全罪定罪处罚。根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》（法发[2020]7号)规定，梁某拒绝执行卫生防疫机构依照传染病防治法提出的防控措施,引起新型冠状病毒传播，依照刑法第三百三十条的规定，以妨害传染病防治罪定罪处罚。根据《最高人民法院、最高人民检察院、公安部、司法部关于依法惩治妨害新型冠状病毒感染肺炎疫情防控违法犯罪的意见》(法发〔2020]7号)规定,何某以暴力、威胁方法阻碍受国家机关委托代表国家机关行使疫情防控职权的组织中从事公务的人员依法履行为防控疫情而采取的防疫、检疫、强制隔离、隔离治疗等措施的，依照刑法第二百七十七条第一款、第三款的规定，以妨害公务罪定罪处罚。
            </div>
          </el-collapse-item>
        </el-collapse>

        

        <el-form
          :inline="true"
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="80px"
          class="form"
        >
          <el-form-item label="自评分数" prop="fraction">
            <el-input v-model="ruleForm.fraction" type="number" placeholder="请输入0~20之间的自评分数" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(ruleFormRef)">确定</el-button>
          </el-form-item>
        </el-form>



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

<script setup name="discuss">

import { getHomeData, getEnum } from '@/api'

const { proxy } = getCurrentInstance()

const ruleFormRef = ref()
const rules = reactive({
  fraction: [
    { required: true, message: '请输入0~20之间的自评分数', trigger: 'blur' },
    { min: 0, max: 20, message: '请输入0~20之间的自评分数', trigger: 'blur' },
  ],
})
const ruleForm = reactive({
  fraction: '',
})
const submitForm = (formEl) => {
  if (!formEl) return
  formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const answerObj = reactive({
  answer: ''
})

const questionObj = reactive({
  fraction: 20,
  question: '请论述辩护律师在公安机关侦查阶段享有的诉讼权利。',
  answerList: [
    {value: 1, label: '正确'},
    {value: 2, label: '错误'},
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
  .form{
    margin: 20px 0;
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