<template>
  <div class="container answer">
    
    <el-row :gutter="12">
      
      <div class="tit" v-if="guideDetail.title">{{guideDetail.title}}</div>

      <div class="content" v-html="guideDetail.content"></div>

    </el-row>

      
  </div>
</template>

<script setup name="guideDetail">

import { getGuideDetail } from '@/api'

import { ElMessage } from 'element-plus'

const route = useRoute()

const { proxy } = getCurrentInstance()

const guideDetail = reactive({
  title: '',
  content: ''
})

function getGuideDetailFunc() {
  getGuideDetail(route.query.id)
    .then(res => {
      console.log('getGuideDetail: ', res);
      guideDetail.title = res.data.title
      guideDetail.content = res.data.content
    })
}
getGuideDetailFunc()

</script>

<style scoped lang="scss">

.container{
  padding: 40px;
}

.content-box{
  padding: 0 40px;
}

::v-deep(.el-row) {
  justify-content: center;
}

.content{
  max-width: 75%;
  flex: 0 0 75%;
}

// 标题
.tit{
  position: relative;
  margin: 26px 0 10px;
  padding: 0 0 0 14px;
  font-size: 20px;
  max-width: 75%;
  flex: 0 0 75%;
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
</style>