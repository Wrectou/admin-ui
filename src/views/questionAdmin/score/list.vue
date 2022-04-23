<template>
  <div class="container product-list">

    <!-- 列表搜索项 -->
    <el-form :model="listParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="24" class="control-left">
          <!-- <el-col :span="5">
            <el-form-item label="题目类型" prop="level">
              <el-select v-model="listParams.level">
                <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="考试类型" prop="etype">
              <el-select v-model="listParams.etype">
                <el-option v-for="item in etypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col> -->
          
          <el-col :span="10">
            <el-form-item label="选择试卷名称" prop="epaperId">
              <el-select style="width: 300px;" v-model="peopleStaticListParams.epaperId" @change="getEpaperPeopleStaticListFunc">
                <el-option v-for="item in testNameOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item label="" prop="name" class="search-input">
              <el-input v-model="listParams.name" placeholder="输入试卷名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button icon="Search" type="primary" @click="searchList">搜索</el-button>
            <el-button icon="Refresh" @click="resetListParams">重置</el-button>
          </el-col> -->
        </el-col>
      </el-row>
    </el-form>

    
    <div class="test-static">
      <div class="static">
        <div class="key">应考人数</div>
        <div class="value primary">{{peopleStaticListData.supposed}}</div>
      </div>
      <div class="static">
        <div class="key">实考人数</div>
        <div class="value success">{{peopleStaticListData.attendance}}</div>
      </div>
      <div class="static">
        <div class="key">缺考人数</div>
        <div class="value danger">{{peopleStaticListData.missing}}</div>
      </div>
      <div class="static">
        <div class="key">合格人数</div>
        <div class="value success">{{peopleStaticListData.pass}}</div>
      </div>
      <div class="static">
        <div class="key">不合格人数</div>
        <div class="value danger">{{peopleStaticListData.flunk}}</div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table v-loading="tableLoading" :data="peopleStaticListData.peopleScoreList" style="width: 100%;">
      <el-table-column label="姓名" align="center" prop="userName" />
      <el-table-column label="所在部门" align="center" prop="deptName" />
      <el-table-column label="得分" align="center" prop="totalScore" />
      <el-table-column label="考试时间" align="center" prop="createTime" />
      <el-table-column label="用时" align="center" prop="times">
        <template #default="scope">{{timesToText(scope.row.times)}}</template>
      </el-table-column>
      <el-table-column label="结果" align="center" prop="pass">
        <template #default="scope">
          <div class="table-res">
            <el-tag :type="scope.row.pass ? 'success' : 'danger' ">{{scope.row.pass ? '合格' : '不合格' }}</el-tag>
          </div>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script setup name="questionAdminScoreList">
  
  import { ElMessage, ElMessageBox } from 'element-plus'

  import { getEpaperPeopleStaticList, getAdminEpaperList } from "@/api"

  const route = useRoute()
  const router = useRouter()
  
  const { proxy } = getCurrentInstance()

  // 题目类型
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
  // 考试类型
  let etypeOptions = [
    { value: 0, label: '历年真题'},
    { value: 1, label: '模拟考试'},
    { value: 2, label: '正式考试'},
  ]
  
  let tableLoading = ref(false)

  let peopleStaticListParams = reactive({
    epaperId: ''
  })

  if (route.query.epaperId) {
    peopleStaticListParams.epaperId = Number(route.query.epaperId)
    getEpaperPeopleStaticListFunc()
  }

  let peopleStaticListData = ref({
    attendance: 0,
    flunk: 0,
    pass: 0,
    missing: 0,
    supposed: 0,
    peopleScoreList: [],
  })
  function getEpaperPeopleStaticListFunc() {
    tableLoading.value = true
    getEpaperPeopleStaticList(peopleStaticListParams)
      .then(res => {
        console.log('getEpaperPeopleStaticList: ', res);
        tableLoading.value = false
        peopleStaticListData.value = res.data
      }, err => tableLoading.value = false )
  }



  // 列表参数
  const listParams = reactive({
    pageNum: 1,
    pageSize: 1000,
    level: '',
    etype: '',
    name: '',
  })
  // 列表加载
  let isLoading = ref(false)
  // 列表数据
  const listData = reactive({
    total: 0,
    items: []
  })
  
  let testNameOptions = reactive([])
  // 获取列表
  function searchList() {
    isLoading.value = true
    getAdminEpaperList(listParams)
      .then(res => {
        console.log('getAdminEpaperList: ',res);
        isLoading.value = false
        listData.total = res.total
        listData.items = res.rows
        testNameOptions.length = 0
        res.rows.forEach(item => {
          let obj = {}
          obj.value = item.id
          obj.label = item.name
          testNameOptions.push(obj)
        })

      }, err => isLoading.value = false )
  }
  searchList()
  // 重置搜索项
  const resetListParams = () => {
    proxy.resetForm("queryRef")
    searchList()
  }


  // 秒转中文时分秒
  function timesToText(second) {
    let lefttime = second*1000,
        lefth = Math.floor(lefttime/(1000*60*60)%24) < 10 ? '0' + Math.floor(lefttime/(1000*60*60)%24) : Math.floor(lefttime/(1000*60*60)%24),
        leftm = Math.floor(lefttime/(1000*60)%60) < 10 ? '0'+Math.floor(lefttime/(1000*60)%60) : Math.floor(lefttime/(1000*60)%60),
        lefts = Math.floor(lefttime/1000%60) < 10 ? '0'+Math.floor(lefttime/1000%60) : Math.floor(lefttime/1000%60);
        if (lefth !== '00') return lefth + "时" + leftm + "分" + lefts + "秒"
        else return leftm + "分" + lefts + "秒"
  }
  
</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
  min-height: 90vh;
}

.test-static{
  margin: 18px 0 28px;
  display: flex;
  justify-content: space-between;
  .static{
    flex: 1;
    margin: 0 10px 0 0;
    padding: 14px 20px;
    border: solid 1px #e1e1e1;
    border-radius: 8px;
    .key{
      font-size: 18px;
      color: #333;
    }
    .value{
      margin: 8px 0 0;
      font-size: 30px;
      color: var(--el-color-primary);
    }
    .success{
      color: var(--el-color-success);
    }
    .danger{
      color: var(--el-color-danger);
    }
  }
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

