<template>
  <div class="app-container home">
    <el-row>
      <el-col :span="7">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>社会主义法制理念</span>
              <el-button class="button" type="primary">未开始</el-button>
            </div>
          </template>
          <div class="card-cont">
            <el-rate v-model="value" disabled show-score text-color="#ff9900" score-template="{value}星" />
            <div class="num">0 / 50 题</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>刑法</span>
              <el-button class="button" type="danger">继续答题</el-button>
            </div>
          </template>
          <div class="card-cont">
            <el-rate v-model="value" disabled show-score text-color="#ff9900" score-template="{value}星" />
            <div class="num">3 / 50 题</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>办案行政案件程序</span>
              <el-button class="button" type="primary">未开始</el-button>
            </div>
          </template>
          <div class="card-cont">
            <el-rate v-model="value" disabled show-score text-color="#ff9900" score-template="{value}星" />
            <div class="num">0 / 50 题</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>社会主义法制理念</span>
              <el-button class="button" type="primary">未开始</el-button>
            </div>
          </template>
          <div class="card-cont">
            <el-rate v-model="value" disabled show-score text-color="#ff9900" score-template="{value}星" />
            <div class="num">0 / 50 题</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>刑法</span>
              <el-button class="button" type="danger">继续答题</el-button>
            </div>
          </template>
          <div class="card-cont">
            <el-rate v-model="value" disabled show-score text-color="#ff9900" score-template="{value}星" />
            <div class="num">3 / 50 题</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="7">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>办案行政案件程序</span>
              <el-button class="button" type="primary">未开始</el-button>
            </div>
          </template>
          <div class="card-cont">
            <el-rate v-model="value" disabled show-score text-color="#ff9900" score-template="{value}星" />
            <div class="num">0 / 50 题</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="chapter">

import { getHomeData, getEnum } from '@/api'
import logo from '@/assets/logo/logo.png'

const version = ref("3.8.1 - 2022-01-01")

const { proxy } = getCurrentInstance()

const value = ref(3)

const data = ref({
  productNum: 0,    // 产品数量
  productTagNum: 0,    // 产品标签数量
  schemeNum: 0,    // 方案数量
  orderNum: 0,    // 订单数量
  channelNum: 0,    // 金融机构数量
})

const getHomeDataFunc = () => {
  getHomeData()
    .then(res => {
      console.log('getHomeData: ',res);
      data.value = res.data
    })
}
getHomeDataFunc()

const getEnumFunc = () => {
  getEnum()
    .then(res => {
      console.log('getEnum: ',res);
      if (res.status) proxy.$cache.session.setJSON('Enum', res.data)
    })
}
getEnumFunc()


function goTarget(url) {
  window.open(url, "__blank");
}

</script>

<style scoped lang="scss">
.app-container{
  text-align: center;
}
.box-card {
  margin: 10px;
  .card-header,
  .card-cont {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .num{
    color: #A8ABB2;
  }
}
</style>