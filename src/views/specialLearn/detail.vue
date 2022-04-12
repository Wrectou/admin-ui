<template>
  <div class="container answer">
    
    <el-row :gutter="12">
      
      <div class="tit" v-if="guideDetail.title">{{guideDetail.title}}</div>

      <div class="content" v-html="guideDetail.content"></div>

    </el-row>

      
  </div>
</template>

<script setup name="specialDetail">

import { getLearnMaterialsDetail } from '@/api'

import { ElMessage } from 'element-plus'

const route = useRoute()

const { proxy } = getCurrentInstance()

const guideDetail = reactive({
  title: '',
  content: '',
  picture: '',
})

function getLearnMaterialsDetailFunc() {
  getLearnMaterialsDetail(route.query.id)
    .then(res => {
      console.log('getLearnMaterialsDetail: ', res);
      guideDetail.title = res.data.title
      guideDetail.content = res.data.content
      guideDetail.picture = res.data.picture
    })
}
getLearnMaterialsDetailFunc()

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
  max-width: 64%;
  flex: 0 0 64%;
  ::v-deep(img){
    margin: 0 auto;
    > span {
      display: inline-block;
      width: 100% !important;
      text-align: center;
    }
  }
}

// 标题
.tit{
  position: relative;
  margin: 26px 0;
  padding: 0 0 0 14px;
  font-size: 20px;
  max-width: 64%;
  flex: 0 0 64%;
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