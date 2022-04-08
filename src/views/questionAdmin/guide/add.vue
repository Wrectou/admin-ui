<template>
  <div class="container add-product">
    
    <h3>考试指南基本信息</h3>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addProductParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item class="title" label="标题" prop="title">
        <el-input v-model="addProductParams.title" placeholder="请输入标题" />
      </el-form-item>
      <br />
      <el-form-item label="内容" prop="content">
        <TinymceEditor 
          ref="editor"
          height="600"
          :placeholder="'请输入内容'"
          :modelValue="addProductParams.content"
          v-model="addProductParams.content"
        />
      </el-form-item>
      <br />

      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)"  >{{ isEdit ? "保存" : "添加" }}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup name="questionAdminAddGuide">

import { addGuidem, getGuideDetail, editGuide, } from "@/api"
import { ElMessage } from "element-plus"

import TinymceEditor from '@/components/tinymceEditor'

const route = useRoute()

const { proxy } = getCurrentInstance()

// 考试指南参数
const addProductParams = reactive({
  title: "",
  content: "",
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

// 考试指南详情
async function getProductDetailFunc() {
  getGuideDetail(productId.value)
    .then(res => {
      console.log("getGuideDetail: ", res);
      addProductParams.id = res.data.id
      addProductParams.title = res.data.title
      addProductParams.content = res.data.content
    })
}

// 表单验证
const ruleFormRef = ref()
const rules = reactive({
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur",
    },
  ],
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur',
    },
  ],
})

// 添加/保存 按钮
const submitForm = formEl => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      isLoading.value = true
      if (!isEdit.value) addProductFunc(addProductParams)
      else editProductFunc(addProductParams)
    } else return
  })
}

// 新增考试指南
function addProductFunc(addProductParams) {
  addGuidem(addProductParams)
    .then(res => {
      console.log("addGuidem: ", res);
      isLoading.value = false
      ElMessage.success(res.msg)
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage("/questionAdmin/guide/list")
    }, err => isLoading.value = false
  )
}

// 保存考试指南
function editProductFunc(addProductParams) {
  editGuide(addProductParams)
    .then(res => {
      console.log("editGuide: ", res);
      isLoading.value = false
      ElMessage.success(res.msg)
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage("/questionAdmin/guide/list")
    }, err => isLoading.value = false
  )
}

// 重置表单
const resetForm = (formEl) => {
  if (!formEl) return
  if (isEdit.value) {
    formEl.resetFields()
  } else {
    proxy.$tab.closeOpenPage()
    proxy.$tab.openPage("/questionAdmin/guide/list")
  }
};

</script>

<style lang="scss" scoped>
.container {
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.title{
  width: 980px;
}

::v-deep(.el-form-item--default) {
  .el-form-item__content{
    line-height: 0;
  }
}

.button-box {
  margin: 20px 0 0 120px;
}
</style>

