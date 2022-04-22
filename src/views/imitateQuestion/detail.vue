<template>
  <div class="container chapter">
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
      <div class="button-box">
        <el-button class="button" type="primary" @click="goLink(item)">开始考试</el-button>
      </div>
    </div>
  </div>
</template>

<script setup name="imitateQuestionDetail">

import { getEpaperDetail } from '@/api'

const { proxy } = getCurrentInstance()

const route = useRoute()
const router = useRouter()

function getEpaperDetailFunc() {
  getEpaperDetail(route.query.id)
    .then(res => {
      console.log('getEpaperDetail: ',res);
      epaperDetail.data = res.data
    })
}
getEpaperDetailFunc()

const epaperDetail = reactive({
  data: {}
})

const goLink = item => {
  router.push({ name: 'imitateQuestionAnswer', query: { id: route.query.id } })
  proxy.$cache.session.setJSON('endImitateQuestionTime', (new Date().getTime() + epaperDetail.data.duration*60*1000))
}


</script>

<style scoped lang="scss">

.container{
  margin: 0 auto;
  padding: 40px;
}
.cont{
  margin: 60px auto;
  padding: 20px;
  width: 40vw;
  font-size: 18px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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