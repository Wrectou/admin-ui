<template>
  <div class="container add-product">

    <h2>轮播图片信息</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addBannerParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item class="input" label="名称" prop="bannerName">
        <el-input v-model="addBannerParams.bannerName" placeholder="请输入名称（不验重）" />
      </el-form-item>
      <br/>
      <el-form-item label="顺序" prop="showPriority">
        <el-select v-model="addBannerParams.showPriority">
          <el-option v-for="item in showPriorityOptions" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-form-item label="图片" prop="bannerImage">
        <el-upload
          class="uploader"
          :action="qiniuBaseURL"
          :data="qiniuConfig"
          :show-file-list="false"
          :on-success="handlebannerImageSuccess"
        >
          <img v-if="addBannerParams.bannerImage" :src="addBannerParams.bannerImage" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
        </el-upload>
      </el-form-item>
      <br/>
      <el-form-item class="input" label="链接" prop="bannerUrl">
        <el-input v-model="addBannerParams.bannerUrl" placeholder="请输入链接" />
      </el-form-item>
      <br/>
      <el-form-item class="input" label="备注" prop="bannerRemark">
        <el-input type="textarea" rows="4" v-model="addBannerParams.bannerRemark" placeholder="请输入" />
      </el-form-item>
      <br/>

      
      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">{{isEdit ? '保存' : '添加'}}</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup name="addBanner">

  import { getQiniuConfig, addBanner, getBannerDetail, editBanner } from "@/api"
  import { ElMessage } from 'element-plus'
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"

  const route = useRoute()
  const { proxy } = getCurrentInstance()

  let showPriorityOptions = [ { value: 1, label: '1', }, { value: 2, label: '2', },{ value: 3, label: '3', }, { value: 4, label: '4', },{ value: 5, label: '5', } ]
  
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
  const handlebannerImageSuccess = (res, file) => addBannerParams.bannerImage = `https://${qiniuConfig.value.prefix}/${res.key}`
  
  let time = ref('')
  watch(time, newVal => {
    console.log(newVal);
    addBannerParams.startTime = newVal[0]
    addBannerParams.endTime = newVal[1]
  })
  
  const addBannerParams = reactive({
    bannerName: '',
    showPriority: '',
    startTime: '',
    endTime: '',
    bannerImage: '',
    bannerUrl: '',
    bannerRemark: '',
  })
  
  let isLoading = ref(false)

  let isEdit = ref(false)
  let bannerId = ref('')
  if (route.query.isEdit) {
    isEdit.value = true
    bannerId.value = route.query.id
    getBannerDetailFunc()
  }
  
  async function getBannerDetailFunc() {
    getBannerDetail(bannerId.value)
      .then(res => {
        console.log('getBannerDetail: ', res);
        if (res.status) {
          addBannerParams.bannerName = res.data.bannerName
          addBannerParams.showPriority = res.data.showPriority
          time.value = [res.data.startTime, res.data.endTime]
          addBannerParams.bannerImage = res.data.bannerImage
          addBannerParams.bannerUrl = res.data.bannerUrl
          addBannerParams.bannerRemark = res.data.bannerRemark
        }
      })
  }

  const ruleFormRef = ref()
  const rules = reactive({
    bannerName: [
      {
        required: true,
        message: '请输入名称（不验重）',
        trigger: 'blur',
      },
    ],
    showPriority: [
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
    bannerImage: [
      {
        required: true,
        message: '请选择图片',
        trigger: 'blur',
      },
    ],
    bannerUrl: [
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
        console.log('addBannerParams: ',addBannerParams);

        isLoading.value = true
        if (!isEdit.value) addBannerFunc(addBannerParams)
        else editBannerFunc(addBannerParams)

      } else return
    })
  }
  
  function addBannerFunc(addBannerParams) {
    addBanner(addBannerParams)
      .then(res => {
        console.log('addBanner: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/system/bannerList")
        }
      }, err => isLoading.value = false )
  }

  function editBannerFunc(addBannerParams) {
    editBanner(bannerId.value, addBannerParams)
      .then(res => {
        console.log('editBanner: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/system/bannerList")
        }
      }, err => isLoading.value = false )
  }

  const resetForm = formEl => {
    if (!formEl) return
    if (!isEdit.value) {
      formEl.resetFields()
    } else {
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage("/system/bannerList")
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

