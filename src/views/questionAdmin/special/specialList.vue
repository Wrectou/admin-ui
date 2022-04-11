<template>
  <div class="container product-list">

    <el-form 
      :model="areaListParams" 
      ref="queryRef" 
      :inline="true"
    >
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="7">
            <el-form-item label="当前专题" prop="operateCityId"> <div>{{routeObj.title}}</div> </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="title" class="search-input">
              <el-input v-model="areaListParams.title" placeholder="输入专题内容标题" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button icon="Search" type="primary" @click="getCitylistFunc">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addQuestion">添加专题内容</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="areaListData.items"
      style="width: 100%;"
    >
      <el-table-column label="专题内容标题" align="center" prop="title"  />
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

<script setup name="questionAdminSpecialSpecialList">

  import { getLearnMaterialsList, deleteLearnMaterials } from "@/api"
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
    learnId: routeObj.value.id,
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
    getLearnMaterialsList(areaListParams)
      .then(res => {
        console.log('getLearnMaterialsList: ',res);
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
    router.push({name: 'questionAdminAddSpecialSpecial', query: { isEdit: true, id: routeObj.value.id, level: routeObj.value.level, practiceId: row.id, title: routeObj.value.title, }})
  }
  
  // 删除
  const deleteProductCityFunc = row => {
    console.log(row);
    proxy.$modal.confirm(`确认删除专题内容《${row.title}》吗？`)
      .then(() => {
        deleteLearnMaterials(row.id)
          .then(res => {
            console.log('deleteLearnMaterials: ', res);
            if (res.code === 200) proxy.$modal.msgSuccess("删除成功")
            getCitylistFunc()
          })
      }, err => {})
  }

  // 添加产城市
  const addQuestion = () => router.push({name: 'questionAdminAddSpecialSpecial', query: { id: routeObj.value.id, level: routeObj.value.level, title: routeObj.value.title, }})
  
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

