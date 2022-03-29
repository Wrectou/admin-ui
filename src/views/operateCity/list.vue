<template>
  <div class="container product-list">

    <!-- 控制栏 -->
    <el-form :model="operateCityListParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="5">
            <el-form-item label="城市选择" prop="operateCityId">
              <el-cascader
                v-model=defaultCityArr
                :props="cityCascaderProps"
                @change=cityChange
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="运营方式" prop="operateMode">
              <el-select v-model="operateCityListParams.operateMode">
                <el-option v-for="item in operateModeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="运营状态" prop="operateStatus">
              <el-select v-model="operateCityListParams.operateStatus">
                <el-option v-for="item in operateTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item label="热门城市">
              <el-checkbox label=""  v-model="isHot" name="type" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button icon="Search" type="primary" @click="searchOperateCitys">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addOperateCity">添加城市</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="productTagListData.items"
      style="width: 100%;"
    >
      <el-table-column label="业务城市" align="center" prop="cityName"  />
      <el-table-column label="省份" align="center" prop="provinceName" />
      
      <el-table-column label="运营方式" align="center" prop="operateModes">
        <template #default="scope">
          <div v-for="item in scope.row.operateModes" :key="item">{{returnTargetOptionsLabel(item, operateModeOptions)}}</div>
        </template>
      </el-table-column>

      <el-table-column label="运营状态" align="center" prop="operateStatus">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.operateStatus, operateTypeOptions)}}</template>
      </el-table-column>

      <el-table-column label="城市等级" align="center" prop="cityLevel" />
      
      <el-table-column label="热门城市" align="center" prop="isHot">
        <template #default="scope">{{scope.row.isHot === 1 ? '是' : '否' }}</template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editOperateCity(scope.row)">编辑</el-button>
          <el-button type="info" @click="deleteOperateCityFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination @pagination="searchOperateCitys" v-show="productTagListData.meta.total > 0" :total="productTagListData.meta.total" v-model:page="operateCityListParams.page" v-model:limit="operateCityListParams.perPage" />

  </div>
</template>

<script setup name="operateCityList">

  import { getCommonCity, getOperateCityList, deleteOperateCity } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const router = useRouter()
  const { proxy } = getCurrentInstance()

  let operateModeOptions = getEnumKeyArr('enumOperateMode')
  let operateTypeOptions = [ { value: 1, label: '在线', }, { value: 2, label: '关闭', } ]

  // 业务城市相关
  const defaultCityArr = ref([])
  const cityCascaderProps = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
      const { code } = node.data
      if (!code && code !== 0) {
        let { data } = await getCommonCity({level: 1, parent: 0})
        data.map(item => {
          item.label = item.name
          item.value = item.code
          item.leaf >= 1
        })
        resolve(data)
      } else if (code === 0) {
        let arr = []
        let { data } = await getCommonCity({level: 2, parent: code})
        data.label = data.name
        data.value = data.code
        data.leaf = 1
        arr.push(data)
        resolve(arr)
      } else {
        let { data } = await getCommonCity({level: 2, parent: code})
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
    operateCityListParams.provinceCode = e[0]
    operateCityListParams.cityCode = e[1]
  }

  // 产品列表参数
  const operateCityListParams = reactive({
    page: 1,   // 当前页码，默认 1
    perPage: 10,   // 每页数量，默认 10
    provinceCode: '',   // 省份 Code
    cityCode: '',   // 城市 Code
    operateMode: '',   // 运营方式(枚举 enumOperateMode)：3有外部经纪人 4 有加盟门店 5 有远程营销
    operateStatus: '',   // 运营状态：1在线 2离线
    isHot: '',   // 热门城市：1是 2否
  })
  let isHot = ref(false)
  
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
  function searchOperateCitys() {
    isLoading.value = true
    isHot.value === true ? operateCityListParams.isHot = 1 : operateCityListParams.isHot = 2
    getOperateCityList(operateCityListParams)
      .then(res => {
        console.log('getOperateCityList: ',res);
        isLoading.value = false
        productTagListData.meta = res.data.meta
        productTagListData.items = res.data.items
      }, err => isLoading.value = false )
  }
  searchOperateCitys()

  // 重置搜索项
  const resetFormParams = () => {
    isHot.value = false
    proxy.resetForm("queryRef")
    searchOperateCitys()
  }

  // 编辑
  const editOperateCity = row => {
    router.push({name: 'addOperateCity', query: {id: row.id, isEdit: true }})
  }
  
  // 删除
  const deleteOperateCityFunc = row => {
    console.log(row);
    proxy.$modal.confirm(`确认删除城市${row.cityName}吗？`)
      .then(() => {
        deleteOperateCity(row.id)
          .then(res => {
            console.log('deleteOperateCity: ', res);
            if (res.status) proxy.$modal.msgSuccess("删除成功")
            searchOperateCitys()
          })
      }, err => {})
  }

  // 添加产品
  const addOperateCity = () => router.push({name: 'addOperateCity'})

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

