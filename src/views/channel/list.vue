<template>
  <div class="container product-list">

    <!-- 控制栏 -->
    <el-form :model="channelListParams" ref="queryRef" :inline="true">
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
          <el-col :span="5">
            <el-form-item label="机构类型" prop="channelType">
              <el-select v-model="channelListParams.channelType">
                <el-option v-for="item in channelTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="keyword" class="search-input">
              <el-input v-model="channelListParams.keyword" placeholder="输入机构名称/机构简称" />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button icon="Search" type="primary" @click="searchChannels">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addChannel">添加金融机构</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="channelListData.items"
      style="width: 100%;"
    >
      <el-table-column label="机构名称" align="center" prop="channelName"  />
      <el-table-column label="机构简介" align="center" prop="channelAbbr" />
      <el-table-column label="英文标识" align="center" prop="channelSign" />
      <el-table-column label="机构类型" align="center" prop="channelType">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.channelType, channelTypeOptions)}}</template>
      </el-table-column>
      <el-table-column label="机构类型标识" align="center" prop="channelTypeSymbol" />
      <el-table-column label="业务允许范围" align="center" prop="areas" />
      <el-table-column label="是否推荐" align="center" prop="isRecommend">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.isRecommend, trueFalseOptions)}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editChannel(scope.row)">编辑</el-button>
          <el-button type="info" @click="deleteChannelFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination @pagination="searchChannels" v-show="channelListData.meta.total > 0" :total="channelListData.meta.total" v-model:page="channelListParams.page" v-model:limit="channelListParams.perPage" />

  </div>
</template>

<script setup name="channelList">

  import { getCommonCity, getChannel, deleteChannel } from "@/api"
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const router = useRouter()
  const { proxy } = getCurrentInstance()

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
    console.log('cityChange: ',e);
    channelListParams.provinceCode = e[0]
    channelListParams.cityCode = e[1]
  }

  // 产品分类可选数据
  let channelTypeOptions = getEnumKeyArr('enumChannelType')
  
  // 线上签约可选数据
  let trueFalseOptions = [ { value: 1, label: '是', }, { value: 2, label: '否', } ]

  // 金融机构参数
  const channelListParams = reactive({
    page: 1,   // 当前页码，默认 1
    perPage: 10,   // 每页数量，默认 10
    provinceCode: '',   // 省份 Code
    cityCode: '',   // 城市 Code
    channelType: '',    // 机构类型(枚举 enumChannelType)：1商业银行(bank) 2消金公司(consu-fin) 3小贷公司(micro-fin) 4助贷公司(tech-fin)
    keyword: '',    // 搜索：机构名称 / 机构简称
  })
  let hasPriority = ref(true)

  let isLoading = ref(false)

  // 金融机构接口返回数据
  const channelListData = reactive({
    meta: {
      currentPage: 0,
      total: 0,
      perPage: 0,
      lastPage: 0
    },
    items: []
  })

  // 搜索产品
  function searchChannels() {
    isLoading.value = true
    getChannel(channelListParams)
      .then(res => {
        console.log('getChannel: ',res);
        isLoading.value = false
        channelListData.meta = res.data.meta
        channelListData.items = res.data.items
      }, err => isLoading.value = false )
  }
  searchChannels()

  // 重置搜索项
  const resetFormParams = () => {
    proxy.resetForm("queryRef")
    channelListParams.provinceCode = ''
    channelListParams.cityCode = ''
    defaultCityArr.value = []
    searchChannels()
  }

  // 编辑
  const editChannel = row => {
    router.push({name: 'addChannel', query: {id: row.id, isEdit: true }})
  }
  
  // 删除
  const deleteChannelFunc = row => {
    console.log(row);
    proxy.$modal.confirm(`确认删除机构${row.channelName}吗？`)
      .then(() => {
        deleteChannel(row.id)
          .then(res => {
            console.log('deleteChannel: ', res);
            if (res.status) proxy.$modal.msgSuccess("删除成功")
            searchChannels()
          })
      }, err => {})
  }

  // 添加产品
  const addChannel = () => router.push({name: 'addChannel'})

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

