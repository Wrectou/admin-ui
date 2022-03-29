<template>
  <div class="container add-product">

    <h2>产品标签信息</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addOperateCityParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >

      <el-form-item label="城市选择" prop="cityCode">
        <el-cascader
          v-model=defaultCityArr
          :disabled="isEdit"
          :props="cityCascaderProps"
          @change=cityChange
        />
      </el-form-item>
      <br/>
      <el-form-item label="运营方式" prop="operateModes">
        <el-checkbox-group v-model="addOperateCityParams.operateModes">
          <el-checkbox name="type" v-for="item in operateModeOptions" :key="item.value" :value="item.label" :label="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <br/>
      <el-form-item class="input" label="城市等级" prop="cityLevel">
        <el-input type="number" v-model="addOperateCityParams.cityLevel" placeholder="请输入正整数" />
      </el-form-item>
      <br/>
      <el-form-item label="运营状态">
        <el-switch v-model="operateStatus" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <br/>
      <el-form-item label="热门城市">
        <el-switch v-model="isHot" inline-prompt active-text="是" inactive-text="否" />
      </el-form-item>
      <br/>
      
      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">{{isEdit ? '保存' : '添加'}}</el-button>
      </el-form-item>

    </el-form>

  </div>
</template>

<script setup name="addOperateCity">

  import { getCommonCity, addOperateCity, getOperateCityDetail, editOperateCity } from "@/api"
  import { ElMessage } from 'element-plus'
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"
  import { deepClone } from "@/utils"
  import { regionCheckBoxList } from "@/utils/area-data"

  const route = useRoute()
  const { proxy } = getCurrentInstance()

  let operateModeOptions = getEnumKeyArr('enumOperateMode')
  let operateTypeOptions = [ { value: 1, label: '在线', }, { value: 2, label: '关闭', } ]
  
  // 业务城市相关
  const defaultCityArr = ref([])
  const cityCascaderProps = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
      const { code } = node.data
      if (!code && code !== 0) {
        let { data } = await getCommonCity({level: 1, parent: 0})
        data.map(item => {
          item.label = item.name
          item.value = item.code
          item.leaf >= 1
        })
        resolve(data)
      } else if (code === 0) {
        let arr = []
        let { data } = await getCommonCity({level: 2, parent: code})
        data.label = data.name
        data.value = data.code
        data.leaf = 1
        arr.push(data)
        resolve(arr)
      } else {
        let { data } = await getCommonCity({level: 2, parent: code})
        data.map(item => {
          item.label = item.name
          item.value = item.code
          item.leaf = 1
        })
        resolve(data)
      }
    }
  }
  // 城市选择
  function cityChange(e) {
    addOperateCityParams.provinceCode = e[0]
    addOperateCityParams.cityCode = e[1]
  }
  // 寻找具体省份
  function findProvince(code) {
    for (let item of regionCheckBoxList[0].CHILDREN) {
      for (let p of item.CHILDREN) {
        if (p.VALUE === code) return p
      }
    }
  }

  
  // 产品参数
  const addOperateCityParams = reactive({
    cityCode: '',    // 城市 Code
    cityName: '',    // 城市名称
    provinceCode: '',    // 省份 Code
    provinceName: '',    // 省份名称
    operateModes: [],    // 运营方式(枚举 enumOperateMode)：1门店直营 2有后台运营 3有经纪人
    operateStatus: 1,    // 运营状态：1在线 2离线
    cityLevel: '',    // 城市等级
    isHot: 2,    // 热门城市：1是 2否
  })
  let operateStatus = ref(true)
  let isHot = ref(false)
  let isLoading = ref(false)

  // 是否编辑？
  let isEdit = ref(false)
  let operateCityId = ref('')
  if (route.query.isEdit) {
    isEdit.value = true
    operateCityId.value = route.query.id
    getOperateCityDetailFunc()
  }
  
  // 产品详情
  async function getOperateCityDetailFunc() {
    getOperateCityDetail(operateCityId.value)
      .then(res => {
        console.log('getOperateCityDetail: ', res);
        if (res.status) {
          let strProvinceCode = `${String(res.data.cityCode).substring(0, 2)}0000`
          if (res.data.provinceCode === 0)  defaultCityArr.value = [0, 0]
          else defaultCityArr.value = [Number(strProvinceCode), res.data.cityCode]
          addOperateCityParams.provinceCode = res.data.provinceCode
          addOperateCityParams.cityCode = res.data.cityCode
          addOperateCityParams.operateModes = res.data.operateModes
          addOperateCityParams.cityLevel = res.data.cityLevel
          if (res.data.operateStatus === 2) operateStatus.value = false
          if (res.data.isHot === 1) isHot.value = true
        }
      })
  }

  // 表单验证
  const ruleFormRef = ref()
  const rules = reactive({
    cityCode: [
      {
        required: true,
        message: '请选择城市',
        trigger: 'change',
      },
    ],
    operateModes: [
      {
        type: 'array',
        required: true,
        message: '请选择运营方式',
        trigger: 'change',
      },
    ],
    cityLevel: [
      {
        required: true,
        message: '请选择城市等级',
        trigger: 'blur',
      },
    ],
  })

  // 添加/保存 按钮
  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate((valid) => {
      if (valid) {
        
      if (addOperateCityParams.provinceCode === 0) {
        addOperateCityParams.provinceName = '全国'
        addOperateCityParams.cityName = '全国'
      } else {
        let provinceInfo = findProvince(String(addOperateCityParams.provinceCode))
        provinceInfo.CHILDREN.forEach(item => {
          if (item.VALUE === String(addOperateCityParams.cityCode)) addOperateCityParams.cityName = item.TITLE
        })
        addOperateCityParams.provinceName = provinceInfo.TITLE
      }

        operateStatus.value === true ? addOperateCityParams.operateStatus = 1 : addOperateCityParams.operateStatus = 2
        isHot.value === true ? addOperateCityParams.isHot = 1 : addOperateCityParams.isHot = 2
        console.log('addOperateCityParams: ',addOperateCityParams);

        isLoading.value = true
        if (!isEdit.value) addOperateCityFunc(addOperateCityParams)
        else editOperateCityFunc(addOperateCityParams)

      } else return
    })
  }

  // 新增产品
  function addOperateCityFunc(addOperateCityParams) {
    addOperateCity(addOperateCityParams)
      .then(res => {
        console.log('addOperateCity: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/operateCity/list")
        }
      }, err => isLoading.value = false )
  }

  // 保存产品
  function editOperateCityFunc(addOperateCityParams) {
    editOperateCity(operateCityId.value, addOperateCityParams)
      .then(res => {
        console.log('editOperateCity: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage("/operateCity/list")
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
      proxy.$tab.openPage("/operateCity/list")
    }
  }
  
</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.input{
  width: 450px;
}
.margin{
  margin: 0 0 0 118px;
}

.button-box{
  margin: 50px 0 0 120px;
}
</style>

