<template>
  <div class="container home">

    <div class="tit">日常学习</div>
    <el-row>
      <el-col :span="3" class="menu-box" v-for="item in menuList" :key="item.name">
        <div class="menu" @click="goLink(item.linkName)">
          <img class="logo" :src="item.logo" />
          <p class="title"> {{item.name}} </p>
        </div>
      </el-col>
    </el-row>

    
    <div class="tit">考试相关</div>
    <el-row>
      <el-col :span="12" class="table-box" v-for="item in tableList" :key="item.name">
        <div class="table" @click="goLink(item.linkName)">
          <img class="logo" :src="item.logo" />
        </div>
      </el-col>
    </el-row>


    <div class="tit">专题学习</div>
    <el-row>
      <el-col :span="6" class="special-box" v-for="item in specialList" :key="item.name">
        <div class="special" @click="goLink(item.linkName)">
          <img class="logo" :src="item.logo" />
          <p class="title"> {{item.name}} </p>
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script setup name="Index">

import { getHomeData, getEnum } from '@/api'
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

const menuList = reactive([
  { name: '章节练习', linkName: 'chapter', logo: icon1, },
  { name: '题型练习', linkName: 'chapter', logo: icon2, },
  { name: '每日练习', linkName: 'chapter', logo: icon3, },
  { name: '历年真题', linkName: 'chapter', logo: icon4, },
  { name: '模拟考试', linkName: 'chapter', logo: icon5, },
  { name: '错题巩固', linkName: 'chapter', logo: icon6, },
  { name: '我的收藏', linkName: 'chapter', logo: icon7, },
  { name: '学习报告', linkName: 'chapter', logo: icon8, },
])

const tableList = reactive([
  { name: '考试指南', linkName: 'chapter', logo: table1, },
  { name: '我的考试', linkName: 'chapter', logo: table2, },
])

const specialList = reactive([
  { name: '2021年高级考试复习资料', linkName: 'chapter', logo: special, },
  { name: '民警办案实务', linkName: 'chapter', logo: special, },
  { name: '刑事案卷', linkName: 'chapter', logo: special, },
  { name: '行政法律文书', linkName: 'chapter', logo: special, },
  { name: '刑事案卷', linkName: 'chapter', logo: special, },
  { name: '行政法律文书', linkName: 'chapter', logo: special, },
  { name: '2021年高级考试复习资料', linkName: 'chapter', logo: special, },
  { name: '民警办案实务', linkName: 'chapter', logo: special, },
])


const getEnumFunc = () => {
  getEnum()
    .then(res => {
      console.log('getEnum: ',res);
      if (res.status) proxy.$cache.session.setJSON('Enum', res.data)
    })
}
getEnumFunc()

const goLink = name => router.push({ name })

function goTarget(url) {
  window.open(url, "__blank");
}

</script>

<style scoped lang="scss">

.home {
  padding: 40px;
  min-height: 100vh;
}

.menu-box{
  flex: 1;
  margin: 0 10px;
  padding: 0;
}
.menu{
  padding: 20px 0;
  height: 100%;
  background: #ffffff;
  text-align: center;
  transition: transform .3s;
  border-radius: 6px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, .04);
  .logo{
    width: 48px;
    height: 48px;
  }
  .title{
    margin: 6px 0 0;
    font-size: 18px;
  }
}
.menu:hover{
  transform: scale(1.1);
  transition: transform .3s;
  border: solid 1px #f4f4f4;
  cursor: pointer;
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
  font-size: 20px;
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
    .logo{
      width: 390px;
      height: 202px;
    }
    .title{
      padding: 0 0 0 10px;
    }
  }
}


</style>

