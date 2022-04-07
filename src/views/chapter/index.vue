<template>
  <div class="container chapter">
    <el-row>
      <el-col :span="6" v-for="item in selflist.data" :key="item.id">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>{{item.title}}</span>
              <el-button class="button" :type="item.answerNum > 0 ? 'danger' : 'primary'" @click="goLink(item)">{{item.answerNum > 0 ? '继续答题' : '未开始'}}</el-button>
            </div>
          </template>
          <div class="card-cont">
            <el-rate v-model="item.difficulty" disabled show-score text-color="#ff9900" :score-template="item.difficulty+'星'" />
            <div class="num">{{item.answerNum}} / {{item.quesionNum}} 题</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
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

// const data = reactive([
//   { name: '社会主义法制理念', type: 1, isStudy: false, difficulty: 3, quesionNum: 50, answerNum: 0, url: 'chapterAnswer' },
//   { name: '刑法', type: 2, isStudy: true, difficulty: 4, quesionNum: 100, answerNum: 4, url: 'chapterAnswer' },
//   { name: '办案行政案件程序', type: 3, isStudy: false, difficulty: 2, quesionNum: 60, answerNum: 0, url: 'chapterAnswer' },
//   { name: '人民警察使用警械和武器条例', type: 4, isStudy: false, difficulty: 3, quesionNum: 50, answerNum: 0, url: 'chapterAnswer' },
//   { name: '宪法', type: 5, isStudy: true, difficulty: 4, quesionNum: 100, answerNum: 4, url: 'chapterAnswer' },
//   { name: '办案刑事案件程序', type: 6, isStudy: false, difficulty: 2, quesionNum: 60, answerNum: 0, url: 'chapterAnswer' },
// ])

const goLink = item => router.push({ name: 'chapterAnswer', query: { id: item.id, title: item.title } })

</script>

<style scoped lang="scss">

.container{
  padding: 40px;
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