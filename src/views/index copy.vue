<template>
  <div class="container home">

    <div class="tit">考试类型</div>
    <div class="level-box">
      <el-radio-group v-model="level" @change="levelChange">
        <el-radio :label="0">基本级执法资格考试</el-radio>
        <el-radio :label="1">高级执法资格考试</el-radio>
      </el-radio-group>
    </div>


    <div class="tit">日常学习</div>
    <el-row class="menu-row">
      <el-col :span="3" class="menu-box" v-for="item in menuList" :key="item.name">
        <div class="menu" @click="goLink(item.linkName)">
          <img class="logo" :src="item.logo" />
          <p class="title"> {{item.name}} </p>
        </div>
      </el-col>
    </el-row>

    
    <div class="tit">我的考试</div>
    <el-row>
      <el-card class="test-box-card" shadow="never">
        <div class="text" v-for="item in epaperList.data" :key="item.id">
          <div class="title" @click="goTestLink(item)">{{ item.name }}<el-icon><arrow-right /></el-icon></div>
        </div>
      </el-card>
    </el-row>


    <div class="tit">专题学习</div>
    <el-row>
      <el-col :span="6" class="special-box" v-for="item in specialList.data" :key="item.name">
        <!-- <div class="special"> -->
        <div class="special" @click="goSpecial(item)">
          <img class="logo" :src="item.picture" />
          <p class="title"> {{item.title}} </p>
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script setup name="Index">

import { getLearnCatalogueList, getEpaperList } from '@/api'
import { useRouter } from 'vue-router'

import icon1 from '@/assets/images/index/1.png'
import icon2 from '@/assets/images/index/2.png'
import icon3 from '@/assets/images/index/3.png'
import icon4 from '@/assets/images/index/4.png'
import icon5 from '@/assets/images/index/5.png'
import icon6 from '@/assets/images/index/6.png'
import icon7 from '@/assets/images/index/7.png'
import icon8 from '@/assets/images/index/8.png'

import table1 from '@/assets/images/index/table1.png'
import table2 from '@/assets/images/index/table2.png'

import special from '@/assets/images/index/special.png'

const router = useRouter()

const { proxy } = getCurrentInstance()

let level = ref('')
if (proxy.$cache.session.getJSON('level')) level.value = proxy.$cache.session.getJSON('level')
else {
  level.value = 0
  proxy.$cache.session.setJSON('level', level.value)
}

const levelChange = e => {
  level.value = e
  proxy.$cache.session.setJSON('level', level.value)
}


const menuList = reactive([
  { name: '章节练习', linkName: 'chapter', logo: icon1, },
  // { name: '题型练习', linkName: 'questionType', logo: icon2, },
  { name: '每日练习', linkName: 'today', logo: icon3, },
  { name: '历年真题', linkName: 'realQuestion', logo: icon4, },
  { name: '模拟考试', linkName: 'imitateQuestion', logo: icon5, },
  { name: '错题巩固', linkName: 'errorQuestion', logo: icon6, },
  { name: '我的收藏', linkName: 'myCollect', logo: icon7, },
  { name: '考试指南', linkName: 'guide', logo: icon8, },
  // { name: '学习报告', linkName: 'chapter', logo: icon8, },
])

// const tableList = reactive([
//   { name: '考试指南', linkName: 'guide', logo: table1, },
//   { name: '我的考试', linkName: 'chapter', logo: table2, },
// ])

const specialList = reactive({
  data: []
})
  // [
  //   { name: '2021年高级考试复习资料', linkName: 'chapter', logo: special, },
  //   { name: '民警办案实务', linkName: 'chapter', logo: special, },
  //   { name: '刑事案卷', linkName: 'chapter', logo: special, },
  //   { name: '行政法律文书', linkName: 'chapter', logo: special, },
  //   { name: '刑事案卷', linkName: 'chapter', logo: special, },
  //   { name: '行政法律文书', linkName: 'chapter', logo: special, },
  //   { name: '2021年高级考试复习资料', linkName: 'chapter', logo: special, },
  //   { name: '民警办案实务', linkName: 'chapter', logo: special, },
  // ]


function getLearnCatalogueListFunc() {
  getLearnCatalogueList()
    .then(res => {
      console.log('getLearnCatalogueList: ', res);
      specialList.data = res.rows
    })
}
getLearnCatalogueListFunc()

function goSpecial(item) {
  router.push({ name: 'special', query: {id: item.id} })
}

const goLink = name => router.push({ name })

// 我的考试  模拟假数据
let isLoading = ref(false)
const epaperList = reactive({
  data: []
})
function getEpaperListFunc() {
  let params = {
    etype: 0,
    level: proxy.$cache.session.getJSON('level'),
  }
  isLoading.value = true
  getEpaperList(params)
    .then(res => {
      console.log('getEpaperList: ', res);
      isLoading.value = false
      epaperList.data = res.rows
    }, err => isLoading.value = false )
}
getEpaperListFunc()
const goTestLink = item => router.push({ name: 'realQuestionDetail', query: { id: item.id } })

</script>

<style scoped lang="scss">

.home {
  padding: 20px 40px;
  min-height: 100vh;
}

.level-box{
  padding: 0 10px;
}

.menu-row{
  height: 120px;
}
.menu-box{
  height: 120px;
  flex: 1;
  margin: 0 10px;
  padding: 0;
  .menu{
    padding: 20px 0;
    height: 100%;
    background: #ffffff;
    text-align: center;
    border-radius: 6px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, .04);
    transition: transform .3s;
    transition: transform .3s ease-in-out;
    .logo{
      width: 48px;
      height: 48px;
    }
    .title{
      margin: 6px 0 0;
      font-size: 17px;
    }
  }
  .menu:hover{
    color: #409EFF;
    transform: scale(1.1);
    transition: transform .3s ease-in-out;
    border: solid 1px #f4f4f4;
    cursor: pointer;
  }
}

.table-box{
  flex: 1;
  .table{
    background: #fff;
    margin: 0 10px;
    padding: 20px 0;
    text-align: center;
    border-radius: 8px;
    cursor: pointer;
  }
}

.tit{
  position: relative;
  margin: 30px 0 20px;
  padding: 0 0 0 20px;
  font-size: 19px;
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

.special-box{
  .special{
    margin: 0 10px 20px;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, .04);
    transition: transform .3s;
    transition: transform .3s ease-in-out;
    .logo{
      width: 390px;
      height: 202px;
    }
    .title{
      padding: 0 0 0 10px;
    }
  }
  .special:hover{
    color: #409EFF;
    transform: scale(1.03);
    transition: transform .3s ease-in-out;
    border: solid 1px #f4f4f4;
    cursor: pointer;
  }
}

.test-box-card {
  margin: 0 10px;
  width: 100vw;
  border: none;
  .el-card__body{
    padding: 10px 12px !important;
  }
  .title{
    display: flex;
    align-items: center;
    line-height: 40px;
    cursor: pointer;
    border-bottom: dashed 1px #e1e1e1;
    .el-icon{
      margin: 0 0 0 10px;
    }
  }
  .title:hover{
    color: #409EFF;
  }
}


</style>

