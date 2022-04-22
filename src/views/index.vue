<template>
  <div class="container home">
    <el-row :gutter="20">
      <!-- 左边 -->
      <el-col :span="16">
        <!-- 日常学习 -->
        <div class="content-box">
          <div class="title">日常学习</div>
          <el-row class="content menu-content">
            <el-col class="menu" :span="8" v-for="item in menuList" :key="item.name"  @click="goLink(item.linkName)">
              <img class="logo" :src="item.logo" />
              <div class="name">
                <div>{{item.name}}</div>
                <div class="tip">{{item.tip}}</div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 最新动态 -->
        <!-- <div class="content-box">
          <div class="title">最新动态</div>
          <el-row class="content test-dynamic-content">
            <el-col class="test" :span="24" v-for="item in epaperList.data" :key="item.id">
              <div class="title" @click="goTestLink(item)"><el-icon><bell /></el-icon>{{ item.name }}</div>
            </el-col>
            <el-col class="title" v-if="epaperList.data.length < 1">暂无数据</el-col>
          </el-row>
        </div> -->
        <!-- 专题学习 -->
        <div class="content-box">
          <div class="title">专题学习<span class="more" @click="goMoreSpecial">更多</span></div>


          <div class="content special-list">
            <div class="special" :span="24" v-for="item in newlist" :key="item.id" @click="goSpecial(item)">
              <div class="poster">
                <img :src="item.picture" alt="">
              </div>
              <div class="content">
                <div class="title">{{ item.title }}<span class="parent-name">（{{item.catalogueName}}）</span></div>
                <div class="time">{{item.createTime}}</div>
              </div>
            </div>
            <div class="special" v-if="newlist.length < 1">
              <div class="content">
                <div class="time">暂无数据</div>
              </div>
            </div>
          </div>
          
          <!-- <el-row class="content special-content">
            <el-col class="special" :span="8" v-for="item in specialList.data" :key="item.id"  @click="goSpecial(item)">
              <img class="logo" :src="item.picture" />
              <div class="name">{{item.title}}</div>
            </el-col>
          </el-row> -->
          
          <!-- <el-col :span="6" class="special-box" v-for="item in specialList.data" :key="item.name">
            <div class="special" @click="goSpecial(item)">
              <img class="logo" :src="item.picture" />
              <p class="title"> {{item.title}} </p>
            </div>
          </el-col> -->

        </div>
      </el-col>
      <!-- 右边 -->
      <el-col :span="8">

        <!-- 考试相关 -->
        <div class="content-box">
          <div class="title">考试相关</div>
          <el-row class="content test-content">
            <el-col class="test" :span="12" v-for="item in tableList" :key="item.name"  @click="goLink(item.linkName)">
              <img class="logo" :src="item.logo" />
              <!-- <div class="name">{{item.name}}</div> -->
            </el-col>
          </el-row>
        </div>

        <!-- 学习报告 -->
        <div class="content-box">
          <div class="title">学习报告</div>
          <el-tabs v-model="tabsActiveName" class="demo-tabs">
            <el-tab-pane label="今日" name="today">
              <div class="tab-item">
                <div class="item">
                  <div>答题量</div>
                  <!-- <span class="tip">超过0.01%的学员</span> -->
                </div>
                <div class="num">{{todayLearnGrade.allAnswerNum}}</div>
              </div>
              <div class="tab-item">
                <div class="item">
                  <div>学习时长</div>
                  <!-- <span class="tip">超过0.01%的学员</span> -->
                </div>
                <div class="num">{{todayLearnGrade.allTimes}}</div>
              </div>
              <div class="tab-item">
                <div class="item">
                  <div>正确率</div>
                  <!-- <span class="tip">超过0.01%的学员</span> -->
                </div>
                <div class="num">{{todayLearnGrade.allRate}}</div>
              </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="历史" name="all">
              <div class="tab-item">
                暂无统计数据
              </div>
            </el-tab-pane> -->
          </el-tabs>
        </div>

        <!-- 成绩统计 -->
        <div class="content-box">
          <div class="title">成绩统计</div>

          <div class="epaper-score-box">
            <div class="epaper" v-for="item in hisEpaperScoreList" :key="item.id">
              <h3 class="title">
                {{item.epaperName}}
                <div class="status success" v-if="item.passFlag === 1">合格</div>
                <div class="status danger" v-else>不合格</div>
              </h3>
              <div class="time">{{item.create_time}}</div>
              <div class="content">
                <div class="content-item">
                  <div class="value">{{item.score ? item.score : 0}}</div>
                  <div class="key">得分</div>
                </div>
                <div class="content-item">
                  <div class="value">{{(item.accuracy*100).toFixed()}}%</div>
                  <div class="key">正确率</div>
                </div>
                <div class="content-item">
                  <div class="value">{{item.answerNum ? item.answerNum : 0}}</div>
                  <div class="key">答题数量</div>
                </div>
                <div class="content-item">
                  <div class="value">{{timesToText(item.times)}}</div>
                  <div class="key">用时</div>
                </div>
              </div>
            </div>
            <div class="no-data" v-if="hisEpaperScoreList.length < 1">暂无数据</div>
          </div>
          
        </div>

      </el-col>
    </el-row>



    <!-- <div class="tit">考试类型</div>
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
        <div class="special" @click="goSpecial(item)">
          <img class="logo" :src="item.picture" />
          <p class="title"> {{item.title}} </p>
        </div>
      </el-col>
    </el-row> -->


  </div>
</template>

<script setup name="Index">

import { getLearnCatalogueList, getEpaperSelflist, getTodayLearnGrade, getNewlist, getHisEpaperScoreList } from '@/api'
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

let tabsActiveName = ref('today')
const handleClick = (tab, event) => {
  console.log(tab, event)
}

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
  { name: '章节练习', tip: '分不同章节进行练习', linkName: 'chapter', logo: icon1, },
  // { name: '题型练习', tip: '强化题型练习', linkName: 'questionType', logo: icon2, },
  { name: '每日练习', tip: '每日进行巩固练习', linkName: 'today', logo: icon3, },
  { name: '历年真题', tip: '历年真题题库', linkName: 'realQuestion', logo: icon4, },
  { name: '模拟考试', tip: '仿真考试练习', linkName: 'imitateQuestion', logo: icon5, },
  { name: '错题巩固', tip: '对错题进行专项练习', linkName: 'errorQuestion', logo: icon6, },
  { name: '我的收藏', tip: '收藏题目随时浏览', linkName: 'myCollect', logo: icon7, },
  // { name: '考试指南', tip: '', linkName: 'guide', logo: icon8, },
  // { name: '学习报告', tip: '', linkName: 'chapter', logo: icon8, },
])

const tableList = reactive([
  { name: '考试指南', linkName: 'guide', logo: table1, },
  { name: '我的考试', linkName: 'myTest', logo: table2, },
])

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
  router.push({ name: 'specialDetail', query: { id: item.id, title: item.title } })
}

const goLink = name => router.push({ name })

// 我的考试  模拟假数据
let isLoading = ref(false)
const epaperList = reactive({
  data: []
})
function getEpaperSelflistFunc() {
  let params = {
    etype: 2,
    level: proxy.$cache.session.getJSON('level'),
  }
  isLoading.value = true
  getEpaperSelflist(params)
    .then(res => {
      console.log('getEpaperSelflist: ', res);
      isLoading.value = false
      epaperList.data = res.rows
    }, err => isLoading.value = false )
}
getEpaperSelflistFunc()
const goTestLink = item => router.push({ name: 'myTest' })

// 获取最新5条专题学习资料
let newlist = ref([])
function getNewlistFunc() {
  getNewlist()
    .then(res => {
      console.log('getNewlist: ', res);
      if (res.code === 200) {
        newlist.value = res.data
      } 
    })
}
getNewlistFunc()

// 更多专题
const goMoreSpecial = () => router.push({ path: '/specialLearn/index' })


// 获取今日学习数据
let todayLearnGrade = reactive({
  allAnswerNum: 0,
  allTimes: 0,
  allRate: 0,
})
function getTodayLearnGradeFunc() {
  getTodayLearnGrade()
    .then(res => {
      console.log('getTodayLearnGrade: ', res);
      if (res.code == 200 && res.data.length > 0) {
        let allAnswerNum = 0
        let allCorrentNum = 0
        let allTimes = 0
        res.data.forEach(item => {
          allAnswerNum += item.answerNum
          allCorrentNum += item.correntNum
          allTimes += item.times
        })
        todayLearnGrade.allAnswerNum = allAnswerNum + '题'
        todayLearnGrade.allTimes = timesToText(allTimes)
        todayLearnGrade.allRate = (allCorrentNum/allAnswerNum*100).toFixed() + '%'
      }
    })
}
getTodayLearnGradeFunc()
// 秒转中文时分秒
function timesToText(second) {
  let lefttime = second*1000,
      lefth = Math.floor(lefttime/(1000*60*60)%24) < 10 ? '0' + Math.floor(lefttime/(1000*60*60)%24) : Math.floor(lefttime/(1000*60*60)%24),
      leftm = Math.floor(lefttime/(1000*60)%60) < 10 ? '0'+Math.floor(lefttime/(1000*60)%60) : Math.floor(lefttime/(1000*60)%60),
      lefts = Math.floor(lefttime/1000%60) < 10 ? '0'+Math.floor(lefttime/1000%60) : Math.floor(lefttime/1000%60);
      if (lefth !== '00') return lefth + "时" + leftm + "分" + lefts + "秒"
      else return leftm + "分" + lefts + "秒"
}


// 考试成绩统计（自己）
let hisEpaperScoreList = ref([])
function getHisEpaperScoreListFunc() {
  getHisEpaperScoreList()
    .then(res => {
      console.log('getHisEpaperScoreList: ', res);
      hisEpaperScoreList.value = res.data
    })
}
getHisEpaperScoreListFunc()

</script>

<style scoped lang="scss">

.home {
  padding: 20px;
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

*{
  box-sizing: border-box;
}
.content-box{
  margin: 0 0 16px;
  background: #fff;
  >.title{
    display: flex;
    align-items: end;
    justify-content: space-between;
    color: #222;
    padding: 16px 24px;
    font-weight: 500;
    font-size: 16px;
    border-bottom: 1px solid #f0f0f0;
    .more{
      font-size: 14px;
      color: #409EFF;
      cursor: pointer;
    }
  }
  .menu-content{
    .menu{
      display: flex;
      padding: 24px;
      border-right: 1px solid #f0f0f0;
      border-bottom: 1px solid #f0f0f0;
      transition: all .3s;
      .logo{
        flex: 0 0 48px;
        margin: 0 10px 0 0;
        width: 48px;
        height: 48px;
      }
      .name{
        >div{
          color: #444;
          margin: 2px 0 0;
        }
        .tip{
          margin: 4px 0 0;
          color: #777;
          font-size: 14px;
        }
      }
    }
    .menu:hover{
      cursor: pointer;
      transition: all .3s;
      box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
      .name{
        >div{
          color: #409EFF;
        }
      }
    }
    .menu:nth-child(3n){
      border-right: none;
    }
  }
}

.test-dynamic-content{
  .test {
    border-bottom: 1px solid #f0f0f0;
  }
  .test:last-child{
    border-bottom: none;
  }
  .title{
    display: flex;
    align-items: center;
    padding: 8px 20px;
    line-height: 36px;
    font-size: 15px;
    color: #555;
    cursor: pointer;
    .el-icon{
      margin: 0 10px 0 0;
    }
  }
  .title:hover{
    color: #409EFF;
  }
}



.special-list{
  .special {
    display: flex;
    padding: 8px 25px;
    border-bottom: 1px solid #f0f0f0;
    .poster{
      margin: 0 14px 0 0;
      img {
        width: 140px;
        height: 80px;
      }
    }
    .content{
      .title{
        margin: 4px 0 0;
        line-height: 24px;
        font-size: 16px;
        color: #555;
        .parent-name{
          font-size: 13px;
          color: #777;
        }
      }
      .time{
        margin: 4px 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .special:last-child{
    border-bottom: none;
  }
  .special:hover{
    cursor: pointer;
    .title{
      color: #409EFF;
      .parent-name{
        color: #409EFF;
      }
    }
    .time{
      color: #409EFF;
    }
  }
}


.special-content{
  .special{
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
    border-right: 1px solid #f0f0f0;
    border-bottom: 1px solid #f0f0f0;
    transition: all .3s;
    .logo{
      flex: 0 0 100px;
      margin: 0 10px 0 0;
      width: 220px;
      height: 110px;
      border-radius: 8px;
    }
    .name{
      margin: 10px 0 0;
      color: #444;
    }
  }
  .special:hover{
    cursor: pointer;
    transition: all .3s;
    box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
    .name{
      color: #409EFF;
    }
  }
  .special:nth-child(3n){
    border-right: none;
  }
}

.test-content{
  .test{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    .logo{
      width: 100%;
      max-width: 200px;
      height: 90px;
    }
    .name{
      margin: 4px 0 0;
      color: #444;
      font-size: 14px;
    }
  }
}

.demo-tabs{
  padding: 12px 24px;
  ::v-deep(.el-tabs__header){
    margin: 0 0 10px;
  }
  .tab-item{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    margin: 8px 0 0;
    .item{
      >div{
        font-size: 15px;
        color: #444;
      }
      .tip{
        font-size: 13px;
        color: #777;
      }
    }
    .num{
      font-size: 16px;
      color: #409EFF;
    }
  }
}


.epaper-score-box{
  .epaper{
    margin: 6px 0;
    padding: 8px 25px;
    border-bottom: solid 1px #e1e1e1;
    .title{
      display: flex;
      margin: 0;
      font-size: 16px;
      color: #444;
      .status{
        margin: 0 0 0 10px;
        padding: 2px 6px;
        font-size: 12px;
        color: #777;
        background: #f1f1f1;
        border: solid 1px #e1e1e1;
        border-radius: 6px;
        line-height: 1;
      }
      .success{
        color: #fff;
        background: var(--el-color-success);
        border: solid 1px var(--el-color-success);
      }
      .danger{
        color: #fff;
        background: var(--el-color-danger);
        border: solid 1px var(--el-color-danger);
      }
    }
    .time{
      margin: 6px 0;
      font-size: 13px;
      color: #999;
    }
    .content{
      margin: 10px 0 0;
      padding: 4px 10px;
      display: flex;
      justify-content: space-between;
      font-size: 15px;
      color: #555;
      .content-item{
        text-align: center;
        .key{
          margin: 4px 0 0;
          font-size: 13px;
        }
        .value{
          color: var(--el-color-primary);
          font-size: 15px;
        }
      }
    }
  }
  .epaper:last-child{
    border: none;
  }
  .no-data{
    margin: 6px 0;
    padding: 8px 25px;
    font-size: 12px;
    color: #999;
  }
}

</style>

