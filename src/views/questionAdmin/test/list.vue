<template>
  <div class="container product-list">

    <!-- 列表搜索项 -->
    <el-form :model="listParams" ref="queryRef" :inline="true">
      <el-row class="control-bar">
        <el-col :span="20" class="control-left">
          <el-col :span="5">
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
          </el-col>
          <el-col :span="4">
            <el-form-item label="" prop="name" class="search-input">
              <el-input v-model="listParams.name" placeholder="输入试卷名称" />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button icon="Search" type="primary" @click="searchList">搜索</el-button>
            <el-button icon="Refresh" @click="resetListParams">重置</el-button>
          </el-col>
        </el-col>
        <el-col :span="4" class="control-right">
          <el-button icon="circle-plus" type="primary" @click="addTest">添加试卷</el-button>
        </el-col>
      </el-row>
    </el-form>

    <!-- 表格 -->
    <el-table v-loading="isLoading" :data="listData.items" style="width: 100%;">
      <el-table-column label="试卷名称" align="center" prop="name" />
      <el-table-column label="考试类型" align="center" prop="etype">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.etype, etypeOptions)}}</template>
      </el-table-column>
      <el-table-column label="题目类型" align="center" prop="level">
        <template #default="scope">{{returnTargetOptionsLabel(scope.row.level, levelOptions)}}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400">
        <template #default="scope">
          <el-button type="primary" @click="editTest(scope.row)">编辑</el-button>
          <el-button type="success" @click="setTestPerson(scope.row)">人员管理</el-button>
          <el-button type="danger" @click="setTestSubject(scope.row)">试题管理</el-button>
          <el-button type="info" @click="deleteTest(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <pagination @pagination="searchList" v-show="listData.total > 0" :total="listData.total" v-model:page="listParams.pageNum" v-model:limit="listParams.pageSize" />

    <!-- 添加试卷弹窗 -->
    <el-dialog
      v-model="addTestVisible"
      title="试卷基本信息"
      width="68%"
      :close-on-click-modal="false"
      :before-close="addHandleClose"
    >
      <!-- 弹窗内容 -->
      <div class="dialog-content add-test">

        <el-form
          ref="addRuleFormRef"
          :inline="true"
          :model="addParams"
          :rules="addRules"
          label-width="90px"
          class="add-form"
        >
          <el-form-item label="试卷名称" class="name" prop="name">
            <el-input v-model="addParams.name" placeholder="请输入试卷名称" />
          </el-form-item>
          <br />
          <el-form-item label="考试类型" prop="etype">
            <el-select v-model="addParams.etype">
              <el-option v-for="item in etypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="题目类型" prop="level">
            <el-select v-model="addParams.level">
              <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="总分数" prop="totalScore">
            <el-input v-model.number="addParams.totalScore" type="number" placeholder="请输入总分数">
              <template #append>分</template>
            </el-input>
          </el-form-item>
          <el-form-item label="合格分数" prop="qualifiedScore">
            <el-input v-model.number="addParams.qualifiedScore" type="number" placeholder="请输入合格分数">
              <template #append>分</template>
            </el-input>
          </el-form-item>
          <br />
          <el-form-item label="考试时长" prop="duration">
            <el-input v-model.number="addParams.duration" type="number" placeholder="请输入考试时长">
              <template #append>分钟</template>
            </el-input>
          </el-form-item>
          <el-form-item label="考试难度" prop="difficulty">
            <el-rate v-model="addParams.difficulty" show-score text-color="#ff9900" :score-template="''" />
          </el-form-item>
          <br />
          <el-form-item label="开考时间" prop="startTime">
            <el-date-picker v-model="addParams.startTime" type="datetime" placeholder="请选择开考时间" />
          </el-form-item>
          <el-form-item label="停考时间" prop="endTime">
            <el-date-picker v-model="addParams.endTime" type="datetime" placeholder="请选择停考时间" />
          </el-form-item>
          <br />

          <el-form-item class="button-box">
            <el-button @click="resetAddForm(addRuleFormRef)">取消</el-button>
            <el-button type="primary" :loading="addTestLoading" @click="submitAddForm(addRuleFormRef)"  >{{ isEdit ? "保存" : "添加" }}</el-button>
          </el-form-item>
        </el-form>

      </div>
    </el-dialog>

  </div>
</template>

<script setup name="questionAdminTestList">
  
  import { ElMessage, ElMessageBox } from 'element-plus'

  import { getAdminEpaperList, addEpaper, getEpaperDetail, editEpaper, deleteEpaper } from "@/api"

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
  
  // 列表参数
  const listParams = reactive({
    pageNum: 1,
    pageSize: 10,
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

  // 获取列表
  function searchList() {
    isLoading.value = true
    getAdminEpaperList(listParams)
      .then(res => {
        console.log('getAdminEpaperList: ',res);
        isLoading.value = false
        listData.total = res.total
        listData.items = res.rows
      }, err => isLoading.value = false )
  }
  searchList()

  // 重置搜索项
  const resetListParams = () => {
    proxy.resetForm("queryRef")
    searchList()
  }


  // 添加弹出框是否显示
  let addTestVisible = ref(false)
  // 添加试卷loading
  let addTestLoading = ref(false)
  // 是否编辑
  let isEdit = ref(false)
  //  添加参数
  const addParams = reactive({
    difficulty: 0,
    startTime: '',
    endTime: '',
    duration: '',
    etype: '',
    level: '',
    name: '',
    qualifiedScore: '',
    totalScore: '',
  })
  // 表单验证
  const addRuleFormRef = ref()
  const addRules = reactive({
    name: [ { required: true, message: "请输入试卷名称", trigger: "blur" } ],
    etype: [ { required: true, message: "请选择考试类型", trigger: "change" } ],
    level: [ { required: true, message: "请选择题目类型", trigger: "change" } ],
    totalScore: [ { required: true, message: "请输入总分数", trigger: "blur" } ],
    qualifiedScore: [ { required: true, message: "请输入合格分数", trigger: "blur" } ],
    duration: [ { required: true, message: "请输入考试时长", trigger: "blur" } ],
    difficulty: [ { required: true, message: "请选择考试难度", trigger: "change" } ],
  })
  // 添加
  const addTest = () => addTestVisible.value = true
  // 添加弹窗关闭按钮
  const addHandleClose = done => {
    if (addTestLoading.value) return ElMessage.warning('正在添加，请稍后！')
    ElMessageBox.confirm('确认关闭弹窗吗? 所有未保存数据均会消失！')
      .then(() => {
        done()
        resetObj(addParams)
      }, err => {})
  }
  // 重置添加表单
  const resetAddForm = formEl => {
    console.log(formEl);
    if (!formEl) return
    formEl.resetFields()
  }
  // 添加/编辑 按钮
  const submitAddForm = formEl => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        if (addParams.difficulty <= 0) return ElMessage.error("请选择考试难度")
        addTestLoading.value = true
        if (!isEdit.value) addProductFunc(addParams)
        else editProductFunc(addParams)
      }
    })
  }
  // 新增考试
  function addProductFunc(addParams) {
    addEpaper(addParams)
      .then(res => {
        console.log("addEpaper: ", res);
        addTestLoading.value = false
        addTestVisible.value = false
        ElMessage.success('添加成功')
        resetAddForm(addRuleFormRef.value)
        searchList()
      }, err => addTestLoading.value = false
    )
  }
  // 保存考试
  function editProductFunc(addParams) {
    editEpaper(addParams)
      .then(res => {
        console.log("editEpaper: ", res);
        addTestLoading.value = false
        addTestVisible.value = false
        ElMessage.success('编辑成功')
        resetAddForm(addRuleFormRef.value)
        searchList()
      }, err => addTestLoading.value = false
    )
  }






  // 快速清空对象key值
  const resetObj = target => Object.keys(target).forEach( key => target[key] = '')



  // 编辑
  const editTest = row => {
    router.push({name: 'questionAdminAddChapter', query: {id: row.id, isEdit: true }})
  }
  
  // 试题管理
  const setTestSubject = row => {
    router.push({name: 'questionAdminChapterQuestionList', query: {id: row.id, name: row.name, level: row.level }})
  }

  // 人员管理
  const setTestPerson = row => {
    router.push({name: 'questionAdminChapterQuestionList', query: {id: row.id, name: row.name, level: row.level }})
  }

  // 删除
  const deleteTest = row => {
    proxy.$modal.confirm(`确认删除试卷《${row.name}》吗？`)
      .then(() => {
        deleteEpaper(row.id)
          .then(res => {
            console.log('deleteEpaper: ', res);
            if (res.code === 200) proxy.$modal.msgSuccess("删除成功")
            searchList()
          })
      })
  }










  // 根据id返回指定的的lebel
  const returnTargetOptionsLabel = (key, target) => {
    let str = ''
    target.filter(item => { if (item.value === key) str = item.label })
    return str
  }
  
</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.control-bar{
  .search-input{
    margin: 0;
  }
  .control-right{
    text-align: right;
  }
}

// 添加试卷弹窗
.add-form{
  .name{
    width: 40%;
  }
  ::v-deep(.el-form-item--default) {
    .el-form-item__content{
      line-height: 0;
    }
  }
  .button-box{
    margin: 30px 0 0 90px;
  }
}
</style>

