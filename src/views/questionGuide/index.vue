<template>
  <div class="container chapter">
    
    <div class="tit">考试指南</div>
    <el-row>

      <el-col :span="8" v-for="item in guideListData" :key="item.id">
        <el-card shadow="hover" @click="goLink(item)">
          <div class="card-header">
            <p class="title">
              <p>{{item.name}}</p>
              <el-icon><arrow-right /></el-icon>
            </p>
          </div>
        </el-card>
      </el-col>

      <el-skeleton :rows="5" animated :loading="isLoading" />

      <QuestionNotFound v-if="!isLoading && guideListData.length < 1" />

    </el-row>

  </div>
</template>

<script setup name="guide">

import { getGuideList } from '@/api'

import QuestionNotFound from '@/components/questionNotFound/index'

const { proxy } = getCurrentInstance()

const router = useRouter()

let isLoading = ref(false)

const guideListData = reactive([])

function getGuideListFunc() {
  isLoading.value = true
  getGuideList()
    .then(res => {
      console.log('getGuideList: ', res);
      if (res.code === 200) {
        isLoading.value = false
        res.rows.forEach(item => {
          let obj = {
            id: item.id,
            name: item.title
          }
          guideListData.push(obj)
        })
      }
    }, err => isLoading.value = false )
}
getGuideListFunc()

const goLink = item => router.push({ path: '/questionGuide/detail', query: { id: item.id } })


</script>

<style scoped lang="scss">

.container{
  padding: 40px;
}

.tit{
  position: relative;
  margin: 10px 0 16px;
  padding: 0 0 0 26px;
  font-size: 20px;
  text-align: left;
}
.tit:before{
  content: '';
  position: absolute;
  top: 6px;
  left: 10px;
  width: 4px;
  height: 18px;
  background: rgb(64, 158, 255);
}

.radio-box{
  margin: 0 0 20px;
  padding: 10px;
  text-align: left;
}

::v-deep(.el-col) {
  .el-card{
    margin: 10px;
    cursor: pointer;
    min-height: 75px;
  }
}

::v-deep(.el-card__body){
  padding: 14px 14px !important;
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
  .title{
    display: flex;
    align-items: start;
    width: 100%;
    >p{
      flex: 1;
      text-align: left;
    }
    ::v-deep(.el-icon){
      margin: 4px 0 0 2px;
    }
  }
  .can-do{
    font-size: 13px;
  }
  .gray{
    margin: 10px 0 0;
    color: #999;
  }
}
.card-cont{
  align-items: end;
}
.num{
  color: #A8ABB2;
}

.button-box{
  margin: 10px 0;
  text-align: right;
}
</style>