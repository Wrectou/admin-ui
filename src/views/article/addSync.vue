<template>
  <div class="container add-product">

    <h2>文章设置</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addArticleSyncParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="选择城市" prop="productName">
        <div>全国</div>
      </el-form-item>
      <el-form-item label="" prop="">
        <div>*将内容绑定到这些城市</div>
      </el-form-item>
      <br/>
      <el-form-item label="摩渔用户ID" prop="moyuId">
        <el-input v-model="addArticleSyncParams.moyuId" placeholder="请输入摩渔用户ID" />
      </el-form-item>

      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">{{routeObj.isEdit ? '保存' : '添加'}}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup name="addSync">

  import { addArticleSync } from "@/api"
  import { ElMessage } from 'element-plus'

  const route = useRoute()
  const { proxy } = getCurrentInstance()

  const addArticleSyncParams = reactive({
    moyuId: ''
  })
  let isLoading = ref(false)

  let routeObj = ref({})
  if (route.query) {
    routeObj.value = route.query
  }

  const ruleFormRef = ref()
  const rules = reactive({
    moyuId: [
      {
        required: true,
        message: '请输入摩渔用户ID',
        trigger: 'blur',
      },
    ],
  })

  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        console.log(addArticleSyncParams);

        isLoading.value = true
        addArticleSyncFunc(addArticleSyncParams)

      } else return
    })
  }

  function addArticleSyncFunc(addArticleSyncParams) {
    addArticleSync(addArticleSyncParams)
      .then(res => {
        console.log('addArticleSync: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage(`/article/syncList`)
        }
      }, err => isLoading.value = false )
  }

  const resetForm = formEl => {
    if (!formEl) return
    if (!routeObj.value.isEdit) {
      formEl.resetFields()
    } else {
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage(`/article/syncList`)
    }
  }

</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.button-box{
  margin: 50px 0 0 120px;
}
</style>

