<template>
  <div class="container chapter">
    
    <div class="radio-box">
      <el-radio-group v-model="qtype" @change="typeType">
        <el-radio-button :label="0">练习</el-radio-button>
        <el-radio-button :label="1">试题</el-radio-button>
      </el-radio-group>
    </div>

    <el-row>

      <el-col :span="6" v-for="item in favoritesQuestionSectionList.data" :key="item.id">
        <el-card shadow="hover" @click="goLink(item)">
          <div class="card-header">
            <p class="title">
              <p>{{item.title}}</p>
              <el-icon><arrow-right /></el-icon>
            </p>
            <p class="can-do gray">{{item.num}}题</p>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <QuestionNotFound v-if="!isLoading && favoritesQuestionSectionList.data.length < 1" />

    <div class="button-box">
      <el-button type="primary" v-if="favoritesQuestionSectionList.data.length > 0" @click="answerAll">练习全部错题</el-button>
    </div>

  </div>
</template>

<script setup name="myCollect">

import { getFavoritesQuestionSectionList } from '@/api'
import QuestionNotFound from '@/components/questionNotFound/index'

const { proxy } = getCurrentInstance()

const router = useRouter()

let isLoading = ref(false)

let qtype = ref(0)
const typeType = e => {
  qtype.value = e
  getFavoritesQuestionSectionListFunc()
}

const favoritesQuestionSectionList = reactive({
  data: []
})

// 获取错题目录
function getFavoritesQuestionSectionListFunc() {
  let params = {
    level: proxy.$cache.session.getJSON('level'),
    qtype: qtype.value,
    type: 1,
  }
  getFavoritesQuestionSectionList(params)
    .then(res => {
      console.log('getFavoritesQuestionSectionList: ', res);
      isLoading.value = false
      favoritesQuestionSectionList.data = res.data
    })
}
getFavoritesQuestionSectionListFunc()

const goLink = item => router.push({ name: 'myCollectAnswer', query: { id: item.id, qtype: qtype.value } })

const answerAll = () => router.push({ name: 'myCollectAnswer', query: { id: 0, all: 1, qtype: qtype.value } })

</script>

<style scoped lang="scss">

.container{
  padding: 40px;
  text-align: center;
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
  }
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
    align-items: center;
    width: 100%;
    >p{
      flex: 1;
      text-align: left;
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