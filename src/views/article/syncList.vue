<template>
  <div class="container product-list">

    <!-- 控制栏 -->
    <el-form :model="areaListParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addSync">添加新纪录</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="articleSyncListData.items"
      style="width: 100%;"
    >
      <el-table-column label="摩渔账号" align="center" prop="moyuId"  />
      <el-table-column label="对应城市" align="center" prop="area" />

      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <!-- <el-button type="primary" @click="editArticleSyncFunc(scope.row)">编辑</el-button> -->
          <el-button type="info" @click="deleteProductCityFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    
    <pagination @pagination="getArticleSyncListFunc" v-show="articleSyncListData.meta.total > 0" :total="articleSyncListData.meta.total" v-model:page="areaListParams.page" v-model:limit="areaListParams.perPage" />

  </div>
</template>

<script setup name="syncList">

  import { getArticleSyncList, deleteArticleSync } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const route = useRoute()
  const router = useRouter()
  const { proxy } = getCurrentInstance()

  let isLoading = ref(false)
  
  const areaListParams = reactive({
    page: 1,   // 当前页码，默认 1
    perPage: 10,   // 每页数量，默认 10
  })

  const articleSyncListData = reactive({
    meta: {
      currentPage: 0,
      total: 0,
      perPage: 0,
      lastPage: 0
    },
    items: []
  })

  function getArticleSyncListFunc() {
    isLoading.value = true
    getArticleSyncList(areaListParams)
      .then(res => {
        console.log('getArticleSyncList: ',res);
        isLoading.value = false
        articleSyncListData.meta = res.data.meta
        articleSyncListData.items = res.data.items
      }, err => isLoading.value = false )
  }
  getArticleSyncListFunc()

  const editArticleSyncFunc = row => {
    router.push({name: 'addSync', query: { isEdit: true, id: row.moyuId }})
  }
  
  const deleteProductCityFunc = row => {
    console.log(row);
    proxy.$modal.confirm(`确认删除摩渔账号${row.moyuId}吗？`)
      .then(() => {
        deleteArticleSync(row.id)
          .then(res => {
            console.log('deleteArticleSync: ', res);
            if (res.status) proxy.$modal.msgSuccess("删除成功")
            getArticleSyncListFunc()
          })
      }, err => {})
  }

  const addSync = () => router.push({name: 'addSync'})

</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.product-list {
  
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

