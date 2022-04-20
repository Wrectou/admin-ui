<template>
  <div class="container add-product">
    
    <h3>章节基本信息</h3>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addProductParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="章节名称" prop="title">
        <el-input v-model="addProductParams.title" placeholder="请输入章节名称" />
      </el-form-item>
      <br />
      <el-form-item label="类型" prop="level">
        <el-select v-model="addProductParams.level">
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="难度" prop="difficulty">
        <el-rate v-model="addProductParams.difficulty" show-score text-color="#ff9900" :score-template="''" />
      </el-form-item>
      <br />

      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)"  >{{ isEdit ? "保存" : "添加" }}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup name="questionAdminAddChapter">

import { addBusinessSection, getBusinessSectionDetail, editBusinessSection, } from "@/api"
import { ElMessage } from "element-plus"

const route = useRoute()

const { proxy } = getCurrentInstance()

// 类型
let levelOptions = [
  { value: 0, label: '基本级执法资格考试'},
  { value: 1, label: '高级执法资格考试'},
]

// 章节参数
const addProductParams = reactive({
  title: "",
  level: "",
  difficulty: 0
})

let isLoading = ref(false)

// 是否编辑？
let isEdit = ref(false)
let productId = ref("")
if (route.query.isEdit) {
  isEdit.value = true
  productId.value = route.query.id
  getProductDetailFunc()
}

// 章节详情
async function getProductDetailFunc() {
  getBusinessSectionDetail(productId.value)
    .then(res => {
      console.log("getBusinessSectionDetail: ", res);
      addProductParams.id = res.data.id
      addProductParams.title = res.data.title
      addProductParams.level = res.data.level
      addProductParams.difficulty = res.data.difficulty
    })
}

// 表单验证
const ruleFormRef = ref()
const rules = reactive({
  title: [
    {
      required: true,
      message: "请输入章节名称",
      trigger: "blur",
    },
  ],
  level: [
    {
      required: true,
      message: "请选择章节类型",
      trigger: "change",
    },
  ],
  difficulty: [
    {
      required: true,
      message: "请选择章节难度",
      trigger: "change",
    },
  ],
})

// 添加/保存 按钮
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (addProductParams.difficulty <= 0) return ElMessage.error("请选择章节难度")
      isLoading.value = true
      if (!isEdit.value) addProductFunc(addProductParams)
      else editProductFunc(addProductParams)
    } else return
  })
}

// 新增章节
function addProductFunc(addProductParams) {
  addBusinessSection(addProductParams)
    .then(res => {
      console.log("addBusinessSection: ", res);
      isLoading.value = false
      ElMessage.success(res.msg)
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage("/questionAdmin/chapter/list")
    }, err => isLoading.value = false
  )
}

// 保存章节
function editProductFunc(addProductParams) {
  editBusinessSection(addProductParams)
    .then(res => {
      console.log("editBusinessSection: ", res);
      isLoading.value = false
      ElMessage.success(res.msg)
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage("/questionAdmin/chapter/list")
    }, err => isLoading.value = false
  )
}

// 重置表单
const resetForm = (formEl) => {
  if (!formEl) return
  proxy.$tab.closeOpenPage()
  proxy.$tab.openPage("/questionAdmin/chapter/list")
};

</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}


::v-deep(.el-form-item--default) {
  .el-form-item__content{
    line-height: 0;
  }
}

.button-box {
  margin: 50px 0 0 120px;
}
</style>

