<template>
  <div class="container add-product">

    <h3>题目基本信息</h3>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addProductParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="addProductParams.title"
          :rows="2"
          type="textarea"
          placeholder="请输入标题"
        />
      </el-form-item>
      <br/>
      <el-form-item label="类型" prop="type">
        <el-select v-model="addProductParams.type" :disabled="isEdit" >
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item class="score" label="分数" prop="score">
        <el-input v-model.number="addProductParams.score" placeholder="请输入分数" /> 分
      </el-form-item>
      <br/>
      <el-form-item label="选项" prop="" v-if="addProductParams.type && addProductParams.type !== 5">
        <el-table :data="addProductParams.type === 1 ? tableData1 : tableData" class="question-item">
          <el-table-column label="选项标识" align="center" prop="identifier" width="80">
            <template #default="scope">{{returnTargetOptionsLabel(scope.row.identifier, identifierOptions)}}</template>
          </el-table-column>
          <el-table-column label="选项内容" align="center" prop="title">
            <template #default="scope">
              <div v-if="addProductParams.type === 1">{{scope.row.title}}</div>
              <el-input v-else v-model="scope.row.title" type="text" placeholder="请输入选项内容" />
            </template>
          </el-table-column>
          <el-table-column label="正确答案" align="center" prop="isCorrect" width="80">
            <template #default="scope">
              <el-checkbox v-model="scope.row.isCorrect" label="" size="large" />
            </template>
          </el-table-column>
          <!-- <el-table-column label="移动" align="center" width="200">
            <template #default="scope">
              <el-button type="primary" @click="deleteProductCityFunc(scope.row)">上移</el-button>
              <el-button type="primary" @click="deleteProductCityFunc(scope.row)">下移</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template #default="scope">
              <el-button type="danger" @click="deleteProductCityFunc(scope.row)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
      </el-form-item>
      <br/>
      <el-form-item label="解析" prop="">
        <el-input
          v-model="addProductParams.explanation"
          :rows="5"
          type="textarea"
          placeholder="请输入答案解析"
        />
      </el-form-item>
      <br/>
      
      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">{{routeObj.isEdit ? '保存' : '添加'}}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup name="questionAdminAddQuestion">

  import { addQuestion, addQuestionItem, getQuestionDetail, getQuestionItemDetail, getQuestionItemList, editBusinessQuestion, editBusinessQuestionItem } from "@/api"
  import { ElMessage } from 'element-plus'
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"
  import { deepClone } from "@/utils"

  const route = useRoute()

  const { proxy } = getCurrentInstance()
  
  let identifierOptions = [
    { value: 1, label: 'A'},
    { value: 2, label: 'B'},
    { value: 3, label: 'C'},
    { value: 4, label: 'D'},
    { value: 5, label: 'E'},
  ]
  
  // type 1 判断数据
  const tableData1 = reactive([
    {
      identifier: 1,
      title: '正确',
      isCorrect: true,
    },
    {
      identifier: 2,
      title: '错误',
      isCorrect: false,
    },
  ])

  // type 2 3 4 单选 不定项 多选数据
  const tableData = reactive([
    {
      identifier: 1,
      title: '',
      isCorrect: false,
    },
    {
      identifier: 2,
      title: '',
      isCorrect: false,
    },
    {
      identifier: 3,
      title: '',
      isCorrect: false,
    },
    {
      identifier: 4,
      title: '',
      isCorrect: false,
    },
  ])
  
  let typeOptions = [
    { value: 1, label: '判断题型'},
    { value: 2, label: '单项选择题型'},
    { value: 3, label: '不定项选择题型'},
    { value: 4, label: '多项选择题型'},
    { value: 5, label: '论述题型'},
  ]

  // 产品参数
  const addProductParams = reactive({
    level: '',
    qtype: 0,
    practiceId: '',
    score: '',
    explanation: '',
    title: '',
    type: '',
  })

  let isLoading = ref(false)
  let isEdit = ref(false)

  let routeObj = ref({})
  if (route.query) {
    routeObj.value = route.query
    addProductParams.level = route.query.level
    addProductParams.practiceId = route.query.id
    if (routeObj.value.isEdit) {
      isEdit.value = true
      getQuestionDetailFunc()
    }
  }
  
  // 产品详情
  function getQuestionDetailFunc() {
    getQuestionDetail(routeObj.value.practiceId)
      .then(res => {
        console.log('getQuestionDetail: ', res);
        if (res.code === 200) {
          // addProductParams.level = res.data.level
          addProductParams.id = res.data.id
          addProductParams.practiceId = res.data.practiceId
          addProductParams.score = res.data.score
          addProductParams.explanation = res.data.explanation
          addProductParams.title = res.data.title
          addProductParams.type = res.data.type
          // getQuestionItemDetailFunc()
          getQuestionItemListFunc()
        }
      })
  }
  
  // 查询题目选项列表
  function getQuestionItemListFunc() {
    let params = {
      questionId: routeObj.value.practiceId,
    }
    getQuestionItemList(params)
      .then(res => {
        if (addProductParams.type === 1) {
          res.rows = res.rows.sort((a,b) => a.sort-b.sort)
          res.rows.forEach((item, i) => {
            tableData1[i].id = item.id
            tableData1[i].title = item.title
            tableData1[i].sort = item.sort
            if (item.isCorrect === 1) tableData1[i].isCorrect = true
            else tableData1[i].isCorrect = false
          })
        } else if (addProductParams.type === 2 || addProductParams.type === 3 || addProductParams.type === 4) {
          res.rows = res.rows.sort((a,b) => a.sort-b.sort)
          res.rows.forEach((item, i) => {
            tableData[i].id = item.id
            tableData[i].title = item.title
            tableData[i].sort = item.sort
            if (item.isCorrect === 1) tableData[i].isCorrect = true
            else tableData[i].isCorrect = false
          })
        }
        console.log('getQuestionItemList: ', res);
      })
  }
  // 获取题目选项详细信息 单项
  function getQuestionItemDetailFunc() {
    getQuestionItemDetail(routeObj.value.id)
      .then(res => {
        console.log('getQuestionItemDetail: ', res);
      })
  }

  // 表单验证
  const ruleFormRef = ref()
  const rules = reactive({
    score: [
      { required: true, message: '请输入分数', trigger: 'blur' },
      { type: 'number', message: '请输入数字分数', trigger: 'blur' },
    ],
    title: [
      {
        required: true,
        message: '请输入标题',
        trigger: 'blur',
      },
    ],
    type: [
      {
        required: true,
        message: '请选择类型',
        trigger: 'change',
      },
    ],
  })

  // 添加/保存 按钮
  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate(valid => {
      if (valid) {
        if (addProductParams.type === 1) {
          let correntArr = []
          tableData1.forEach(item => { 
            if (item.isCorrect) {
              correntArr.push(item.identifier) 
              addProductParams.correctAnswers = returnTargetOptionsLabel(item.identifier, identifierOptions)
            }
          })
          if (correntArr.length > 1) return ElMessage.error(`判断题只能有一个正确选项！`)
        } else if (addProductParams.type === 2 || addProductParams.type === 3 || addProductParams.type === 4) {
          let correntArr = []
          let correntStr = ''
          for (let i in tableData) {
            if (tableData[i].isCorrect) correntArr.push(tableData[i].identifier)
            if (!tableData[i].title) return ElMessage.error(`请输入选项${returnTargetOptionsLabel(tableData[i].identifier, identifierOptions)}的内容`)
            else if (i == (tableData.length-1)) {
              if (addProductParams.type === 2 && (correntArr.length <= 0 || correntArr.length > 1)) return ElMessage.error(`单项选择题型只能有一个正确答案！`)
              if (addProductParams.type === 3 && correntArr.length < 1) return ElMessage.error(`不定项选择题型至少需要一个正确答案！`)
              if (addProductParams.type === 4 && correntArr.length < 2) return ElMessage.error(`多项选择题型至少需要两个正确答案！`)
              correntArr.forEach(item => correntStr += returnTargetOptionsLabel(item, identifierOptions) )
              addProductParams.correctAnswers = correntStr
            }
          }
        }
        isLoading.value = true
        if (!routeObj.value.isEdit) addProductCityFunc(addProductParams)
        else editProductCityFunc(addProductParams)
      } else return
    })
  }

  // 新增产品
  function addProductCityFunc(addProductParams) {
    addQuestion(addProductParams)
      .then(res => {
        console.log('addQuestion: ', res);
        isLoading.value = false
        if (res.code === 200) {
          if (addProductParams.type === 1) {
            let newTableData1 = deepClone(tableData1)
            newTableData1.forEach((item, i) => {
              item.identifier = returnTargetOptionsLabel(item.identifier, identifierOptions)
              item.practiceId = addProductParams.practiceId
              item.qtype = addProductParams.qtype
              item.questionId = res.data
              item.sort = i+1
              if (item.isCorrect) item.isCorrect = 1
              else item.isCorrect = 0
              addQuestionItemFunc(item)
            })
          } else if (addProductParams.type === 2 || addProductParams.type === 3 || addProductParams.type === 4) {
            let newTableData = deepClone(tableData)
            newTableData.forEach((item, i) => {
              item.identifier = returnTargetOptionsLabel(item.identifier, identifierOptions)
              item.practiceId = addProductParams.practiceId
              item.qtype = addProductParams.qtype
              item.questionId = res.data
              item.sort = i+1
              if (item.isCorrect) item.isCorrect = 1
              else item.isCorrect = 0
              addQuestionItemFunc(item)
            })
          } else if (addProductParams.type === 5) {
          }
          ElMessage.success('添加成功！')
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage(`/questionAdmin/chapter/questionList?id=${routeObj.value.id}&level=${routeObj.value.level}&title=${routeObj.value.title}`)
        }
      }, err => isLoading.value = false )
  }

  // 新增题目选项
  function addQuestionItemFunc(data) {
    addQuestionItem(data)
      .then(res => {
        console.log('addQuestionItem: ', res);
      })
  }

  // 保存产品
  function editProductCityFunc(addProductParams) {
    editBusinessQuestion(addProductParams)
      .then(res => {
        console.log('editBusinessQuestion: ', res);
        isLoading.value = false
        if (res.code === 200) {
          if (addProductParams.type === 1) {
            let newTableData1 = deepClone(tableData1)
            newTableData1.forEach(item => {
              item.identifier = returnTargetOptionsLabel(item.identifier, identifierOptions)
              item.practiceId = addProductParams.practiceId
              item.qtype = addProductParams.qtype
              item.questionId = addProductParams.id
              if (item.isCorrect) item.isCorrect = 1
              else item.isCorrect = 0
              editBusinessQuestionItemFunc(item)
            })
          } else if (addProductParams.type === 2 || addProductParams.type === 3 || addProductParams.type === 4) {
            let newTableData = deepClone(tableData)
            newTableData.forEach(item => {
              item.identifier = returnTargetOptionsLabel(item.identifier, identifierOptions)
              item.practiceId = addProductParams.practiceId
              item.qtype = addProductParams.qtype
              item.questionId = addProductParams.id
              if (item.isCorrect) item.isCorrect = 1
              else item.isCorrect = 0
              editBusinessQuestionItemFunc(item)
            })
          } else if (addProductParams.type === 5) {
          }
          ElMessage.success('保存成功！')
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage(`/questionAdmin/chapter/questionList?id=${routeObj.value.id}&level=${routeObj.value.level}&title=${routeObj.value.title}`)
        }
      }, err => isLoading.value = false )
  }

  // 编辑题目选项
  function editBusinessQuestionItemFunc(data) {
    editBusinessQuestionItem(data)
      .then(res => {
        console.log('editBusinessQuestionItem: ', res);
      })
  }

  // 重置表单
  const resetForm = formEl => {
    if (!formEl) return
    if (routeObj.value.isEdit) {
      formEl.resetFields()
    } else {
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage(`/questionAdmin/chapter/questionList?id=${routeObj.value.id}&level=${routeObj.value.level}&title=${routeObj.value.title}`)
    }
  }
  
  // 根据id返回指定的的lebel
  const returnTargetOptionsLabel = (key, target) => target.filter(item => item.value === key )[0].label

</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}


.el-textarea{
  min-width: 800px;
}

.question-item{
  min-width: 800px;
}

::v-deep(.cell){
  text-overflow: initial;
}


::v-deep(.el-form-item__content){
  display: flex;
  .el-input{
    flex: 0 0 85%;
    margin: 0 8px 0 0;
  }
}

.button-box{
  margin: 50px 0 0 120px;
}
</style>

