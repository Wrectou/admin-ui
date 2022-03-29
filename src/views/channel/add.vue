<template>
  <div class="container add-channel">

    <h2>金融机构信息</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addChannelParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="机构名称" prop="channelName">
        <el-input v-model="addChannelParams.channelName" placeholder="请输入机构名称" />
      </el-form-item>
      <br/>
      <el-form-item label="机构简称" prop="channelAbbr">
        <el-input v-model="addChannelParams.channelAbbr" placeholder="请输入机构简称" />
      </el-form-item>
      <br/>
      <el-form-item label="英文标识" prop="channelSign">
        <el-input v-model="addChannelParams.channelSign" placeholder="请输入英文标识" />
      </el-form-item>
      <br/>
      <el-form-item label="机构类型" prop="channelType">
        <el-select v-model="addChannelParams.channelType">
          <el-option v-for="item in channelTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <br/>
      <el-form-item label="业务允许范围" prop="areas">
        <el-button round @click="checkCityDialogVisible = true">选择城市</el-button>
      </el-form-item>
      <br/>
      <!-- 城市选择组件 -->
      <checkCityComp
        v-if = "isGetChannelDetail"
        ref = "refCheckCity"
        :dialogVisible = "checkCityDialogVisible" 
        :checkCityArr = "checkCityArr"
        @getCityData = "getCityDataHandle"
        @closeCheckCity = "closeCheckCity"
      />
      <el-form-item label="已选城市" class="citys-label" v-if="checkCityArr.length > 0">
        <div class="citys-list">
          <div class="city" v-for="item in checkCityArr" :key="item.VALUE">
            {{item.TITLE}}
            <el-icon color="#F56C6C" @click="deleteCityFunc(item)"><close-bold /></el-icon>
          </div>
        </div>
      </el-form-item>
      <br/>
      <el-form-item label="机构LOGO" prop="channelLogo">
        <el-upload
          class="uploader"
          :action="qiniuBaseURL"
          :data="qiniuConfig"
          :show-file-list="false"
          :on-success="handleLogoSuccess"
        >
          <img v-if="addChannelParams.channelLogo" :src="addChannelParams.channelLogo" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
        </el-upload>
      </el-form-item>
      <br/>
      <el-form-item label="机构ICON" prop="channelIcon">
        <el-upload
          class="uploader"
          :action="qiniuBaseURL"
          :data="qiniuConfig"
          :show-file-list="false"
          :on-success="handleIconSuccess"
        >
          <img v-if="addChannelParams.channelIcon" :src="addChannelParams.channelIcon" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><plus /></el-icon>
        </el-upload>
      </el-form-item>
      <br/>
      <el-form-item label="页面标题" prop="pageTitle">
        <el-input v-model="addChannelParams.pageTitle" placeholder="请输入页面标题" />
      </el-form-item>
      <br/>
      <el-form-item label="是否推荐">
        <el-switch v-model="isRecommend" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <br/>



      
      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">{{isEdit ? '保存' : '添加'}}</el-button>
      </el-form-item>
    </el-form>


    <!-- <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        addProduct
      </el-col>
    </el-row>
    <el-button icon="Search" type="primary" @click="closeTab">关闭标签页</el-button> -->
  </div>
</template>

<script setup name="addChannel">

  import { getQiniuConfig, addChannel, getChannelDetail, editChannel } from "@/api"
  import { ElMessageBox, ElMessage } from 'element-plus'
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"
  import { deepClone } from "@/utils"
  import checkCityComp from '@/components/checkCity/index.vue'
  import { regionCheckBoxList } from "@/utils/area-data"
  import { allCkeckedArr } from "@/utils/area-data-allcheck"

  const route = useRoute()
  const { proxy } = getCurrentInstance()
  
  // 机构类型可选数据
  let channelTypeOptions = getEnumKeyArr('enumChannelType')

  // 城市选择组件
  let checkCityArr = ref([])
  let refCheckCity = ref(null)
  const checkCityDialogVisible = ref(false)
  function getCityDataHandle(value) {
    closeCheckCity()
    checkCityArr.value = value
    addChannelParams.areas = value
  }
  function closeCheckCity() {
    checkCityDialogVisible.value = false
  }
  function deleteCityFunc(item) {
    refCheckCity.value.deleteItem(item)
  }
  
  // 产品参数
  const addChannelParams = reactive({
    channelName: '',    // 机构名称
    channelAbbr: '',    // 机构简称
    channelSign: '',    // 机构英文标识
    channelType: '',    // 机构类型
    areas: [],    // 区域
    channelLogo: '',    // 机构 LOGO
    channelIcon: '',    // 机构 LOGO
    pageTitle: '',    // 页面标题
    isRecommend: 2,    // 是否推荐：1推荐 2不推荐
  })
  let isRecommend = ref(false)
  let isLoading = ref(false)

  // 是否编辑？
  let isEdit = ref(false)
  let channelId = ref('')
  let isGetChannelDetail = ref(false)
  if (route.query.isEdit) {
    isEdit.value = true
    channelId.value = route.query.id
    getChannelDetailFunc()
  } else {
    isGetChannelDetail.value = true
  }

  // 上传图片相关
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
  const handleLogoSuccess = (res, file) => addChannelParams.channelLogo = `https://${qiniuConfig.value.prefix}/${res.key}`
  const handleIconSuccess = (res, file) => addChannelParams.channelIcon = `https://${qiniuConfig.value.prefix}/${res.key}`

  // 寻找具体省份
  function findProvince(code) {
    for (let item of regionCheckBoxList[0].CHILDREN) {
      for (let p of item.CHILDREN) {
        if (p.VALUE === code) return p
      }
    }
  }
  
  // 产品详情
  function getChannelDetailFunc() {
    getChannelDetail(channelId.value)
      .then(res => {
        console.log('getChannelDetail: ', res);
        if (res.status) {
          addChannelParams.channelName = res.data.channelName
          addChannelParams.channelAbbr = res.data.channelAbbr
          addChannelParams.channelSign = res.data.channelSign
          addChannelParams.channelType = res.data.channelType
          let cityArr = []
          res.data.areas.forEach(item => {
            delete item.area
            if (String(item.areaCode) === '0') {
              cityArr = allCkeckedArr
            } else if (String(item.areaCode).substring(2) === '0000') {
              let provinceInfo = findProvince(String(item.areaCode))
              provinceInfo.CHILDREN.forEach(item => {
                item.isCkecked = true
                item.areaCode = item.VALUE
                item.areaLevel = 2
              })
              cityArr = cityArr.concat(provinceInfo.CHILDREN)
            } else {
              let provinceInfo = findProvince(String(item.areaCode).substring(0,2)+'0000')
              provinceInfo.CHILDREN.forEach(i => {
                if (i.VALUE === String(item.areaCode)) {
                  i.isCkecked = true
                  i.areaCode = item.VALUE
                  cityArr.push(i)
                }
              })
            }
          })
          checkCityArr.value = cityArr
          addChannelParams.channelLogo = res.data.channelLogo
          addChannelParams.channelIcon = res.data.channelIcon
          addChannelParams.pageTitle = res.data.pageTitle
          addChannelParams.channelIcon = res.data.channelIcon
          if (res.data.isRecommend === 1) isRecommend.value = true
          isGetChannelDetail.value = true
        }
      })
  }

  // 表单验证
  const ruleFormRef = ref()
  const rules = reactive({
    channelName: [
      {
        required: true,
        message: '请输入机构名称',
        trigger: 'blur',
      },
      // {
      //   min: 3,
      //   max: 5,
      //   message: 'Length should be 3 to 5',
      //   trigger: 'blur',
      // },
    ],
    channelAbbr: [
      {
        required: true,
        message: '请输入机构简称',
        trigger: 'blur',
      },
    ],
    channelSign: [
      {
        required: true,
        message: '请输入机构英文标识',
        trigger: 'blur',
      },
    ],
    channelType: [
      {
        required: true,
        message: '请选择机构类型',
        trigger: 'change',
      },
    ],
    areas: [
      {
        type: 'array',
        required: true,
        message: '请选择业务允许范围',
        trigger: 'change',
      },
    ],
    channelLogo: [
      {
        required: true,
        message: '请上传机构LOGO',
        trigger: 'blur',
      },
    ],
    channelIcon: [
      {
        required: true,
        message: '请上传机构ICON',
        trigger: 'blur',
      },
    ],
    pageTitle: [
      {
        required: true,
        message: '请输入页面标题',
        trigger: 'blur',
      },
    ],
  })

  // 添加/保存 按钮
  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        isRecommend.value === true ? addChannelParams.isRecommend = 1 : addChannelParams.isRecommend = 2
        isLoading.value = true
        if (!isEdit.value) addChannelFunc(addChannelParams)
        else editChannelFunc(addChannelParams)
      } else return
    })
  }

  // 新增机构
  function addChannelFunc(addChannelParams) {
    addChannel(addChannelParams)
      .then(res => {
        console.log('addChannel: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/channel/list")
        }
      }, err => isLoading.value = false )
  }

  // 保存产品
  function editChannelFunc(addChannelParams) {
    editChannel(channelId.value, addChannelParams)
      .then(res => {
        console.log('editChannel: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/channel/list")
        }
      }, err => isLoading.value = false )
  }

  // 重置表单
  const resetForm = formEl => {
    if (!formEl) return
    if (!isEdit.value) {
      formEl.resetFields()
    } else {
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage("/channel/list")
    }
  }

</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.add-channel {
  
}

.citys-label{
  width: 100%;
  .el-form-item__content{
    width: 100%;
  }
}
.citys-list{
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  .city{
    flex: 0 1 auto;
    margin: 0 30px 0 0;
    .el-icon{
      cursor: pointer;
    }
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

.button-box{
  margin: 50px 0 0 120px;
}


</style>

