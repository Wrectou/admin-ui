<template>
  <div class="container chapter">
    <el-row>

      <el-col :span="6" v-for="item in data" :key="item.name">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <p>{{item.name}}</p>
              <p class="rate gray">难度<el-rate v-model="item.rate" disabled show-score text-color="#ff9900" :score-template="item.rate+'星'" /></p>
              <p class="can-do gray">{{item.canDo}}人做过</p>
            </div>
          </template>
          <div class="card-cont">
            <el-button class="button" type="primary" @click="goLink(item)">做题</el-button>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script setup name="realQuestion">

import { getHomeData, getEnum } from '@/api'

const { proxy } = getCurrentInstance()

const router = useRouter()

const data = reactive([
  { name: '2020年高级执法资格考试真题', canDo: 100, rate: 3, url: 'realQuestionDetail' },
  { name: '2019年高级执法资格考试真题', canDo: 99, rate: 4, url: 'realQuestionDetail' },
  { name: '2018年高级执法资格考试真题', canDo: 56, rate: 5, url: 'realQuestionDetail' },
  { name: '2017年高级执法资格考试真题', canDo: 30, rate: 2, url: 'realQuestionDetail' },
  { name: '2016年高级执法资格考试真题', canDo: 80, rate: 1, url: 'realQuestionDetail' },
])

const goLink = item => router.push({ name: item.url, query: { type: item.type } })


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
  }
  ::v-deep(.el-card__body) {
    padding: 10px 14px !important;
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