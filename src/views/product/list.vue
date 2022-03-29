<template>
  <div class="container product-list">

    <!-- 控制栏 -->
    <el-form :model="productListParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="5">
            <el-form-item label="业务城市" prop="operateCityId">
              <el-select v-model="productListParams.operateCityId">
                <el-option v-for="item in operateCityIdOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="产品分类" prop="productType">
              <el-select v-model="productListParams.productType">
                <el-option v-for="item in productTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="线上签约" prop="supportOnline">
              <el-select v-model="productListParams.supportOnline">
                <el-option v-for="item in supportOnlineOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="已设优先级">
              <el-checkbox label=""  v-model="hasPriority" name="type" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="keyword" class="search-input">
              <el-input v-model="productListParams.keyword" placeholder="输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button icon="Search" type="primary" @click="searchProducts">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addProduct">添加贷款产品</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="productListData.items"
      style="width: 100%;"
    >
      <el-table-column label="产品名称" align="center" prop="productName"  />
      <el-table-column label="出品方" align="center" prop="channelName" />
      <el-table-column label="产品分类" align="center" prop="productType">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.productType, productTypeOptions)}}</template>
      </el-table-column>
      <el-table-column label="支持线上签约" align="center" prop="supportOnline">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.supportOnline, supportOnlineOptions)}}</template>
      </el-table-column>
      <el-table-column label="优先级" align="center" prop="showPriority" />
      <el-table-column label="业务城市" align="center" prop="areas" />
      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editProduct(scope.row)">编辑</el-button>
          <el-button type="danger" @click="setProductCity(scope.row)">城市配置</el-button>
          <el-button type="info" @click="deleteProductFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination @pagination="searchProducts" v-show="productListData.meta.total > 0" :total="productListData.meta.total" v-model:page="productListParams.page" v-model:limit="productListParams.perPage" />

  </div>
</template>

<script setup name="productList">

  import { getAreaList, getProductList, deleteProduct } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const router = useRouter()
  const { proxy } = getCurrentInstance()


  // 业务城市可选数据
  let operateCityIdOptions = ref([])
  function getAreaListFunc() {
    getAreaList()
      .then(res => {
        console.log('getAreaList: ', res);
        if (res.status) {
          res.data.map(item => {
            item.value = item.code
            item.label = item.name
          })
          operateCityIdOptions.value = res.data
        }
      })
  }
  getAreaListFunc()

  // 产品分类可选数据
  let productTypeOptions = getEnumKeyArr('enumProductType')
  
  // 线上签约可选数据
  let supportOnlineOptions = [ { value: 1, label: '是', }, { value: 2, label: '否', } ]

  // 产品列表参数
  const productListParams = reactive({
    page: 1,   // 当前页码，默认 1
    perPage: 10,   // 每页数量，默认 10
    operateCityId: '',    // 业务城市 ID
    productType: '',    // 产品类型：1房产抵押贷款 2个人信用贷款 4企业信用贷款 8汽车抵押贷款 16小额贷款(20万以下) 32动产质押贷款
    supportOnline: '',    // 是否支持线上签约：1是 2否
    hasPriority: false,    // 是否已设优先级：1是 2否
    keyword: '',    // 搜索：产品名称
  })
  let hasPriority = ref(true)

  
  let isLoading = ref(false)

  // 产品列表接口返回数据
  const productListData = reactive({
    meta: {
      currentPage: 0,
      total: 0,
      perPage: 0,
      lastPage: 0
    },
    items: [
      // {
      //   id: "",   // 产品 ID
      //   productName: "",   // 产品名称
      //   channelId: "",   // 金融机构 ID
      //   channelName: "",   // 金融机构名称
      //   productType: "",   // 产品类型：1房产抵押贷款 2个人信用贷款 4企业信用贷款 8汽车抵押贷款 16小额贷款(20万以下) 32动产质押贷款
      //   productTypeCn: "",   // 产品类型说明
      //   supportOnline: "",   // 是否支持线上签约：1是 2否
      //   showPriority: "",   // 优先级
      //   productTags: "",   // 产品标签
      //   operateCitys: "",   // 业务城市
      // }
    ]
  })

  // 搜索产品
  function searchProducts() {
    isLoading.value = true
    hasPriority.value === true ? productListParams.hasPriority = 1 : productListParams.hasPriority = 2
    getProductList(productListParams)
      .then(res => {
        console.log('getProductList: ',res);
        isLoading.value = false
        productListData.meta = res.data.meta
        productListData.items = res.data.items
      }, err => isLoading.value = false )
  }
  searchProducts()

  // 重置搜索项
  const resetFormParams = () => {
    hasPriority.value = false
    proxy.resetForm("queryRef");
    searchProducts()
  }

  // 编辑
  const editProduct = row => {
    console.log(row);
    router.push({name: 'addProduct', query: {id: row.id, isEdit: true }})
  }
  
  // 城市配置
  const setProductCity = row => {
    router.push({name: 'cityList', query: {id: row.id, productName: row.productName, channelId: row.channelId }})
  }
  
  // 删除
  const deleteProductFunc = row => {
    console.log(row);
    proxy.$modal.confirm(`确认删除产品${row.productName}吗？`)
      .then(() => {
        deleteProduct(row.id)
          .then(res => {
            console.log('deleteProduct: ', res);
            if (res.status) proxy.$modal.msgSuccess("删除成功")
            searchProducts()
          })
      }, err => {})
  }

  // 添加产品
  const addProduct = () => router.push({name: 'addProduct'})

  // 根据id返回指定的的lebel
  const returnTargetOptionsLabel = (key, target) => target.filter(item => item.value === key )[0].label
  
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

