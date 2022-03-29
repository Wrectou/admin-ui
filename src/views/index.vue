<template>
  <div class="app-container home">
    <el-row>
      <el-col :span="8">
        <div class="card" @click="router.push({name: 'chapter'})">
          <img class="logo" :src="logo" />
          <div class="content">
            <span>章节练习</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <img class="logo" :src="logo" />
          <div class="content">
            <span>每日练习</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <img class="logo" :src="logo" />
          <div class="content">
            <span>历年真题</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <img class="logo" :src="logo" />
          <div class="content">
            <span>模拟考试</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <img class="logo" :src="logo" />
          <div class="content">
            <span>错题解析</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <img class="logo" :src="logo" />
          <div class="content">
            <span>学习报告</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <img class="logo" :src="logo" />
          <div class="content">
            <span>大练兵</span>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="card">
          <img class="logo" :src="logo" />
          <div class="content">
            <span>视频学习</span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup name="Index">

import { getHomeData, getEnum } from '@/api'
import logo from '@/assets/logo/logo.png'
import { useRouter } from 'vue-router';

const version = ref("3.8.1 - 2022-01-01")

const router = useRouter()

const { proxy } = getCurrentInstance()

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
.home {
  padding: 80px;
  min-height: 100vh;
  .card{
    padding: 40px;
    height: 100%;
    background: #ffffff;
    text-align: center;
    transition: transform .3s;
  }
  .card:hover{
    transform: scale(1.1);
    transition: transform .3s;
    border: solid 1px #f4f4f4;
    cursor: pointer;
  }
}
</style>

