<template>
  <div class="container chapter">
    
    <div class="tit">专题学习</div>
    <el-row>

      <el-col :span="8" v-for="item in guideListData" :key="item.id">
        <el-card shadow="hover" @click="goLink(item)">
          <div class="card-header">
            <div class="picture">
              <img :src="item.picture">
            </div>
            <div class="content">
              <div class="title">{{item.name}}<el-icon><arrow-right /></el-icon></div>
              <div class="time">{{item.createTime}}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-skeleton :rows="5" animated :loading="isLoading" />

      <QuestionNotFound v-if="!isLoading && guideListData.length < 1" />

    </el-row>

  </div>
</template>

<script setup name="special">

import { getLearnMaterialsList } from '@/api'

import QuestionNotFound from '@/components/questionNotFound/index'

const { proxy } = getCurrentInstance()

const router = useRouter()

let isLoading = ref(false)

const guideListData = reactive([])

function getLearnMaterialsListFunc() {
  isLoading.value = true
  getLearnMaterialsList()
    .then(res => {
      console.log('getLearnMaterialsList: ', res);
      if (res.code === 200) {
        isLoading.value = false
        res.rows.forEach(item => {
          let obj = {
            id: item.id,
            name: item.title,
            picture: item.picture,
            createTime: item.createTime
          }
          guideListData.push(obj)
        })
      }
    }, err => isLoading.value = false )
}
getLearnMaterialsListFunc()

const goLink = item => router.push({ name: 'specialDetail', query: { id: item.id } })


</script>

<style scoped lang="scss">

.container{
  padding: 40px;
  text-align: center;
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

::v-deep(.el-col) {
  .el-card{
    margin: 10px;
    cursor: pointer;
    min-height: 75px;
  }
}

::v-deep(.el-card__body){
  padding: 12px 8px !important;
}

.card-header{
  display: flex;
  flex-direction: row;;
  align-items: start;
  .picture{
    flex: 0 0 110px;
    margin: 0 16px 0 0;
    img{
      width: 110px;
      height: 70px;
    }
  }
  .content{
    text-align: left;
    .title{
      display: flex;
      align-items: start;
      width: 100%;
      ::v-deep(.el-icon){
        margin: 4px 0 0 2px;
      }
    }
    .time{
      font-size: 13px;
      margin: 10px 0 0;
      color: #999;
    }
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