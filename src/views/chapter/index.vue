<template>
  <div class="container chapter">
    <el-row>

      <el-col :span="6" v-for="item in data" :key="item.name">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>{{item.name}}</span>
              <el-button class="button" :type="item.isStudy ? 'primary' : 'danger'" @click="goLink(item)">{{item.isStudy ? '继续答题' : '未开始'}}</el-button>
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
  { name: '社会主义法制理念', type: 1, isStudy: false, rate: 3, allChapter: 50, studyChapter: 0, url: 'chapterAnswer' },
  { name: '刑法', type: 2, isStudy: true, rate: 4, allChapter: 100, studyChapter: 4, url: 'chapterAnswer' },
  { name: '办案行政案件程序', type: 3, isStudy: false, rate: 2, allChapter: 60, studyChapter: 0, url: 'chapterAnswer' },
  { name: '人民警察使用警械和武器条例', type: 4, isStudy: false, rate: 3, allChapter: 50, studyChapter: 0, url: 'chapterAnswer' },
  { name: '宪法', type: 5, isStudy: true, rate: 4, allChapter: 100, studyChapter: 4, url: 'chapterAnswer' },
  { name: '办案刑事案件程序', type: 6, isStudy: false, rate: 2, allChapter: 60, studyChapter: 0, url: 'chapterAnswer' },
])

const goLink = item => router.push({ name: item.url, query: { type: item.type } })


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