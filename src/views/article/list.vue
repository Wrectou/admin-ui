<template>
  <div class="container product-list">

    <!-- 控制栏 -->
    <el-form :model="articleListParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="22" class="control-left">
          <el-col :span="3">
            <el-form-item label="归属" prop="articleAttr">
              <el-select v-model="articleListParams.articleAttr">
                <el-option v-for="item in articleAttrOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否头条" prop="isHeadline">
              <el-select v-model="articleListParams.isHeadline">
                <el-option v-for="item in trueFalseOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="是否推荐" prop="isRecommend">
              <el-select v-model="articleListParams.isRecommend">
                <el-option v-for="item in trueFalseOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="模板" prop="articleTemplate">
              <el-select v-model="articleListParams.articleTemplate">
                <el-option v-for="item in articleTemplateOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item class="time" label="时间" prop="startTime">
              <el-date-picker
                v-model="time"
                type="daterange"
                value-format="YYYY-MM-DD"
                range-separator="到"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="" prop="articleLabel" class="search-input">
              <el-input v-model="articleListParams.articleLabel" placeholder="输入文章标签" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button icon="Search" type="primary" @click="searchArticles">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="2" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addArticle">配置文章</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="productListData.items"
      style="width: 100%;"
    >
      <el-table-column label="摩渔文章ID" align="center" prop="articleMoyu"  />
      <el-table-column label="文章标题" align="center" prop="articleName" />
      <el-table-column label="模板" align="center" prop="articleTemplate">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.articleTemplate, articleTemplateOptions)}}</template>
      </el-table-column>
      <el-table-column label="标签" align="center" prop="articleLabel" />
      <el-table-column label="归属" align="center" prop="articleAttr">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.articleAttr, articleAttrOptions)}}</template>
      </el-table-column>
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.isRecommend, trueFalseOptions)}}</template>
      </el-table-column>
      <el-table-column label="是否头条" align="center" prop="isHeadline">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.isHeadline, trueFalseOptions)}}</template>
      </el-table-column>
      <el-table-column label="同步时间" align="center" prop="syncTime" />

      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editArticle(scope.row)">编辑</el-button>
          <el-button type="info" @click="deleteArticleFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    
    <pagination @pagination="searchArticles" v-show="productListData.meta.total > 0" :total="productListData.meta.total" v-model:page="articleListParams.page" v-model:limit="articleListParams.perPage" />

  </div>
</template>

<script setup name="articleList">

  import { getArticleList, deleteArticle } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const router = useRouter()
  const { proxy } = getCurrentInstance()

  let articleAttrOptions = getEnumKeyArr('enumArticleAttr')
  let articleTemplateOptions = getEnumKeyArr('enumArticleTemplate')
  let trueFalseOptions = [ { value: 1, label: '是', }, { value: 2, label: '否', } ]

  const articleListParams = reactive({
    page: 1,   // 当前页码
    perPage: 10,   // 每页数量
    operateCityId: '',    // 业务城市 ID
    articleAttr: '',    // 文章归属
    articleTemplate: '',    // 文章模板
    isRecommend: '',    // 是否推荐
    isHeadline: '',    // 是否头条
    startTime: '',    // 开始时间
    endTime: '',    // 结束时间
    articleLabel: '',    // 搜索
  })

  let time = ref('')

  watch(time, newVal => {
    articleListParams.startTime = newVal[0]
    articleListParams.endTime = newVal[1]
  })
  
  let isLoading = ref(false)

  const productListData = reactive({
    meta: {
      currentPage: 0,
      total: 0,
      perPage: 0,
      lastPage: 0
    },
    items: []
  })

  function searchArticles() {
    isLoading.value = true
    getArticleList(articleListParams)
      .then(res => {
        console.log('getArticleList: ',res);
        isLoading.value = false
        productListData.meta = res.data.meta
        productListData.items = res.data.items
      }, err => isLoading.value = false )
  }
  searchArticles()

  const resetFormParams = () => {
    proxy.resetForm("queryRef")
    searchArticles()
  }

  const editArticle = row => {
    router.push({name: 'addArticle', query: {id: row.id, isEdit: true }})
  }
  
  const deleteArticleFunc = row => {
    proxy.$modal.confirm(`确认删除文章${row.articleName}吗？`)
      .then(() => {
        deleteArticle(row.id)
          .then(res => {
            console.log('deleteArticle: ', res);
            if (res.status) proxy.$modal.msgSuccess("删除成功")
            searchArticles()
          })
      }, err => {})
  }

  const addArticle = () => router.push({name: 'syncList'})

  // const returnTargetOptionsLabel = (key, target) => target.filter(item => item.value === key)[0].label
  const returnTargetOptionsLabel = (key, target) => {
    let str = ''
    target.filter(item => {
      if (item.value === key) str = item.label
    })
    return str
  }
  
</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.time{
  width: 240px;
}

:deep(.el-form--inline) {
  .el-form-item{
    margin-right: 20px;
  }
} 

.control-bar{
  .search-input{
    margin: 0;
  }
  .control-right{
    text-align: right;
  }
}
</style>

