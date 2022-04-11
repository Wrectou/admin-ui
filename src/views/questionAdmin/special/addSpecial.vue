<template>
  <div class="container add-product">
    
    <h3>专题学习内容基本信息</h3>

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
      <el-form-item label="封面" prop="picture">
        <el-upload
          class="uploader"
          :action="qiniuBaseURL"
          :headers="headerObj"
          :data="qiniuConfig"
          :show-file-list="false"
          :on-success="handleLogoSuccess"
        >
          <img v-if="addProductParams.picture" :src="addProductParams.picture" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
        </el-upload>
      </el-form-item>
      <br/>
      <el-form-item label="内容" prop="content">
        <TinymceEditor 
          ref="editor"
          :height=600
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

<script setup name="questionAdminAddSpecialSpecial">

import { getToken } from '@/utils/auth'
import { addLearnMaterials, getLearnMaterialsDetail, editLearnMaterials, } from "@/api"
import { ElMessage } from "element-plus"

import TinymceEditor from '@/components/tinymceEditor'

const route = useRoute()

const { proxy } = getCurrentInstance()

// 上传图片相关
let headerObj = ref({
  Authorization: 'Bearer ' + getToken()
})
const qiniuBaseURL = ref(import.meta.env.VITE_APP_UPLOAD)
let qiniuConfig = ref({})
const handleLogoSuccess = (res, file) => {
  console.log(res, file);
  if (res.code === 200) addProductParams.picture = res.url
  else ElMessage.error('上传失败！')
}

// 专题学习内容参数
const addProductParams = reactive({
  title: "",
  content: "",
  picture: "",
  learnId: route.query.id,
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

// 专题学习内容详情
async function getProductDetailFunc() {
  getLearnMaterialsDetail(productId.value)
    .then(res => {
      console.log("getLearnMaterialsDetail: ", res);
      addProductParams.id = res.data.id
      addProductParams.title = res.data.title
      addProductParams.picture = res.data.picture
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
  picture: [
    {
      required: true,
      message: '请上传专题内容封面',
      trigger: 'blur',
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

// 新增专题学习内容
function addProductFunc(addProductParams) {
  addLearnMaterials(addProductParams)
    .then(res => {
      console.log("addLearnMaterials: ", res);
      isLoading.value = false
      ElMessage.success(res.msg)
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage(`/questionAdmin/special/specialList?id=${route.query.id}&title=${route.query.title}`)
    }, err => isLoading.value = false
  )
}

// 保存专题学习内容
function editProductFunc(addProductParams) {
  editLearnMaterials(addProductParams)
    .then(res => {
      console.log("editLearnMaterials: ", res);
      isLoading.value = false
      ElMessage.success(res.msg)
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage(`/questionAdmin/special/specialList?id=${route.query.id}&title=${route.query.title}`)
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
    proxy.$tab.openPage(`/questionAdmin/special/specialList?id=${route.query.id}&title=${route.query.title}`)
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

.uploader{
  ::v-deep(.el-upload){
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    .avatar-uploader-icon{
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      text-align: center;
    } 
  }
}

.button-box {
  margin: 20px 0 0 120px;
}
</style>

