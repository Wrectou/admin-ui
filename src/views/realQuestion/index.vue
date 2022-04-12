<template>
  <div class="container chapter">

    <el-row>

      <el-col :span="6" v-for="item in epaperList.data" :key="item.name">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <p>{{item.name}}</p>
              <p class="rate gray">难度<el-rate v-model="item.difficulty" disabled show-score text-color="#ff9900" :score-template="item.difficulty+'星'" /></p>
              <p class="can-do gray">{{item.totalNum}}人做过</p>
            </div>
          </template>
          <div class="card-cont">
            <el-button plain class="button" type="primary" @click="showDialog(item)">做题</el-button>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <QuestionNotFound v-if="!isLoading && epaperList.data.length < 1" />

    <el-dialog
      v-model="dialogVisible"
      title="考试详情"
      width="30%"
    >
      <div class="cont">
        <div class="item">
          <span class="key">考试名称：</span>
          <span class="value">{{epaperDetail.data.name}}</span>
        </div>
        <div class="item">
          <span class="key">考试类型：</span>
          <span class="value">历年真题</span>
        </div>
        <div class="item">
          <span class="key">总题数：</span>
          <span class="value">{{epaperDetail.data.questionNum}}题</span>
        </div>
        <div class="item">
          <span class="key">考试时间：</span>
          <span class="value">{{epaperDetail.data.duration}}分钟</span>
        </div>
        <div class="item">
          <span class="key">合格标准：</span>
          <span class="value">满分{{epaperDetail.data.totalScore}}分，合格：{{epaperDetail.data.qualifiedScore}}分</span>
        </div>
        <!-- <div class="button-box">
          <el-button class="button" type="primary" @click="goLink(item)">开始考试</el-button>
        </div> -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="goLink">开始考试</el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script setup name="realQuestion">

import { getEpaperList, getEpaperDetail } from '@/api'
import QuestionNotFound from '@/components/questionNotFound/index'

const router = useRouter()

const { proxy } = getCurrentInstance()

let isLoading = ref(false)

// 列表
function getEpaperListFunc() {
  let params = {
    etype: 0,
    level: proxy.$cache.session.getJSON('level'),
  }
  isLoading.value = true
  getEpaperList(params)
    .then(res => {
      console.log('getEpaperList: ', res);
      isLoading.value = false
      epaperList.data = res.rows
    }, err => isLoading.value = false )
}
getEpaperListFunc()

const epaperList = reactive({
  data: []
})

// 详情
function getEpaperDetailFunc(id) {
  getEpaperDetail(id)
    .then(res => {
      console.log('getEpaperDetail: ',res);
      epaperDetail.data = res.data
    })
}
const epaperDetail = reactive({
  data: {}
})


let dialogVisible = ref(false)

const goLink = () => {
  dialogVisible.value = false
  router.push({ name: 'realQuestionAnswer', query: { id: epaperDetail.data.id, name: epaperDetail.data.name } })
  // proxy.$cache.session.setJSON('endRealQuestionTime', (new Date().getTime() + epaperDetail.data.duration*60*1000))
  proxy.$cache.session.setJSON('endRealQuestionTime', (new Date().getTime() + 15*60*1000))
}

const showDialog = item => {
  getEpaperDetailFunc(item.id)
  dialogVisible.value = true
}


</script>

<style scoped lang="scss">

.container{
  padding: 40px;
  text-align: center;
}

.box-card {
  margin: 10px;
  ::v-deep(.el-card__header){
    padding: 14px 15px !important;
    border-bottom: none;
  }
  ::v-deep(.el-card__body) {
    padding: 8px 14px !important;
  }
  .card-header,
  .card-cont {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  .card-header{
    p{
      margin: 0;
      flex: 1;
    }
    .rate{
      display: flex;
      align-items: center;
      .el-rate{
        margin: 2px 0 0 13px;
      }
    }
    .can-do{
      font-size: 13px;
    }
    .gray{
      color: #999;
    }
  }
  .card-cont{
    align-items: end;
  }
  .num{
    color: #A8ABB2;
  }
}


.cont{
  margin: 30px auto;
  padding: 20px;
  font-size: 18px;
  border-radius: 8px;
  background: #fff;
}
.item{
  display: flex;
  align-items: center;
  padding: 8px 10px;
  .key {
    flex: 0 0 100px;
    color: #333;
    text-align: left;
  }
  .value{
    color: #999;
  }
}
.button-box{
  margin: 60px 0 0;
  padding: 0 10px;
  text-align: center;
}
</style>