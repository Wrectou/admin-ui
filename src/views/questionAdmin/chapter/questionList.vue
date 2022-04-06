<template>
  <div class="container product-list">

    <el-form 
      :model="areaListParams" 
      ref="queryRef" 
      :inline="true"
    >
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="5">
            <el-form-item label="当前章节" prop="operateCityId"> <div>{{routeObj.title}}</div> </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="title" class="search-input">
              <el-input v-model="areaListParams.title" placeholder="输入题目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button icon="Search" type="primary" @click="getCitylistFunc">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addCity">添加题目</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="areaListData.items"
      style="width: 100%;"
    >
      <el-table-column label="标题" align="center" prop="title"  />
      <el-table-column label="分数" align="center" prop="score" />
      <el-table-column label="类型" align="center" prop="type" />
      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editProductCityFunc(scope.row)">编辑</el-button>
          <el-button type="info" @click="deleteProductCityFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination @pagination="getCitylistFunc" v-show="areaListData.total > 0" :total="areaListData.total" v-model:page="areaListParams.pageNum" v-model:limit="areaListParams.pageSize" />

  </div>
</template>

<script setup name="questionAdminChapterQuestionList">

  import { getChannelAreaList, getQuestionList, deleteProductCity } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const route = useRoute()
  const router = useRouter()
  const { proxy } = getCurrentInstance()

  let isLoading = ref(false)
  
  let routeObj = ref({})
  if (route.query) routeObj.value = route.query
  
  // 城市列表参数
  const areaListParams = reactive({
    pageNum: 1, 
    pageSize: 10, 
    level: proxy.$cache.session.getJSON('level'),
    practiceId: routeObj.value.id,
    qtype: 0,
    title: ''
  })

  // 城市列表接口返回数据
  const areaListData = reactive({
    total: 0,
    items: []
  })

  // 城市列表接口
  function getCitylistFunc() {
    isLoading.value = true
    getQuestionList(areaListParams)
      .then(res => {
        console.log('getQuestionList: ',res);
        isLoading.value = false
        areaListData.total = res.total
        areaListData.items = res.rows
      }, err => isLoading.value = false )
  }
  getCitylistFunc()

  const resetFormParams = () => {
    proxy.resetForm("queryRef")
    getCitylistFunc()
  }

  // 编辑
  const editProductCityFunc = row => {
    router.push({name: 'addCity', query: { isEdit: true, id: routeObj.value.id, productCityId: row.id, productName: row.productName, channelId: routeObj.value.channelId }})
  }
  
  // 删除
  const deleteProductCityFunc = row => {
    console.log(row);
    proxy.$modal.confirm(`确认删除产品${row.productName}配置城市${row.area}吗？`)
      .then(() => {
        deleteProductCity(row.id)
          .then(res => {
            console.log('deleteProductCity: ', res);
            if (res.status) proxy.$modal.msgSuccess("删除成功")
            getCitylistFunc()
          })
      }, err => {})
  }

  // 添加产城市
  const addCity = () => router.push({name: 'addCity', query: { id: routeObj.value.id, productName: routeObj.value.productName, channelId: routeObj.value.channelId }})

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

