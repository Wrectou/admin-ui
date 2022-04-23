<template>
  <div class="container chapter">


    <el-row>

      <!--  左边 -->
      <el-col :span="5">
        <!-- 骨架屏 -->
        <el-skeleton v-if="isLoading" :rows="5" animated />
        <div 
          :class="['item', learnId === item.id ? 'active' : '']" 
          v-if="guideTypeData.length > 1"
          v-for="item in guideTypeData" 
          :key="item.id" 
          @click="changelearnId(item)"
        >
          <p class="title"><p>{{item.title}}</p><el-icon><arrow-right /></el-icon></p>
        </div>
      </el-col>
      <!-- 右边 -->
      <el-col :span="18" style="margin: 4px 0 0 4px;">
        <!-- 骨架屏 -->
        <el-skeleton v-if="tableLoading" :rows="5" animated style="margin: 27px 10px 0;" />
        <div v-for="item in guideListData" :key="item.id">
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
        </div>
        <QuestionNotFound v-if="!tableLoading && guideListData.length < 1" />
      </el-col>

    </el-row>


    <!-- 没有数据 -->
    <QuestionNotFound v-if="!isLoading && guideTypeData.length < 2" />
    
    <!-- <div class="tit">专题学习<div v-if="route.query.title"> - {{route.query.title}}</div></div>
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

    </el-row> -->

  </div>
</template>

<script setup name="special">

import { getLearnCatalogueList, getLearnMaterialsList } from '@/api'

import QuestionNotFound from '@/components/questionNotFound/index'

const route = useRoute()
const router = useRouter()

const { proxy } = getCurrentInstance()

let isLoading = ref(false)

let learnId = ref('')

// 获取专题学习目录
const guideTypeData = ref([
  { id: "", title: '全部',  }
])
function getLearnCatalogueListFunc() {
  isLoading.value = true
  getLearnCatalogueList()
    .then(res => {
      console.log('getLearnCatalogueList: ', res);
      isLoading.value = false
      if (res.code === 200) res.rows.forEach(item => guideTypeData.value.push(item))
    }, err => isLoading.value = false )
}
getLearnCatalogueListFunc()

// 更改章节id
const changelearnId = item => {
  learnId.value = item.id
  getLearnMaterialsListFunc()
}


let tableLoading = ref(false)
// 获取专题学习资料
const guideListData = reactive([])
function getLearnMaterialsListFunc() {
  guideListData.length = 0
  tableLoading.value = true
  getLearnMaterialsList({learnId: learnId.value})
    .then(res => {
      console.log('getLearnMaterialsList: ', res);
      tableLoading.value = false
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
        }, err => tableLoading.value = false )
      }
    }, err => isLoading.value = false )
}
getLearnMaterialsListFunc()

const goLink = item => router.push({ path: '/specialLearn/detail', query: { id: item.id } })


</script>

<style scoped lang="scss">

.container{
  padding: 40px 20px;
  background: #fff;
  min-height: 100vh;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 14px 0;
  padding: 10px 8px 10px 14px;
  min-height: 69px;
  color: #333;
  border: solid 1px #e1e1e1;
  border-radius: 8px;
  transition: all 0.3s;
  p{
    margin: 0;
    flex: 1;
  }
  .title{
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 15px;
    >p{
      flex: 1;
      text-align: left;
    }
  }
  .can-do{
    margin: 6px 0 0;
    color: #999;
    font-size: 13px;
  }
}
.item:hover{
  transition: all 0.3s;
  box-shadow: 0 3px 4px 2px #e1e1e1;
  cursor: pointer;
}
.active{
  color: var(--el-color-primary);
  box-shadow: 0 3px 4px 2px #e1e1e1;
  .can-do{
    color: var(--el-color-primary);
  }
}

.tit{
  position: relative;
  margin: 10px 0 16px;
  padding: 0 0 0 26px;
  font-size: 20px;
  text-align: left;
  >div{
    display: inline-block;
  }
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