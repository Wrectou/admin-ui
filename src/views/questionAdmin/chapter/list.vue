<template>
  <div class="container product-list">

    <el-form 
      :model="sectionListParams" 
      ref="queryRef" 
      :inline="true"
    >
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="5">
            <el-form-item label="类型" prop="level">
              <el-select v-model="sectionListParams.level">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="难度" prop="difficulty">
              <el-select v-model="sectionListParams.difficulty">
                <el-option v-for="item in difficultyOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="title" class="search-input">
              <el-input v-model="sectionListParams.title" placeholder="输入章节名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button icon="Search" type="primary" @click="searchSections">搜索</el-button>
            <el-button icon="Refresh" @click="resetFormParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addChapter">添加章节</el-button>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      v-loading="isLoading"
      :data="productListData.items"
      style="width: 100%;"
    >
      <el-table-column label="章节名称" align="center" prop="title" />
      <el-table-column label="难度" align="center" prop="difficulty">
        <template #default="scope">
          <el-rate v-model="scope.row.difficulty" disabled show-score text-color="#ff9900" :score-template="''" />
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="level">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.level, levelOptions)}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="320">
        <template #default="scope">
          <el-button type="primary" @click="editProduct(scope.row)">编辑</el-button>
          <el-button type="danger" @click="setProductCity(scope.row)">题目管理</el-button>
          <el-button type="info" @click="deleteProductFunc(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination @pagination="searchSections" v-show="productListData.total > 0" :total="productListData.total" v-model:page="sectionListParams.pageNum" v-model:limit="sectionListParams.pageSize" />

  </div>
</template>

<script setup name="Chapter/list">

  import { getSectionList, deleteBusinessSection } from "@/api"

  const router = useRouter()
  
  const { proxy } = getCurrentInstance()


  // 类型
  let levelOptions = [
    { value: 0, label: '基本级执法资格考试'},
    { value: 1, label: '高级执法资格考试'},
  ]

  // 难度
  let difficultyOptions = [
    { value: 1, label: '1星'},
    { value: 2, label: '2星'},
    { value: 3, label: '3星'},
    { value: 4, label: '4星'},
    { value: 5, label: '5星'},
  ]

  // 产品列表参数
  const sectionListParams = reactive({
    pageNum: 1,
    pageSize: 10,
    level: '',
    difficulty: '',
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
    getSectionList(sectionListParams)
      .then(res => {
        console.log('getSectionList: ',res);
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
    router.push({path: '/questionAdmin/chapter/add', query: {id: row.id, isEdit: true }})
  }
  
  // 题目管理
  const setProductCity = row => {
    router.push({path: '/questionAdmin/chapter/questionList', query: {id: row.id, title: row.title, level: row.level }})
  }
  
  // 删除
  const deleteProductFunc = row => {
    proxy.$modal.confirm(`确认删除章节《${row.title}》吗？`)
      .then(() => {
        deleteBusinessSection(row.id)
          .then(res => {
            console.log('deleteBusinessSection: ', res);
            if (res.code === 200) proxy.$modal.msgSuccess("删除成功")
            searchSections()
          })
      }, err => {})
  }

  // 添加产品
  const addChapter = () => router.push({path: '/questionAdmin/chapter/add'})

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

