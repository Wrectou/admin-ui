<template>
  <div class="container chapter">

    <!-- 考试列表 -->
    <el-row>
      <el-col :span="24" v-for="item in epaperList.data" :key="item.id">

        <div class="test-content-box">
          <div class="test-title">
            <h3 class="title">{{item.name}}</h3>
            <div class="status" v-if="item.hisNum === 0">待考</div>
            <div class="status success" v-if="item.hisNum > 0 && item.lastScore > item.qualifiedScore">合格</div>
            <div class="status danger" v-if="item.hisNum > 0 && item.lastScore < item.qualifiedScore">不合格</div>
          </div>
          <div class="test-details">
            <div class="detail">时长{{item.duration}}分钟</div>
            <div class="detail">总分{{item.totalScore}}分</div>
            <div class="detail">合格分{{item.qualifiedScore}}分</div>
            <div class="detail">共{{item.questionNum}}题</div>
            <div class="detail">无限次</div>
          </div>
          <div class="test-rate-box">
            难度<el-rate v-model="item.difficulty" disabled text-color="#ff9900" />
          </div>
          <div class="button-box">

            <!-- 继续考试 -->
            <el-button 
              :loading="buttonLoading" class="button" type="primary" 
              v-if="item.lastEpaperScoreId !== null && calcEndtTime(item.endTime) > 0" 
              @click="goContinueTest(item)"
            >
              继续考试
            </el-button>

            <!-- 开始考试 / 停止考试 -->
            <el-button 
              v-if="item.hisNum === 0" 
              :loading="buttonLoading"
              :disabled="firstTestButtonText(item) !== '开始考试'" 
              class="button" 
              :type="firstTestButtonText(item) === '开始考试' ? 'primary' : firstTestButtonText(item) === '停止考试' ? 'danger' : ''" 
              @click="goTest(item)"
            >
              {{ firstTestButtonText(item) }}
            </el-button>

            <!-- 再考一次 -->
            <el-button 
              :loading="buttonLoading" class="button" type="primary" 
              v-if="item.hisNum > 0 && (item.allowNum === 0 || item.hisNum < item.allowNum) && calcStartTime(item.startTime) < 0 && calcEndtTime(item.endTime) > 0 && item.lastEpaperScoreId == null" 
              @click="goTest(item)"
            >
              再考一次
            </el-button>

            <!-- 停止考试 -->
            <el-button 
              :loading="buttonLoading"  class="button" type="danger" disabled
              v-if="item.hisNum > 0 && firstTestButtonText(item) === '停止考试'" 
            >
              停止考试
            </el-button>

            <!-- 已参加考试 -->
            <el-button :loading="buttonLoading" class="button" type="info" disabled 
              v-if="item.allowNum !== 0 && item.hisNum >= item.allowNum && firstTestButtonText(item) !== '停止考试'"
            >
              已参加考试
            </el-button>

            <!-- <el-button v-if="item.hisNum > 0" plain class="button" type="primary" @click="goTest(item)">查看考试</el-button> -->
            
          </div>
        </div>

        <div class="test-total-box">
          <div class="total">
            <span>已考次数</span>
            <div class="num primary">{{item.hisNum}}</div>
          </div>
          <div class="total">
            <span>得分</span>
            <div :class="['num', item.lastScore > item.qualifiedScore ? '' : 'danger']">{{item.lastScore}}</div>
          </div>
        </div>

      </el-col>
    </el-row>
    
    <!-- 骨架屏 -->
    <div class="skeleton-box" v-if="isLoading">
      <el-skeleton :rows="4" animated />
      <el-skeleton :rows="4" animated />
    </div>

    <!-- 没有数据 -->
    <QuestionNotFound v-if="!isLoading && epaperList.data.length < 1" />

  </div>
</template>

<script setup name="imitateQuestion">

import { onBeforeRouteLeave } from 'vue-router'

import { getEpaperSelflist, createEpaperScore } from '@/api'

import QuestionNotFound from '@/components/questionNotFound/index'


const router = useRouter()

const { proxy } = getCurrentInstance()

let isLoading = ref(false)

// 获取考试列表
const epaperList = reactive({
  data: []
})
function getEpaperSelflistFunc() {
  let params = {
    etype: 1,
    level: proxy.$cache.session.getJSON('level'),
  }
  isLoading.value = true
  getEpaperSelflist(params)
    .then(res => {
      console.log('getEpaperSelflist: ', res);
      isLoading.value = false
      epaperList.data = res.rows
    }, err => isLoading.value = false )
}
getEpaperSelflistFunc()

// 开始时间 / 结束时间 计算属性
let calcStartTime = computed(time => {
  return (time) => {
    if (time == null) return -1
    var nowTime = new Date().getTime()
    var startTime = new Date(time).getTime()
    return startTime-nowTime
  }
})
let calcEndtTime = computed(time => {
  return (time) => {
    if (time == null) return 1
    var nowTime = new Date().getTime()
    var endTime = new Date(time).getTime()
    return endTime-nowTime
  }
})

// 未开始倒计时
let countTime = ref('')
let timer = null
const countDown = (item) => {
  clearInterval(timer)
  timer = setInterval(() => {
    console.log(item);
    var nowtimeGetTime = new Date().getTime(),
        endtimeGetTime = new Date(item.startTime).getTime()
    var lefttime = endtimeGetTime - nowtimeGetTime,
        leftd = Math.floor(lefttime / 1000 / 60 / 60 / 24),
        lefth = Math.floor(lefttime/(1000*60*60)%24) < 10 ? '0' + Math.floor(lefttime/(1000*60*60)%24) : Math.floor(lefttime/(1000*60*60)%24),
        leftm = Math.floor(lefttime/(1000*60)%60) < 10 ? '0'+Math.floor(lefttime/(1000*60)%60) : Math.floor(lefttime/(1000*60)%60),
        lefts = Math.floor(lefttime/1000%60) < 10 ? '0'+Math.floor(lefttime/1000%60) : Math.floor(lefttime/1000%60);
        console.log(lefttime);
    if ((lefttime/1000).toFixed() >= 1) {
      countTime.value = leftd + '天 ' + lefth + ":" + leftm + ":" + lefts
    } else {
      countTime.value = "开始考试"
      clearInterval(timer)
    }
  }, 1000)
}

// 第一次开始按钮文字计算属性
let firstTestButtonText = computed(item => {
  return (item) => {
    if (!item.startTime && !item.endTime) return '开始考试'
    let nowTime = new Date().getTime()
    let startTime = new Date(item.startTime).getTime()
    let endTime = new Date(item.endTime).getTime()
    let calcStartTime = startTime-nowTime
    let calcEndTime = endTime-nowTime
    if (item.startTime == null) calcStartTime = -1
    if (item.endTime == null) calcEndTime = 1
    if (calcStartTime < 0 && (calcEndTime < 0 || calcEndTime === -1)) return '停止考试'
    else if (calcStartTime < 0 && calcEndTime > 0) return '开始考试'
    else {
      countDown(item)
      return countTime.value + ' 后开始'
    }
  }
})

// 开始考试按钮
let buttonLoading = ref(false)
const goTest = item => {
  buttonLoading.value = true
  createEpaperScore({epaperId: item.id, level: proxy.$cache.session.getJSON('level')})
    .then(res => {
      console.log('createEpaperScore: ', res);
      buttonLoading.value = true
      if (res.code === 200) {
        router.push({ path: '/imitateQuestion/answer', query: { id: item.id, epaperScore: res.data, name: item.name, qualifiedScore: item.qualifiedScore } })
        proxy.$cache.session.setJSON('endRealQuestionTime', (new Date().getTime() + item.duration*60*1000))
        proxy.$cache.session.setJSON('seartRealQuestionTime', new Date().getTime())
      }
    }, err => buttonLoading.value = false )
}

// 继续考试
const goContinueTest = item => {
  router.push({ path: '/imitateQuestion/answer', query: { id: item.id, epaperScore: item.lastEpaperScoreId, name: item.name, qualifiedScore: item.qualifiedScore, isContinue: true } })
  proxy.$cache.session.setJSON('endRealQuestionTime', (new Date().getTime() + item.duration*60*1000 - item.lastAnswerTotalTimes*1000))
  proxy.$cache.session.setJSON('seartRealQuestionTime', new Date().getTime())
  proxy.$cache.session.setJSON('lastRealQuestionData', item)
}

// 离开导航守卫
onBeforeRouteLeave(() => {
  clearInterval(timer)  
})

</script>

<style scoped lang="scss">

.container{
  padding: 40px;
}

::v-deep(.el-col){
  display: flex;
  justify-content: space-between;
  padding: 24px 20px 20px;
  border: solid 1px #e1e1e1;
  margin: 0 0 20px 0;
  border-radius: 8px;
  transition: all .3s;
}
::v-deep(.el-col:hover){
  transition: all .3s;
  box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
  background: #fff;
}
.test-content-box{
  .test-title{
    display: flex;
    align-items: center;
    .title{
      margin: 0;
    }
    .status{
      margin: 0 0 0 16px;
      padding: 2px 6px;
      font-size: 14px;
      color: #777;
      background: #f1f1f1;
      border: solid 1px #e1e1e1;
      border-radius: 6px;
      line-height: 1;
    }
    .success{
      color: #fff;
      background: var(--el-color-success);
      border: solid 1px var(--el-color-success);
    }
    .danger{
      color: #fff;
      background: var(--el-color-danger);
      border: solid 1px var(--el-color-danger);
    }
  }
  .test-details{
    display: flex;
    align-items: center;
    margin: 16px 0 0;
    color: #666;
    font-size: 15px;
    .detail{
      padding: 0 10px;
      border-left: solid 1px #d3d3d3;
      line-height: 1;
    }
    .detail:first-child{
      padding: 0 8px 0 0;
      border: none;
    }
  }
  .test-rate-box{
    display: flex;
    align-items: center;
    margin: 8px 0 16px;
    color: #666;
    font-size: 15px;
    .el-rate{
      margin: 0 0 0 10px;
    }
  }
  .button-box{
    .el-button{
      height: 30px;
      padding: 14px 12px;
    }
  }
}
.test-total-box{
  display: flex;
  padding: 24px 0 0;
  .total{
    margin: 0 14px;
    text-align: center;
    span{
      font-size: 13px;
      color: #999;
    }
    .num{
      margin: 4px 0 0;
      font-size: 24px;
      color: var(--el-color-success);
    }
    .primary{
      color: var(--el-color-primary);
    }
    .danger{
      color: var(--el-color-danger);
    }
  }
}

.skeleton-box{
  ::v-deep(.el-skeleton) {
    padding: 16px 0;
  } 
}

// .box-card {
//   margin: 10px;
//   ::v-deep(.el-card__header){
//     padding: 14px 15px !important;
//     border-bottom: none;
//   }
//   ::v-deep(.el-card__body) {
//     padding: 8px 14px !important;
//   }
//   .card-header,
//   .card-cont {
//     display: flex;
//     flex-direction: column;
//     align-items: start;
//   }
//   .card-header{
//     p{
//       margin: 0;
//       flex: 1;
//     }
//     .rate{
//       display: flex;
//       align-items: center;
//       .el-rate{
//         margin: 2px 0 0 13px;
//       }
//     }
//     .can-do{
//       font-size: 13px;
//     }
//     .gray{
//       color: #999;
//     }
//   }
//   .card-cont{
//     align-items: end;
//   }
//   .num{
//     color: #A8ABB2;
//   }
// }


// .cont{
//   margin: 0 auto;
//   padding: 20px;
//   font-size: 18px;
//   border-radius: 8px;
//   background: #fff;
// }
// .item{
//   display: flex;
//   align-items: center;
//   padding: 8px 10px;
//   .key {
//     flex: 0 0 100px;
//     color: #333;
//     text-align: left;
//   }
//   .value{
//     color: #999;
//   }
// }
// .button-box{
//   margin: 60px 0 0;
//   padding: 0 10px;
//   text-align: center;
// }
</style>