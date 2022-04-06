<template>
  <div class="container add-product">

    <h2>产品城市配置</h2>

    <el-form
      ref="ruleFormRef"
      :inline="true"
      :model="addProductParams"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-form-item label="产品名称" prop="productName">
        <div>{{addProductParams.productName}}</div>
      </el-form-item>
      <br/>
      <el-form-item label="业务城市" prop="areaCode">
        <el-cascader
          v-model=defaultCityArr
          :props="cityCascaderProps"
          @change=cityChange
        />
      </el-form-item>
      <br/>

      <el-form-item class="margin-right-0" label="贷款额度" prop="loanAmountMin">
        <el-input class="w-120" v-model="addProductParams.loanAmountMin" placeholder="请输入最低贷款额度" />
      </el-form-item>
      <el-form-item class="margin-right-0" label="" prop=""><span class="line"> ~ </span></el-form-item>
      <el-form-item class="margin-right-0" label="" prop="loanAmountMax">
        <el-input class="w-120" v-model="addProductParams.loanAmountMax" placeholder="请输入最高贷款额度" />
      </el-form-item>
      <el-form-item label="" prop="">
        <el-select class="w-60" v-model="addProductParams.loanAmountUnit">
          <el-option v-for="item in amountUnitOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item class="margin-right-0" label="贷款利率(%)" prop="loanRateMin">
        <el-input class="w-120" v-model="addProductParams.loanRateMin" placeholder="请输入最低贷款利率" />
      </el-form-item>
      <el-form-item class="margin-right-0" label="" prop=""><span class="line"> ~ </span></el-form-item>
      <el-form-item class="margin-right-0" label="" prop="loanRateMax">
        <el-input class="w-120" v-model="addProductParams.loanRateMax" placeholder="请输入最高贷款利率" />
      </el-form-item>
      <el-form-item label="" prop="">
        <el-select class="w-60" v-model="addProductParams.loanRateUnit">
          <el-option v-for="item in loanRateUnitOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <br/>

      <el-form-item class="margin-right-0" label="贷款期限" prop="loanTermMin">
        <el-input class="w-120" v-model="addProductParams.loanTermMin" placeholder="请输入最低贷款期限" />
      </el-form-item>
      <el-form-item class="margin-right-0" label="" prop=""><span class="line"> ~ </span></el-form-item>
      <el-form-item class="margin-right-0" label="" prop="loanTermMax">
        <el-input class="w-120" v-model="addProductParams.loanTermMax" placeholder="请输入最高贷款期限" />
      </el-form-item>
      <el-form-item label="" prop="">
        <el-select class="w-60" v-model="addProductParams.loanTermUnit">
          <el-option v-for="item in loanTermUnitOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      
      <el-form-item class="margin-right-0" label="办理速度" prop="processTimeMin">
        <el-input class="w-120" v-model="addProductParams.processTimeMin" placeholder="请输入最低办理速度" />
      </el-form-item>
      <el-form-item class="margin-right-0" label="" prop=""><span class="line"> ~ </span></el-form-item>
      <el-form-item class="margin-right-0" label="" prop="processTimeMax">
        <el-input class="w-120" v-model="addProductParams.processTimeMax" placeholder="请输入最高办理速度" />
      </el-form-item>
      <el-form-item label="" prop="">
        <el-select class="w-60" v-model="addProductParams.processTimeUnit">
          <el-option v-for="item in processTimeUnitOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <br/>

      <el-form-item label="产品描述" prop="entryCondition">
        <TinymceEditor 
          ref="editor" 
          :placeholder="'请输入产品描述'"
          :modelValue="addProductParams.entryCondition"
          v-model="addProductParams.entryCondition"
        />
      </el-form-item>
      <br/>

      <el-form-item label="所需资料" prop="requiredInformation">
        <el-input
          v-model="addProductParams.requiredInformation"
          :rows="5"
          type="textarea"
          placeholder="请输入所需资料"
        />
      </el-form-item>
      <br/>

      <el-form-item label="推荐寄语" prop="recommendMessage">
        <el-input v-model="addProductParams.recommendMessage" placeholder="请输入推荐寄语" />
      </el-form-item>
      <br/>

      <el-form-item label="产品标签" prop="tagAttr">
        <el-select v-model="addProductParams.tagAttr">
          <el-option v-for="item in tagAttrOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="tagType">
        <el-checkbox-group v-model="addProductParams.tagType">
          <el-checkbox name="type" v-for="item in tagTypeOptions" :key="item.value" :value="item.label" :label="item.value">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <br/>
      <!-- 产品标签动态 table -->
      <div class="tag-table" v-if="addProductParams.tagType.length > 0 && addProductParams.tagAttr">
        <div class="table" v-for="item in addProductParams.tagType" :key="item">
          <div class="th">{{returnTargetOptionsLabel(item, tagTypeOptions)}}</div>
          <div class="td">
            <el-checkbox-group v-model="tableTagIdsModel[item]" v-if="tableTagIdsArr[item] && tableTagIdsArr[item].length > 0">
              <el-checkbox name="type" v-for="item in tableTagIdsArr[item]" :key="item.id" :value="item.tagName" :label="item.id">{{item.tagName}}</el-checkbox>
            </el-checkbox-group>
            <p v-else>暂无该产品标签</p>
          </div>
        </div>
      </div>


      
      <el-form-item class="button-box">
        <el-button @click="resetForm(ruleFormRef)">取消</el-button>
        <el-button type="primary" :loading="isLoading" @click="submitForm(ruleFormRef)">{{routeObj.isEdit ? '保存' : '添加'}}</el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        addProductCity
      </el-col>
    </el-row>
    <el-button icon="Search" type="primary" @click="closeTab">关闭标签页</el-button> -->
  </div>
</template>

<script setup name="questionAdminAddQuestion">

  import { getChannelAreaList, getProductTag, addProductCity, getProductCityDetail, getChannelList, getSchemeList, editProductCity } from "@/api"
  import { ElMessage } from 'element-plus'
  import getEnumKeyArr from "@/hooks/getEnumKeyArr"
  import { deepClone } from "@/utils"

  import TinymceEditor from '@/components/tinymceEditor'

  const route = useRoute()
  const { proxy } = getCurrentInstance()

  // 贷款额度可选数据
  let amountUnitOptions = getEnumKeyArr('enumLoanAmountUnit')
  // 贷款利率可选数据
  let loanRateUnitOptions = getEnumKeyArr('enumLoanRateUnit')
  // 贷款期限可选数据
  let loanTermUnitOptions = getEnumKeyArr('enumLoanTermUnit')
  // 贷款利率可选数据
  let processTimeUnitOptions = getEnumKeyArr('enumProcessTimeUnit')
  // 产品标签可选数据
  let tagAttrOptions = getEnumKeyArr('enumTagAttr')
  // 产品标签分类可选数据
  let tagTypeOptions = reactive(getEnumKeyArr('enumTagType'))

  // 产品参数
  const addProductParams = reactive({
    productId: '',    // 产品 ID
    areaLevel: '',    // 金融机构区域等级：0 全国 1省份 2城市
    areaCode: '',    // 金融机构区域 Code
    loanAmountUnit: 1,    // 贷款额度单位(枚举 enumLoanAmountUnit)：1万 2元
    loanAmountMin: '',    // 贷款额度(最低)
    loanAmountMax: '',    // 贷款额度(最高)
    loanRateUnit: 2,    // 贷款利率单位(枚举 enumLoanRateUnit)：1日 2月 3年
    loanRateMin: '',    // 贷款利率(最低)
    loanRateMax: '',    // 贷款利率(最高)
    loanTermUnit: 2,    // 贷款期限单位(枚举 enumLoanTermUnit)：1日 2月 3年
    loanTermMin: '',    // 贷款期限(最低)
    loanTermMax: '',    // 贷款期限(最高)
    processTimeUnit: 1,    // 办理速度单位(枚举 enumProcessTimeUnit)：1日 2月
    processTimeMin: '',    // 办理速度(最低)
    processTimeMax: '',    // 办理速度(最高)
    entryCondition: '',    // 准入条件
    requiredInformation: '',    // 所需资料
    recommendMessage: '',    // 推荐寄语
    tagAttr: '',    // 产品标签归属(枚举 enumTagAttr)：1通用 2房 4车 8企业
    tagType: [],    // 产品标签分类 -> 提交时需要处理数据
    productTags: [],    // 产品标签
  })
  let isLoading = ref(false)

  let routeObj = ref({})
  if (route.query) {
    routeObj.value = route.query
    addProductParams.productId = route.query.id
    addProductParams.productName = route.query.productName
    if (routeObj.value.isEdit) getProductCityDetailFunc()
  }
  
  // 产品详情
  function getProductCityDetailFunc() {
    getProductCityDetail(routeObj.value.productCityId)
      .then(res => {
        console.log('getProductCityDetail: ', res);
        if (res.status) {
          addProductParams.areaLevel = res.data.areaLevel
          addProductParams.areaCode = res.data.areaCode
          let strProvinceCode = `${String(addProductParams.areaCode).substring(0, 2)}0000`
          if (addProductParams.areaLevel === 0) defaultCityArr.value = [0, 0]
          else defaultCityArr.value = [Number(strProvinceCode), addProductParams.areaCode]
          addProductParams.loanAmountUnit = res.data.loanAmountUnit
          addProductParams.loanAmountMin = res.data.loanAmountMin
          addProductParams.loanAmountMax = res.data.loanAmountMax
          addProductParams.loanRateUnit = res.data.loanRateUnit
          addProductParams.loanRateMin = res.data.loanRateMin
          addProductParams.loanRateMax = res.data.loanRateMax
          addProductParams.loanTermUnit = res.data.loanTermUnit
          addProductParams.loanTermMin = res.data.loanTermMin
          addProductParams.loanTermMax = res.data.loanTermMax
          addProductParams.processTimeUnit = res.data.processTimeUnit
          addProductParams.processTimeMin = res.data.processTimeMin
          addProductParams.processTimeMax = res.data.processTimeMax
          addProductParams.entryCondition = res.data.entryCondition
          addProductParams.requiredInformation = res.data.requiredInformation
          addProductParams.recommendMessage = res.data.recommendMessage
          console.log(res.data.tagAttr);
          addProductParams.tagAttr = res.data.tagAttr
          let tagTypeArr = []
          res.data.productTags.forEach(item => {
            tagTypeArr.push(item.tagType)
          })
          addProductParams.tagType = tagTypeArr
          addProductParams.productTags = res.data.productTags
        }
      })
  }

  
  // 业务城市相关
  const defaultCityArr = ref([])
  const cityCascaderProps = {
    lazy: true,
    lazyLoad: async (node, resolve) => {
      const { code } = node.data
      if (!code && code !== 0) {
        let { data } = await getChannelAreaList(routeObj.value.channelId, {level: 1, code: 0})
        data.map(item => {
          item.label = item.name
          item.value = item.code
          item.leaf >= 1
        })
        resolve(data)
      } else if (code === 0) {
        let arr = []
        let { data } = await getChannelAreaList(routeObj.value.channelId, {level: 2, code: code})
        data.label = data.name
        data.value = data.code
        data.leaf = 1
        arr.push(data)
        resolve(arr)
      } else {
        let { data } = await getChannelAreaList(routeObj.value.channelId, {level: 2, code: code})
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
    console.log('cityChange: ',e);
    if (e[0] === 0) addProductParams.areaLevel = 0
    else addProductParams.areaLevel = 2
    addProductParams.areaCode = e[1]
  }


  // 表单验证
  const ruleFormRef = ref()
  const rules = reactive({
    areaCode: [
      {
        required: true,
        message: '请选择业务城市',
        trigger: 'change',
      },
    ],
    loanAmountMin: [
      {
        required: true,
        message: '请输入最低贷款额度',
        trigger: 'blur',
      },
    ],
    loanAmountMax: [
      {
        required: true,
        message: '请输入最高贷款额度',
        trigger: 'blur',
      },
    ],
    loanRateMin: [
      {
        required: true,
        message: '请输入最低贷款利率',
        trigger: 'blur',
      },
    ],
    loanRateMax: [
      {
        required: true,
        message: '请输入最高贷款利率',
        trigger: 'blur',
      },
    ],
    loanTermMin: [
      {
        required: true,
        message: '请输入最低贷款期限',
        trigger: 'blur',
      },
    ],
    loanTermMax: [
      {
        required: true,
        message: '请输入最高贷款期限',
        trigger: 'blur',
      },
    ],
    processTimeMin: [
      {
        required: true,
        message: '请输入最低办理速度',
        trigger: 'blur',
      },
    ],
    processTimeMax: [
      {
        required: true,
        message: '请输入最高办理速度',
        trigger: 'blur',
      },
    ],

    entryCondition: [
      {
        required: true,
        message: '请输入产品描述',
        trigger: 'blur',
      },
    ],
    requiredInformation: [
      {
        required: true,
        message: '请输入所需资料',
        trigger: 'blur',
      },
    ],

    tagAttr: [
      {
        required: true,
        message: '请选择产品标签',
        trigger: 'change',
      },
    ],
    tagType: [
      {
        type: 'array',
        required: true,
        message: '请选择标签分类',
        trigger: 'change',
      },
    ],

  })

  function checkLoanAmountUnit() {
    let pass = true
    if (Number(addProductParams.loanAmountMin) > Number(addProductParams.loanAmountMax)) pass = '最小贷款额度不能大于最大贷款额度'
    if (addProductParams.loanAmountUnit === 1) {
      if (addProductParams.loanAmountMin*10000 > 1000000000 || addProductParams.loanAmountMax*10000 > 1000000000) pass = '贷款额度不超过10亿'
    } else {
      if (addProductParams.loanAmountMin > 1000000000 || addProductParams.loanAmountMax > 1000000000) pass = '贷款额度不超过10亿'
    }
    return pass
  }
  
  function checkLoanTermUnit() {
    let pass = true
    if (Number(addProductParams.loanTermMin) > Number(addProductParams.loanTermMax)) pass = '最小贷款期限不能大于最大贷款期限'
    if (addProductParams.loanTermUnit === 1) {
      if (Number(addProductParams.loanTermMin) > 30*12*30 && Number(addProductParams.loanTermMax) > 30*12*30) pass = '贷款期限不超过30年'
    } else if (addProductParams.loanTermUnit === 2) {
      if (Number(addProductParams.loanTermMin) > 12*30 || Number(addProductParams.loanTermMax) > 12*30) pass = '贷款期限不超过30年'
    } else {
      if (Number(addProductParams.loanTermMin) > 30 || Number(addProductParams.loanTermMax) > 30) pass = '贷款期限不超过30年'
    }
    return pass
  }
  
  function checkProcessTimeUnit() {
    let pass = true
    if (Number(addProductParams.processTimeMin) > Number(addProductParams.processTimeMax)) pass = '最小办理速度不能大于最大办理速度'
    if (addProductParams.processTimeUnit === 1) {
      if (Number(addProductParams.processTimeMin) > 90 || Number(addProductParams.processTimeMax) > 90) pass = '办理速度不超过90天'
    } else {
      if (Number(addProductParams.processTimeMin) > 3 || Number(addProductParams.processTimeMax) > 3) pass = '办理速度不超过90天'
    }
    return pass
  }

  async function checkForm() {
    return new Promise((resolve, reject) => {
      let loanAmountUnitData = checkLoanAmountUnit()
      let loanTermUnitData = checkLoanTermUnit()
      let processTimeUnitData = checkProcessTimeUnit()
      if (!loanAmountUnitData.length && !loanTermUnitData.length && !processTimeUnitData.length) resolve(true)
      else if (loanAmountUnitData.length) reject(loanAmountUnitData)
      else if (loanTermUnitData.length) reject(loanTermUnitData)
      else if (processTimeUnitData.length) reject(processTimeUnitData)
    })
  }


  // 添加/保存 按钮
  const submitForm = (formEl) => {
    if (!formEl) return
    formEl.validate(async (valid) => {
      if (valid) {
        try {
          let data = await checkForm()
          addProductParams.productTags = []
          addProductParams.tagType.forEach(tagType => {
            for (let i in tableTagIdsModel) {
              if (i == tagType) {
                let obj = { tagType, tagIds: [] }
                tableTagIdsModel[i].forEach(ids => obj.tagIds.push(ids))
                addProductParams.productTags.push(obj)
              }
            }
          })
          console.log(addProductParams);
          let newAddProductParams = deepClone(addProductParams)
          delete newAddProductParams.tagType

          console.log('newAddProductParams: ', newAddProductParams);
          isLoading.value = true
          if (!routeObj.value.isEdit) addProductCityFunc(newAddProductParams)
          else editProductCityFunc(newAddProductParams)

        } catch (err) { ElMessage.error(err) }
      } else return
    })
  }

  // 新增产品
  function addProductCityFunc(newAddProductParams) {
    addProductCity(newAddProductParams)
      .then(res => {
        console.log('addProductCity: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage(`/product/cityList?id=${addProductParams.productId}&productName=${addProductParams.productName}&channelId=${routeObj.value.channelId}`)
        }
      }, err => isLoading.value = false )
  }

  // 保存产品
  function editProductCityFunc(newAddProductParams) {
    editProductCity(routeObj.value.productCityId, newAddProductParams)
      .then(res => {
        console.log('editProductCity: ', res);
        isLoading.value = false
        if (res.status) {
          ElMessage.success(res.message)
          proxy.$tab.closeOpenPage()
          proxy.$tab.openPage(`/product/cityList?id=${addProductParams.productId}&productName=${addProductParams.productName}&channelId=${routeObj.value.channelId}`)
        }
      }, err => isLoading.value = false )
  }

  // 重置表单
  const resetForm = formEl => {
    if (!formEl) return
    if (!routeObj.value.isEdit) {
      formEl.resetFields()
    } else {
      proxy.$tab.closeOpenPage()
      proxy.$tab.openPage(`/product/cityList?id=${addProductParams.productId}&productName=${addProductParams.productName}&channelId=${routeObj.value.channelId}`)
    }
  }
  
  // 获取产品标签参数
  const getProductTagParams = reactive({
    page: 1,
    perPage: 1000,
    tagAttr: '',    // 产品标签归属(枚举 enumTagAttr)：1通用 2房 4车 8企业
    tagType: '',    // 产品标签分类(枚举 enumTagType)：1职业身份 2借款人资质 4资产资质 8特殊需求 16产品特征
  })
  // table产品标签数据
  const tableTagIdsArr = reactive({})
  const tableTagIdsModel = reactive({})
  // 获取产品标签方法
  const getProductTagFunc = (tagType) => {
    getProductTag({...getProductTagParams, tagType})
      .then(res => {
        console.log('getProductTag: ',res);
        if (res.status) {
          tableTagIdsArr[tagType] = res.data.items
          if (routeObj.value.isEdit) addProductParams.productTags.forEach(item => { tableTagIdsModel[item.tagType] = item.tagIds })
        }
      })
  }

  // 监控 tagAttr 和 tagType 属性
  watchEffect(() => {
    getProductTagParams.tagAttr = addProductParams.tagAttr
    addProductParams.tagType.forEach(item => {
      if (getProductTagParams.tagAttr) getProductTagFunc(item)
    })
  })

  // 根据id返回指定的的lebel
  const returnTargetOptionsLabel = (key, target) => target.filter(item => item.value === key )[0].label

</script>

<style lang="scss" scoped>
.container{
  margin: 20px;
  padding: 20px;
  background: #ffffff;
}

.w-120{
  width: 120px;
}
.line{
  margin: 0 6px;
}
.w-60{
  margin: 0 4px;
  width: 60px;
}
.margin-right-0 {
  margin-right: 0;
}

.add-product {
  
}


.tag-table{
  margin: 0 280px 20px 120px;
  border: solid 1px #e1e1e1;
  .table{
    display: flex;
    border-bottom: solid 1px #e1e1e1;
    .th{
      flex: 0 0 150px;
      border-right: solid 1px #e1e1e1;
    }
    .th,
    .td{
      padding: 30px;
    }
  }
  .table:last-child{
    border: none;
  }
}

.el-textarea{
  width: 30vw;
}

.schemes-label{
  width: 100%;
  .el-form-item__content{
    width: 100%;
  }
}
.schemes-list{
  display: flex;
  width: 100%;
  .scheme{
    flex: 0 1 auto;
    margin: 0 30px 0 0;
    .el-icon{
      cursor: pointer;
    }
  }
}

.button-box{
  margin: 50px 0 0 120px;
}
</style>

