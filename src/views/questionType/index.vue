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
            <div class="num">{{item.studyChapter}} / {{item.allChapter}} 题</div>
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script setup name="questionType">

// import { } from '@/api'

const { proxy } = getCurrentInstance()

const router = useRouter()

const data = reactive([
  { name: '全部题型', type: 0, isStudy: false, allChapter: 50, studyChapter: 0, url: 'questionTypeAnswer' },
  { name: '单项选择题型', type: 1, isStudy: false, allChapter: 50, studyChapter: 0, url: 'questionTypeAnswer' },
  { name: '多项选择题型', type: 2, isStudy: true, allChapter: 100, studyChapter: 4, url: 'questionTypeAnswer' },
  { name: '判断题型', type: 3, isStudy: false, allChapter: 60, studyChapter: 0, url: 'questionTypeAnswer' },
  { name: '论述题型', type: 4, isStudy: false, allChapter: 60, studyChapter: 0, url: 'questionTypeAnswer' },
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