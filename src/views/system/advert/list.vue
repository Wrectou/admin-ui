<template>
  <div class="container product-list">

    <!-- 控制栏 -->
    <el-form :model="articleListParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="22" class="control-left">
          <el-col :span="4">
            <el-form-item label="位置" prop="adSite">
              <el-select v-model="articleListParams.adSite">
                <el-option v-for="item in adSiteOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="adTimeStatus">
              <el-select v-model="articleListParams.adTimeStatus">
                <el-option v-for="item in trueFalseOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="keyword" class="search-input">
              <el-input v-model="articleListParams.keyword" placeholder="输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button icon="Search" type="primary" @click="searchAdverts">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="2" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addAdvert">添加</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="advertListData.items"
      style="width: 100%;"
    >
      <el-table-column label="名称" align="center" prop="adName"  />
      <el-table-column label="位置" align="center" prop="adSite">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.adSite, adSiteOptions)}}</template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="adTimeStatus">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.adTimeStatus, trueFalseOptions)}}</template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" />
      <el-table-column label="结束时间" align="center" prop="endTime" />

      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editAdvert(scope.row)">编辑</el-button>
          <el-button type="info" @click="deleteAdvertFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    
    <pagination @pagination="searchAdverts" v-show="advertListData.meta.total > 0" :total="advertListData.meta.total" v-model:page="articleListParams.page" v-model:limit="articleListParams.perPage" />

  </div>
</template>

<script setup name="advertList">

  import { getAdvertList, deleteAdvert } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const router = useRouter()
  const { proxy } = getCurrentInstance()

  let adSiteOptions = getEnumKeyArr('enumAdSite')
  let trueFalseOptions = [ { value: 1, label: '有效', }, { value: 2, label: '无效', } ]

  const articleListParams = reactive({
    page: 1,   // 当前页码
    perPage: 10,   // 每页数量
    adSite: '',   // 位置
    adTimeStatus: '',   // 广告状态
    keyword: '',   // 搜索
  })

  let isLoading = ref(false)

  const advertListData = reactive({
    meta: {
      currentPage: 0,
      total: 0,
      perPage: 0,
      lastPage: 0
    },
    items: []
  })

  function searchAdverts() {
    isLoading.value = true
    getAdvertList(articleListParams)
      .then(res => {
        console.log('getAdvertList: ',res);
        isLoading.value = false
        advertListData.meta = res.data.meta
        advertListData.items = res.data.items
      }, err => isLoading.value = false )
  }
  searchAdverts()

  const resetFormParams = () => {
    proxy.resetForm("queryRef")
    searchAdverts()
  }

  const editAdvert = row => {
    router.push({name: 'addAdvert', query: {id: row.id, isEdit: true }})
  }
  
  const deleteAdvertFunc = row => {
    proxy.$modal.confirm(`确认删除位于“${row.adSiteCn}”的广告${row.adName}吗？`)
      .then(() => {
        deleteAdvert(row.id)
          .then(res => {
            console.log('deleteAdvert: ', res);
            if (res.status) proxy.$modal.msgSuccess("删除成功")
            searchAdverts()
          })
      }, err => {})
  }

  const addAdvert = () => router.push({name: 'addAdvert'})

  const returnTargetOptionsLabel = (key, target) => target.filter(item => item.value === key)[0].label
  
</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
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

