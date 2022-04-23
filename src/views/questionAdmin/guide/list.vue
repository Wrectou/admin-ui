<template>
  <div class="container product-list">

    <el-form 
      :model="sectionListParams" 
      ref="queryRef" 
      :inline="true"
    >
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="4">
            <el-form-item label="" prop="title" class="search-input">
              <el-input v-model="sectionListParams.title" placeholder="输入考试指南标题" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button icon="Search" type="primary" @click="searchSections">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addChapter">添加考试指南</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="productListData.items"
      style="width: 100%;"
    >
      <el-table-column label="考试指南标题" align="center" prop="title" />
      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editProduct(scope.row)">编辑</el-button>
          <el-button type="info" @click="deleteProductFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination @pagination="searchSections" v-show="productListData.total > 0" :total="productListData.total" v-model:page="sectionListParams.pageNum" v-model:limit="sectionListParams.pageSize" />

  </div>
</template>

<script setup name="questionAdminGuideList">

  import { getGuideList, deleteGuide } from "@/api"

  const router = useRouter()
  
  const { proxy } = getCurrentInstance()

  // 产品列表参数
  const sectionListParams = reactive({
    pageNum: 1,
    pageSize: 10,
    title: '',
  })
  
  let isLoading = ref(false)

  // 产品列表接口返回数据
  const productListData = reactive({
    total: 0,
    items: []
  })

  // 搜索产品
  function searchSections() {
    isLoading.value = true
    getGuideList(sectionListParams)
      .then(res => {
        console.log('getGuideList: ',res);
        isLoading.value = false
        productListData.total = res.total
        productListData.items = res.rows
      }, err => isLoading.value = false )
  }
  searchSections()

  // 重置搜索项
  const resetFormParams = () => {
    proxy.resetForm("queryRef")
    searchSections()
  }

  // 编辑
  const editProduct = row => {
    router.push({path: '/questionAdmin/guide/add', query: {id: row.id, isEdit: true }})
  }
  
  // 删除
  const deleteProductFunc = row => {
    proxy.$modal.confirm(`确认删除考试指南《${row.title}》吗？`)
      .then(() => {
        deleteGuide(row.id)
          .then(res => {
            console.log('deleteGuide: ', res);
            if (res.code === 200) proxy.$modal.msgSuccess("删除成功")
            searchSections()
          })
      }, err => {})
  }

  // 添加产品
  const addChapter = () => router.push({path: '/questionAdmin/guide/add'})

</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.control-bar{
  margin: 0 0 18px 0;
  .search-input{
    margin: 0;
  }
  .control-right{
    text-align: right;
  }
}
</style>

