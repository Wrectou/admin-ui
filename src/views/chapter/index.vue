<template>
  <div class="container chapter">
    <el-row>
      <el-col :span="6" v-for="item in selflist.data" :key="item.id">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>{{item.title}}</span>
              <el-button plain class="button" :type="item.answerNum > 0 ? 'danger' : 'primary'" @click="goLink(item)">{{item.answerNum > 0 ? '继续答题' : '未开始'}}</el-button>
            </div>
          </template>
          <div class="card-cont">
            <el-rate v-model="item.difficulty" disabled text-color="#ff9900" />
            <div class="num">{{item.answerNum}} / {{item.quesionNum}} 题</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-skeleton v-if="isLoading" :rows="5" animated />
    <QuestionNotFound v-if="!isLoading && selflist.data.length < 1" />
  </div>
</template>

<script setup name="chapter">

import { getSelflist } from '@/api'
import QuestionNotFound from '@/components/questionNotFound/index'

const { proxy } = getCurrentInstance()

const router = useRouter()

let isLoading = ref(false)

const getSelflistFunc = () => {
  let params = {
    level: proxy.$cache.session.getJSON('level')
  }
  isLoading.value = true
  getSelflist(params)
    .then(res => {
      console.log('getSelflist: ',res);
      isLoading.value = false
      selflist.data = res.rows
    }, err => isLoading.value = false )
}
getSelflistFunc()

const selflist = reactive({
  data: []
})

const goLink = item => router.push({ path: '/chapter/answer', query: { id: item.id, title: item.title } })

</script>

<style scoped lang="scss">

.container{
  padding: 20px;
}

.box-card {
  margin: 10px;
  box-shadow: 0 2px 8px 0 rgb(0 0 0 / 4%);
  ::v-deep(.el-card__header){
    padding: 10px 10px 8px !important;
    .el-button{
      padding: 6px 8px;
    }
  }
  ::v-deep(.el-card__body){
    padding: 10px 10px 8px !important;
  }
  .card-header,
  .card-cont {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .card-header{
    span{
      margin: 0 6px 0 0;
      text-align: left;
    }
  }
  .num{
    color: #A8ABB2;
  }
}
</style>