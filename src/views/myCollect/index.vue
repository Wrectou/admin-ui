<template>
  <div class="container chapter">
    
    <el-row>

      <!--  左边 -->
      <el-col :span="5" style="margin: 26px 0 0;">
        <div 
          :class="['item', practiceId === item.id ? 'active' : '']" 
          v-for="item in favoritesSectionList" 
          :key="item.id" 
          @click="goLink(item)"
        >
          <p class="title">
            <p>{{item.title}}</p>
            <el-icon><arrow-right /></el-icon>
          </p>
          <span class="can-do" v-if="item.num">{{item.num}}题</span>
        </div>
      </el-col>
      <!-- 右边 -->
      <el-col :span="19">
        <!-- 列表搜索项 -->
        <el-form :model="favoritesQuestionListParams" ref="queryRef" :inline="true">
          <el-row class="control-bar">
            <el-col :span="4" class="control-left">
            </el-col>
            <el-col :span="20" class="control-right">
              <el-col :span="24">
                <el-form-item label="" prop="title" class="search-input">
                  <el-input v-model="favoritesQuestionListParams.title" placeholder="输入标题名称" />
                </el-form-item>
                <el-button icon="Search" type="primary" @click="getFavoritesQuestionListFunc">搜索</el-button>
                <el-button icon="Refresh" @click="resetListParams">重置</el-button>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
        <div class="table-box">
          <!-- 表格 -->
          <el-table v-loading="isLoading" :data="favoritesQuestionList.list" style="width: 100%;">
            <el-table-column label="标题" align="center" prop="title" min-width="220" />
            <el-table-column label="章节" align="center" prop="sectionName" />
            <el-table-column label="熟悉程度" align="center" prop="score" />
            <el-table-column label="时间" align="center" prop="createTime" />
            <el-table-column label="操作" align="center" width="90">
              <template #default="scope">
                <el-button plain type="primary" @click="editTest(scope.row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页器 -->
          <pagination @pagination="getFavoritesQuestionListFunc" v-show="favoritesQuestionList.total > 0" :total="favoritesQuestionList.total" v-model:page="favoritesQuestionListParams.pageNum" v-model:limit="favoritesQuestionListParams.pageSize" />
        </div>
      </el-col>

    </el-row>

    <!-- 没有数据 -->
    <QuestionNotFound v-if="!isLoading && favoritesSectionList < 2" />

  </div>
</template>

<script setup name="myCollect">

import { getFavoritesQuestionSectionList, getFavoritesQuestionList } from '@/api'
import QuestionNotFound from '@/components/questionNotFound/index'

const { proxy } = getCurrentInstance()

const router = useRouter()

let isLoading = ref(false)

// 获取收藏题目的id 默认空取所有
let practiceId = ref('')

// 收藏目录数据
let favoritesSectionList = ref([
  { id: "", title: '全部',  }
])
// 获取收藏目录
function getFavoritesQuestionSectionListFunc() {
  let params = {
    level: proxy.$cache.session.getJSON('level'),
    type: 1,
  }
  isLoading.value = true
  getFavoritesQuestionSectionList(params)
    .then(res => {
      console.log('getFavoritesQuestionSectionList: ', res);
      isLoading.value = false
      if (res.code === 200) {
        res.data.forEach(item => favoritesSectionList.value.push(item))
      }
    }, err => isLoading.value = false )
}
getFavoritesQuestionSectionListFunc()


// 收藏目录数据
let favoritesQuestionList = reactive({
  total: 0,
  list: []
})
// 获取收藏题目
let favoritesQuestionListParams = reactive({
  pageNum: 1,
  pageSize: 10,
  level: proxy.$cache.session.getJSON('level'),
  type: 1,
  practiceId: '',
  title: '',
})
function getFavoritesQuestionListFunc() {
  getFavoritesQuestionList(favoritesQuestionListParams)
    .then(res => {
      console.log('getFavoritesQuestionList: ', res);
      if (res.code === 200) {
        favoritesQuestionList.total = res.total
        favoritesQuestionList.list = res.rows
        console.log(favoritesQuestionList.list);
      }
    })
}
getFavoritesQuestionListFunc()


const goLink = item => {
  practiceId.value = item.id
  favoritesQuestionListParams.practiceId = item.id
  getFavoritesQuestionListFunc()
}

 // 重置搜索项
const resetListParams = () => {
  proxy.resetForm("queryRef")
  getFavoritesQuestionListFunc()
}


</script>

<style scoped lang="scss">

.container{
  padding: 40px 20px;
  min-height: 100vh;
  background: #fff;
}

.item {
  display: flex;
  flex-direction: column;
  align-items: start;
  margin: 14px 10px;
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
  box-shadow: 0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017;
  background: #fff;
  cursor: pointer;
}
.active{
  color: var(--el-color-primary);
  background: #fff;
}

.control-bar{
  .search-input{
    margin: 0;
  }
  .control-right{
    display: flex;
    text-align: right;
  }
}

.table-box{
  // background: #fff;
  margin: 10px 0 0;
  padding: 0 0 10px;
  border: solid 1px #e1e1e1;
  ::v-deep(.el-table) {
    background: transparent;
    tr{
      background: transparent;
    }
  }
  ::v-deep(.pagination-container){
    background: transparent;
  }
}

</style>