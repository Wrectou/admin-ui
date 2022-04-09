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
            <el-button plain class="button" type="primary" @click="goLink(item)">做题</el-button>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <QuestionNotFound v-if="!isLoading && epaperList.data.length < 1" />
  </div>
</template>

<script setup name="imitateQuestion">

import { getEpaperList, getEnum } from '@/api'
import QuestionNotFound from '@/components/questionNotFound/index'

const router = useRouter()

const { proxy } = getCurrentInstance()

let isLoading = ref(false)

function getEpaperListFunc() {
  let params = {
    etype: 1,
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

const goLink = item => router.push({ name: 'imitateQuestionDetail', query: { id: item.id } })


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
</style>