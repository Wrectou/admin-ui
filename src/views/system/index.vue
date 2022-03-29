<template>
  <div class="container add-product">

    <h2>文章设置</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="editPlatformInfoParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item class="input" label="温馨提示" prop="tips">
        <el-input v-model="editPlatformInfoParams.tips" placeholder="请输入温馨提示" />
      </el-form-item>
      <br/>
      <el-form-item class="input" label="版权信息" prop="copyright">
        <el-input v-model="editPlatformInfoParams.copyright" placeholder="请输入版权信息" />
      </el-form-item>
      <br/>
      <el-form-item class="input" label="主体" prop="subject">
        <el-input v-model="editPlatformInfoParams.subject" placeholder="请输入主体" />
      </el-form-item>
      <br/>
      <el-form-item class="input" label="备案信息" prop="record">
        <el-input v-model="editPlatformInfoParams.record" placeholder="请输入备案信息" />
      </el-form-item>
      <br/>
      <el-form-item label="平台简介" prop="intro">
        <TinymceEditor 
          ref="editor" 
          :placeholder="'请输入平台简介'"
          :modelValue="editPlatformInfoParams.intro"
          v-model="editPlatformInfoParams.intro"
        />
      </el-form-item>
      <br/>

      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup name="systemIndex">

  import { getPlatformInfoDetail, editPlatformInfo } from "@/api"
  import { ElMessage } from 'element-plus'
  
  import TinymceEditor from '@/components/tinymceEditor'

  const route = useRoute()
  const { proxy } = getCurrentInstance()

  const editPlatformInfoParams = reactive({
    tips: '',   // 温馨提示
    copyright: '',   // 版权信息
    subject: '',   // 主体
    record: '',   // 备案信息
    intro: '',   // 平台简介
  })
  let isLoading = ref(false)

  function getPlatformInfoDetailFunc() {
    getPlatformInfoDetail()
      .then(res => {
        console.log('getPlatformInfoDetail: ', res);
        if (res.status) {
          editPlatformInfoParams.tips = res.data.tips
          editPlatformInfoParams.copyright = res.data.copyright
          editPlatformInfoParams.subject = res.data.subject
          editPlatformInfoParams.record = res.data.record
          editPlatformInfoParams.intro = res.data.intro
        }
      })
  }
  getPlatformInfoDetailFunc()


  const ruleFormRef = ref()
  const rules = reactive({
    tips: [
      {
        required: true,
        message: '请输入温馨提示',
        trigger: 'blur',
      },
    ],
    copyright: [
      {
        required: true,
        message: '请输入版权信息',
        trigger: 'blur',
      },
    ],
    subject: [
      {
        required: true,
        message: '请输入主体',
        trigger: 'blur',
      },
    ],
    record: [
      {
        required: true,
        message: '请输入备案信息',
        trigger: 'blur',
      },
    ],
    intro: [
      {
        required: true,
        message: '请输入平台简介',
        trigger: 'blur',
      },
    ],
  })

  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        console.log(editPlatformInfoParams);

        isLoading.value = true
        editPlatformInfoFunc(editPlatformInfoParams)

      } else return
    })
  }

  function editPlatformInfoFunc(editPlatformInfoParams) {
    editPlatformInfo(editPlatformInfoParams)
      .then(res => {
        console.log('editPlatformInfo: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          getPlatformInfoDetailFunc()
        }
      }, err => isLoading.value = false )
  }

  const resetForm = formEl => {
    if (!formEl) return
    formEl.resetFields()
  }

</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.input{
  width: 40vw;
}

.button-box{
  margin: 50px 0 0 120px;
}
</style>

