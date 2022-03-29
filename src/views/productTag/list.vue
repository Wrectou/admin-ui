<template>
  <div class="container product-list">

    <!-- 控制栏 -->
    <el-form :model="productTagListParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="5">
            <el-form-item label="产品标签" prop="tagAttr">
              <el-select v-model="productTagListParams.tagAttr">
                <el-option v-for="item in tagAttrOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="标签分类" prop="tagType">
              <el-select v-model="productTagListParams.tagType">
                <el-option v-for="item in tagTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="是否推荐" prop="isRecommend">
              <el-select v-model="productTagListParams.isRecommend">
                <el-option v-for="item in isRecommendOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="keyword" class="search-input">
              <el-input v-model="productTagListParams.keyword" placeholder="输入标签名称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button icon="Search" type="primary" @click="searchProductTags">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addProductTag">添加标签</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="productTagListData.items"
      style="width: 100%;"
    >
      <el-table-column label="标签名称" align="center" prop="tagName"  />
      <el-table-column label="标签归属" align="center" prop="tagAttrCn" />
      <el-table-column label="标签分类" align="center" prop="tagTypeCn" />
      <el-table-column label="优先级" align="center" prop="showPriority" />
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.isRecommend, isRecommendOptions)}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editProductTag(scope.row)">编辑</el-button>
          <el-button type="info" @click="deleteProductTagFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination @pagination="searchProductTags" v-show="productTagListData.meta.total > 0" :total="productTagListData.meta.total" v-model:page="productTagListParams.page" v-model:limit="productTagListParams.perPage" />

  </div>
</template>

<script setup name="productTagList">

  import { getProductTagList, deleteProductTag } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const router = useRouter()
  const { proxy } = getCurrentInstance()

  // 产品标签可选数据
  let tagAttrOptions = getEnumKeyArr('enumTagAttr')
  // 产品标签分类可选数据
  let tagTypeOptions = getEnumKeyArr('enumTagType')
  // 是否推荐可选数据
  let isRecommendOptions = [ { value: 1, label: '是', }, { value: 2, label: '否', } ]

  // 产品列表参数
  const productTagListParams = reactive({
    page: 1,   // 当前页码，默认 1
    perPage: 10,   // 每页数量，默认 10
    tagAttr: '',   // 产品标签归属(枚举 enumTagAttr)：1通用 2房 4车 8企业
    tagType: '',   // 产品标签分类(枚举 enumTagType)：1职业身份 2借款人资质 4资产资质 8特殊需求 16产品特征
    isRecommend: '',   // 是否推荐：1推荐 2不推荐
    keyword: '',    // 搜索：产品名称
  })
  
  let isLoading = ref(false)

  // 产品列表接口返回数据
  const productTagListData = reactive({
    meta: {
      currentPage: 0,
      total: 0,
      perPage: 0,
      lastPage: 0
    },
    items: []
  })

  // 搜索产品
  function searchProductTags() {
    isLoading.value = true
    getProductTagList(productTagListParams)
      .then(res => {
        console.log('getProductTagList: ',res);
        isLoading.value = false
        productTagListData.meta = res.data.meta
        productTagListData.items = res.data.items
      }, err => isLoading.value = false )
  }
  searchProductTags()

  // 重置搜索项
  const resetFormParams = () => {
    proxy.resetForm("queryRef")
    searchProductTags()
  }

  // 编辑
  const editProductTag = row => {
    router.push({name: 'addProductTag', query: {id: row.id, isEdit: true }})
  }
  
  // 删除
  const deleteProductTagFunc = row => {
    console.log(row);
    proxy.$modal.confirm(`确认删除产品${row.tagName}吗？`)
      .then(() => {
        deleteProductTag(row.id)
          .then(res => {
            console.log('deleteProductTag: ', res);
            if (res.status) proxy.$modal.msgSuccess("删除成功")
            searchProductTags()
          })
      }, err => {})
  }

  // 添加产品
  const addProductTag = () => router.push({name: 'addProductTag'})

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

