<template>
  <div class="container product-list">

    <!-- 控制栏 -->
    <el-form :model="bannerListParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="22" class="control-left">
          <el-col :span="4">
            <el-form-item label="状态" prop="bannerTimeStatus">
              <el-select v-model="bannerListParams.bannerTimeStatus">
                <el-option v-for="item in trueFalseOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="keyword" class="search-input">
              <el-input v-model="bannerListParams.keyword" placeholder="输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button icon="Search" type="primary" @click="searchBanners">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="2" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addBanner">添加</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="bannerListData.items"
      style="width: 100%;"
    >
      <el-table-column label="名称" align="center" prop="bannerName"  />
      <el-table-column label="顺序" align="center" prop="showPriority" />
      <el-table-column label="状态" align="center" prop="bannerTimeStatus">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.bannerTimeStatus, trueFalseOptions)}}</template>
      </el-table-column>
      <el-table-column label="开始时间" align="center" prop="startTime" />
      <el-table-column label="结束时间" align="center" prop="endTime" />
      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editBanner(scope.row)">编辑</el-button>
          <el-button type="info" @click="deleteBannerFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    
    <pagination @pagination="searchBanners" v-show="bannerListData.meta.total > 0" :total="bannerListData.meta.total" v-model:page="bannerListParams.page" v-model:limit="bannerListParams.perPage" />

  </div>
</template>

<script setup name="bannerList">

  import { getBannerList, deleteBanner } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const router = useRouter()
  const { proxy } = getCurrentInstance()

  let trueFalseOptions = [ { value: 1, label: '有效', }, { value: 2, label: '无效', } ]

  const bannerListParams = reactive({
    page: 1,   // 当前页码
    perPage: 10,   // 每页数量
    bannerTimeStatus: '',   // 轮播状态
    keyword: '',   // 搜索
  })

  let isLoading = ref(false)

  const bannerListData = reactive({
    meta: {
      currentPage: 0,
      total: 0,
      perPage: 0,
      lastPage: 0
    },
    items: []
  })

  function searchBanners() {
    isLoading.value = true
    getBannerList(bannerListParams)
      .then(res => {
        console.log('getBannerList: ',res);
        isLoading.value = false
        bannerListData.meta = res.data.meta
        bannerListData.items = res.data.items
      }, err => isLoading.value = false )
  }
  searchBanners()

  const resetFormParams = () => {
    proxy.resetForm("queryRef")
    searchBanners()
  }

  const editBanner = row => {
    router.push({name: 'addBanner', query: {id: row.id, isEdit: true }})
  }
  
  const deleteBannerFunc = row => {
    proxy.$modal.confirm(`确认删除顺序“${row.showPriority}”的轮播${row.bannerName}吗？`)
      .then(() => {
        deleteBanner(row.id)
          .then(res => {
            console.log('deleteBanner: ', res);
            if (res.status) proxy.$modal.msgSuccess("删除成功")
            searchBanners()
          })
      }, err => {})
  }

  const addBanner = () => router.push({name: 'addBanner'})

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

