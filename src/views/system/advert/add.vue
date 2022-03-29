<template>
  <div class="container add-product">

    <h2>广告信息</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addAdvertParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item class="input" label="名称" prop="adName">
        <el-input v-model="addAdvertParams.adName" placeholder="请输入名称（不验重）" />
      </el-form-item>
      <br/>
      <el-form-item label="位置" prop="adSite">
        <el-select v-model="addAdvertParams.adSite">
          <el-option v-for="item in adSiteOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <br/>
      <el-form-item class="time" label="有效时间" prop="startTime">
        <el-date-picker
          v-model="time"
          type="datetimerange"
          value-format="YYYY-MM-DD hh:mm:ss"
          range-separator="到"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        />
      </el-form-item>
      <br/>
      <el-form-item label="图片" prop="adImage">
        <el-upload
          class="uploader"
          :action="qiniuBaseURL"
          :data="qiniuConfig"
          :show-file-list="false"
          :on-success="handleAdImageSuccess"
        >
          <img v-if="addAdvertParams.adImage" :src="addAdvertParams.adImage" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
        </el-upload>
      </el-form-item>
      <br/>
      <el-form-item class="input" label="链接" prop="adUrl">
        <el-input v-model="addAdvertParams.adUrl" placeholder="请输入链接" />
      </el-form-item>
      <br/>
      <el-form-item class="input" label="备注" prop="adRemark">
        <el-input type="textarea" rows="4" v-model="addAdvertParams.adRemark" placeholder="请输入" />
      </el-form-item>
      <br/>

      
      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">{{isEdit ? '保存' : '添加'}}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup name="addAdvert">

  import { getQiniuConfig, addAdvert, getAdvertDetail, editAdvert } from "@/api"
  import { ElMessage } from 'element-plus'
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const route = useRoute()
  const { proxy } = getCurrentInstance()

  let adSiteOptions = getEnumKeyArr('enumAdSite')
  
  const qiniuBaseURL = ref(import.meta.env.VITE_APP_QINIU)
  let qiniuConfig = ref({})
  function getQiniuConfigFunc() {
    getQiniuConfig()
      .then(res => {
        console.log('getQiniuConfigFunc: ',res);
        if (res.status) qiniuConfig.value = res.data
      })
  }
  getQiniuConfigFunc()
  const handleAdImageSuccess = (res, file) => addAdvertParams.adImage = `https://${qiniuConfig.value.prefix}/${res.key}`
  
  let time = ref('')
  watch(time, newVal => {
    console.log(newVal);
    addAdvertParams.startTime = newVal[0]
    addAdvertParams.endTime = newVal[1]
  })
  
  const addAdvertParams = reactive({
    adName: '',
    adSite: '',
    startTime: '',
    endTime: '',
    adImage: '',
    adUrl: '',
    adRemark: '',
  })
  
  let isLoading = ref(false)

  let isEdit = ref(false)
  let advertId = ref('')
  if (route.query.isEdit) {
    isEdit.value = true
    advertId.value = route.query.id
    getAdvertDetailFunc()
  }
  
  async function getAdvertDetailFunc() {
    getAdvertDetail(advertId.value)
      .then(res => {
        console.log('getAdvertDetail: ', res);
        if (res.status) {
          addAdvertParams.adName = res.data.adName
          addAdvertParams.adSite = res.data.adSite
          time.value = [res.data.startTime, res.data.endTime]
          addAdvertParams.adImage = res.data.adImage
          addAdvertParams.adUrl = res.data.adUrl
          addAdvertParams.adRemark = res.data.adRemark
        }
      })
  }

  const ruleFormRef = ref()
  const rules = reactive({
    adName: [
      {
        required: true,
        message: '请输入名称（不验重）',
        trigger: 'blur',
      },
    ],
    adSite: [
      {
        required: true,
        message: '请选择位置',
        trigger: 'change',
      },
    ],
    startTime: [
      {
        required: true,
        message: '请选择有效时间',
        trigger: 'change',
      },
    ],
    adImage: [
      {
        required: true,
        message: '请选择图片',
        trigger: 'blur',
      },
    ],
    adUrl: [
      {
        required: true,
        message: '请输入链接',
        trigger: 'blur',
      },
    ],
  })

  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        console.log('addAdvertParams: ',addAdvertParams);

        isLoading.value = true
        if (!isEdit.value) addAdvertFunc(addAdvertParams)
        else editAdvertFunc(addAdvertParams)

      } else return
    })
  }
  
  function addAdvertFunc(addAdvertParams) {
    addAdvert(addAdvertParams)
      .then(res => {
        console.log('addAdvert: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/system/advertList")
        }
      }, err => isLoading.value = false )
  }

  function editAdvertFunc(addAdvertParams) {
    editAdvert(advertId.value, addAdvertParams)
      .then(res => {
        console.log('editAdvert: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/system/advertList")
        }
      }, err => isLoading.value = false )
  }

  const resetForm = formEl => {
    if (!formEl) return
    if (!isEdit.value) {
      formEl.resetFields()
    } else {
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage("/system/advertList")
    }
  }
  
</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.add-product {
  
}

.input{
  width: 40vw;
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

.button-box{
  margin: 50px 0 0 120px;
}
</style>

