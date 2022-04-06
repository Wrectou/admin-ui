<template>
  <div class="container product-list">

    <!-- 控制栏 -->
    <el-form :model="areaListParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="5">
            <el-form-item label="业务城市" prop="operateCityId">
              <el-cascader
                v-model=defaultCityArr
                :props="cityCascaderProps"
                @change=cityChange
              />
            </el-form-item>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addCity">添加城市</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="areaListData.items"
      style="width: 100%;"
    >
      <el-table-column label="产品名称" align="center" prop="productName"  />
      <el-table-column label="贷款额度" align="center" prop="loanAmount" />
      <el-table-column label="贷款利率(%)" align="center" prop="loanRate" />
      <el-table-column label="贷款期限" align="center" prop="loanTerm" />
      <el-table-column label="办理速度" align="center" prop="processTime" />
      <el-table-column label="业务城市" align="center" prop="area" />
      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editProductCityFunc(scope.row)">编辑</el-button>
          <el-button type="info" @click="deleteProductCityFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination @pagination="getCitylistFunc" v-show="areaListData.meta.total > 0" :total="areaListData.meta.total" v-model:page="areaListParams.page" v-model:limit="areaListParams.perPage" />

  </div>
</template>

<script setup name="cityList">

  import { getChannelAreaList, getCitylist, deleteProductCity } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const route = useRoute()
  const router = useRouter()
  const { proxy } = getCurrentInstance()

  let isLoading = ref(false)
  
  let routeObj = ref({})
  if (route.query) routeObj.value = route.query
  

  // 业务城市相关
  const defaultCityArr = ref([])
  const cityCascaderProps = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
      const { code } = node.data
      if (!code && code !== 0) {
        let { data } = await getChannelAreaList(routeObj.value.channelId, {level: 1, code: 0})
        data.map(item => {
          item.label = item.name
          item.value = item.code
          item.leaf >= 1
        })
        resolve(data)
      } else if (code === 0) {
        let arr = []
        let { data } = await getChannelAreaList(routeObj.value.channelId, {level: 2, code: code})
        data.label = data.name
        data.value = data.code
        data.leaf = 1
        arr.push(data)
        resolve(arr)
      } else {
        let { data } = await getChannelAreaList(routeObj.value.channelId, {level: 2, code: code})
        data.map(item => {
          item.label = item.name
          item.value = item.code
          item.leaf = 1
        })
        resolve(data)
      }
    }
  }
  // 城市选择
  function cityChange(e) {
    console.log('cityChange: ',e);
    areaListParams.areaCode = e[1]
    getCitylistFunc()
  }

  // 城市列表参数
  const areaListParams = reactive({
    page: 1,   // 当前页码，默认 1
    perPage: 10,   // 每页数量，默认 10
    areaCode: '',    // 金融机构区域 Code
  })

  // 城市列表接口返回数据
  const areaListData = reactive({
    meta: {
      currentPage: 0,
      total: 0,
      perPage: 0,
      lastPage: 0
    },
    items: []
  })

  // 城市列表接口
  function getCitylistFunc() {
    isLoading.value = true
    getCitylist(routeObj.value.id, areaListParams)
      .then(res => {
        console.log('getCitylist: ',res);
        isLoading.value = false
        areaListData.meta = res.data.meta
        areaListData.items = res.data.items
      }, err => isLoading.value = false )
  }
  getCitylistFunc()

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

