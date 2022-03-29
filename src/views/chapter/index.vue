<template>
  <div class="container chapter">
    <el-row>

      <el-col :span="6" v-for="item in data" :key="item.name">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>{{item.name}}</span>
              <el-button class="button" :type="item.isStudy ? 'primary' : 'danger'" @click="goLink(item.url)">{{item.isStudy ? '继续答题' : '未开始'}}</el-button>
            </div>
          </template>
          <div class="card-cont">
            <el-rate v-model="item.rate" disabled show-score text-color="#ff9900" :score-template="item.rate+'星'" />
            <div class="num">{{item.studyChapter}} / {{item.allChapter}} 题</div>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script setup name="chapter">

import { getHomeData, getEnum } from '@/api'

const { proxy } = getCurrentInstance()

const router = useRouter()

const data = reactive([
  { name: '社会主义法制理念', isStudy: false, rate: 3, allChapter: 50, studyChapter: 0, url: 'answer' },
  { name: '刑法', isStudy: true, rate: 4, allChapter: 100, studyChapter: 4, url: 'answer' },
  { name: '办案行政案件程序', isStudy: false, rate: 2, allChapter: 60, studyChapter: 0, url: 'answer' },
  { name: '社会主义法制理念', isStudy: false, rate: 3, allChapter: 50, studyChapter: 0, url: 'answer' },
  { name: '刑法', isStudy: true, rate: 4, allChapter: 100, studyChapter: 4, url: 'answer' },
  { name: '办案行政案件程序', isStudy: false, rate: 2, allChapter: 60, studyChapter: 0, url: 'answer' },
])

const goLink = name => router.push({ name })


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
  .num{
    color: #A8ABB2;
  }
}
</style>